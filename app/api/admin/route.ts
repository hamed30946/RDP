import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const domains = await prisma.allowlistDomain.findMany()
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  const maxBulkSetting = await prisma.setting.findUnique({ where: { key: 'maxBulk' } })
  return NextResponse.json({
    domains,
    logs,
    maxBulk: maxBulkSetting?.value ? Number(maxBulkSetting.value) : 50,
  })
}
