import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getSignedUrl } from '../../../lib/storage'
import { auditLog } from '../../../lib/audit'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  const job = await prisma.job.findFirst({ where: { downloadToken: token } })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const url = await getSignedUrl(job.downloadToken!)
  await auditLog({ userId: job.userId || undefined, action: 'DOWNLOAD', input: job.input, outcome: 'signed', ip: req.ip })
  return NextResponse.redirect(url)
}
