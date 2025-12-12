import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { auth } from '../../../../lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const maxBulk = Number(body?.maxBulk || 50)
  await prisma.setting.upsert({ where: { key: 'maxBulk' }, update: { value: String(maxBulk) }, create: { key: 'maxBulk', value: String(maxBulk) } })
  return NextResponse.json({ ok: true })
}
