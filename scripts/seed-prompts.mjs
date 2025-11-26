import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'

const prisma = new PrismaClient()

function parseFrontmatter(md) {
  const start = md.indexOf('---')
  if (start !== 0) return { data: {}, body: md }
  const end = md.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: md }
  const header = md.slice(3, end).trim()
  const body = md.slice(end + 4).trim()
  const lines = header.split(/\r?\n/)
  const data = {}
  let inList = false
  let listKey = ''
  let list = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.endsWith(':')) {
      inList = true
      listKey = line.slice(0, -1)
      list = []
      continue
    }
    if (inList && line.startsWith('- ')) {
      list.push(line.slice(2).replace(/^"|"$/g, ''))
      data[listKey] = list
      continue
    }
    inList = false
    const idx = line.indexOf(':')
    if (idx > -1) {
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      data[key] = val
    }
  }
  return { data, body }
}

function toTitle(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function main() {
  const dir = path.join(process.cwd(), 'SamplePrompts')
  const entries = await fs.readdir(dir)
  const files = entries.filter((f) => f.toLowerCase().endsWith('.md'))
  for (const file of files) {
    const full = path.join(dir, file)
    const md = await fs.readFile(full, 'utf8')
    const { data, body } = parseFrontmatter(md)
    const slug = file.replace(/\.md$/i, '').toLowerCase()
    const title = data.title || toTitle(slug)
    const description = data.description || null
    const category = data.category || null
    const icon = data.icon || null
    const color = data.color || null
    const metadata = {}
    if (data.features) metadata.features = data.features
    if (data.lastUpdated) metadata.lastUpdated = data.lastUpdated
    await prisma.prompt.upsert({
      where: { slug },
      update: {
        title,
        description,
        category,
        icon,
        color,
        content: body,
        public: true,
        metadata,
      },
      create: {
        slug,
        title,
        description,
        category,
        icon,
        color,
        content: body,
        public: true,
        metadata,
      },
    })
  }
}

main().finally(() => prisma.$disconnect())
