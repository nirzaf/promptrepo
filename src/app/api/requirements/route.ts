import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const req = await prisma.requirement.findFirst({ orderBy: { id: 'desc' } })
    if (req && req.content) {
      return new NextResponse(req.content, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  } catch (e) {}

  try {
    const filePath = path.join(process.cwd(), 'requirements.md')
    const content = await fs.readFile(filePath, 'utf8')
    return new NextResponse(content, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read requirements.md' }, { status: 500 })
  }
}

