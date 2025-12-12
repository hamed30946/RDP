import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../lib/auth'
import { consumeRateLimit } from '../../../lib/rate-limit'
import { downloadQueue } from '../../../lib/queue'
import { prisma } from '../../../lib/prisma'
import { auditLog } from '../../../lib/audit'

export async function POST(req: NextRequest) {
  const session = await auth()
  const body = await req.json()
  const inputs: string[] = Array.isArray(body?.inputs) ? body.inputs : []
  const setting = await prisma.setting.findUnique({ where: { key: 'maxBulk' } })
  const limit = setting?.value ? Number(setting.value) : session?.user?.bulkLimit || 50
  if (inputs.length === 0) return NextResponse.json({ ok: false, error: 'No inputs' }, { status: 400 })
  if (inputs.length > limit) return NextResponse.json({ ok: false, error: `Max ${limit} items` }, { status: 400 })
  const key = session?.user?.id || req.ip || 'anon'
  if (!consumeRateLimit(key, limit)) return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })

  const jobs = await Promise.all(
    inputs.map(async (input) => {
      const job = await downloadQueue.add('download', { input, userId: session?.user?.id })
      await prisma.job.create({
        data: {
          id: job.id as string,
          input,
          status: 'QUEUED',
          userId: session?.user?.id,
        },
      })
      await auditLog({ userId: session?.user?.id, action: 'JOB_CREATED', input, outcome: 'queued', ip: req.ip })
      return { id: job.id, input, status: 'QUEUED' }
    })
  )
  return NextResponse.json({ ok: true, jobs })
}
