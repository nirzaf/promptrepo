import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'

const prisma = new PrismaClient()

async function main() {
  const filePath = path.join(process.cwd(), 'requirements.md')
  const content = await fs.readFile(filePath, 'utf8')
  await prisma.requirement.create({ data: { content } })
}

main().finally(() => prisma.$disconnect())
