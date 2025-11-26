import { NextResponse } from 'next/server'
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
    return NextResponse.json({ error: 'No requirements content in database' }, { status: 404 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load requirements from database' }, { status: 500 })
  }
}

