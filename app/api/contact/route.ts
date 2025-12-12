import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { auditLog } from '../../../lib/audit'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const name = String(body?.name || '')
  const email = String(body?.email || '')
  const message = String(body?.message || '')
  if (!message) return NextResponse.json({ ok: false, error: 'Message required' }, { status: 400 })
  const record = await prisma.contactMessage.create({ data: { name, email, message } })
  await auditLog({ action: 'CONTACT', input: email, outcome: 'stored', ip: req.ip })
  return NextResponse.json({ ok: true, id: record.id })
}
