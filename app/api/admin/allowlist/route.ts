import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { auth } from '../../../../lib/auth'
import { auditLog } from '../../../../lib/audit'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const domain = String(body?.domain || '').trim().toLowerCase()
  if (!domain) return NextResponse.json({ error: 'Domain required' }, { status: 400 })
  await prisma.allowlistDomain.upsert({ where: { domain }, update: {}, create: { domain } })
  const domains = await prisma.allowlistDomain.findMany()
  await auditLog({ userId: session.user?.id, action: 'ALLOWLIST_ADD', input: domain, outcome: 'ok', ip: req.ip })
  return NextResponse.json({ domains })
}
