import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.prompt.count()
  const rows = await prisma.prompt.findMany({ select: { slug: true, title: true }, orderBy: { id: 'asc' }, take: 5 })
  console.log('prompt_count', count)
  console.log('first_prompts', rows)
}

main().finally(() => prisma.$disconnect())
