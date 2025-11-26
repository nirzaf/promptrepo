import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { eq } from "drizzle-orm"
import fs from "node:fs/promises"
import path from "node:path"
import * as dotenv from "dotenv"
import { users, categories as CategoriesTable, prompts as PromptsTable } from "../src/db/schema"
import { DEFAULT_CATEGORIES } from "../src/config/site"
import { generateId, generateSlug } from "../src/lib/utils"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

function parseFrontmatter(md: string): { data: Record<string, any>; body: string } {
  const start = md.indexOf("---")
  if (start !== 0) return { data: {}, body: md }
  const end = md.indexOf("\n---", 3)
  if (end === -1) return { data: {}, body: md }
  const header = md.slice(3, end).trim()
  const body = md.slice(end + 4).trim()
  const lines = header.split(/\r?\n/)
  const data: Record<string, any> = {}
  let inList = false
  let listKey = ""
  let list: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.endsWith(":")) {
      inList = true
      listKey = line.slice(0, -1)
      list = []
      continue
    }
    if (inList && line.startsWith("- ")) {
      list.push(line.slice(2).replace(/^"|"$/g, ""))
      data[listKey] = list
      continue
    }
    inList = false
    const idx = line.indexOf(":")
    if (idx > -1) {
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      data[key] = val
    }
  }
  return { data, body }
}

function toTitle(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function ensureSystemUser(db: ReturnType<typeof drizzle>) {
  const email = "system@promptvault.local"
  const existing = await db.select().from(users).where(eq(users.email, email))
  if (existing.length) return existing[0]
  const id = generateId()
  await db.insert(users).values({ id, email, name: "System", username: "system" })
  const created = await db.select().from(users).where(eq(users.id, id))
  return created[0]
}

function sanitizeColor(input: string | null | undefined): string | null {
  if (!input) return null
  const val = String(input).trim()
  if (val.startsWith('#') && (val.length === 4 || val.length === 7)) return val
  return null
}

async function getOrCreateCategory(db: ReturnType<typeof drizzle>, name?: string, icon?: string | null, color?: string | null) {
  if (!name) return null
  const byName = await db.select().from(CategoriesTable).where(eq(CategoriesTable.name, name))
  if (byName.length) return byName[0]
  const fallback = DEFAULT_CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase())
  const slug = generateSlug(fallback?.slug ?? name)
  const id = generateId()
  await db.insert(CategoriesTable).values({ id, name, slug, icon: icon ?? fallback?.icon ?? null, color: sanitizeColor(color ?? fallback?.color ?? null) })
  const created = await db.select().from(CategoriesTable).where(eq(CategoriesTable.id, id))
  return created[0]
}

async function upsertPrompt(db: ReturnType<typeof drizzle>, data: { slug: string; title: string; description: string | null; content: string; categoryId: string | null; userId: string }) {
  const { slug, title, description, content, categoryId, userId } = data
  try {
    await db.insert(PromptsTable).values({ id: generateId(), slug, title, description, content, categoryId: categoryId ?? undefined, userId, visibility: "public", status: "published" })
  } catch (e: any) {
    if (e.code !== "ER_DUP_ENTRY") throw e
    await db.update(PromptsTable).set({ title, description, content, categoryId: categoryId ?? undefined, status: "published", visibility: "public" }).where(eq(PromptsTable.slug, slug))
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined")
  const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } })
  const db = drizzle(connection)
  const systemUser = await ensureSystemUser(db)
  const dir = path.join(process.cwd(), "SamplePrompts")
  const entries = await fs.readdir(dir)
  const files = entries.filter((f) => f.toLowerCase().endsWith(".md"))
  for (const file of files) {
    const full = path.join(dir, file)
    const md = await fs.readFile(full, "utf8")
    const { data, body } = parseFrontmatter(md)
    const slug = file.replace(/\.md$/i, "").toLowerCase()
    const title = data.title || toTitle(slug)
    const description = data.description || null
    const categoryName = data.category || null
    const category = await getOrCreateCategory(db, categoryName || undefined, data.icon || null, data.color || null)
    await upsertPrompt(db, { slug, title, description, content: body, categoryId: category?.id ?? null, userId: systemUser.id })
  }
  await connection.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
