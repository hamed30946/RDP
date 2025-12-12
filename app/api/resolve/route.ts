import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../lib/auth'
import { consumeRateLimit } from '../../../lib/rate-limit'
import { resolveInput, logResolution } from '../../../lib/resolver'

export async function POST(req: NextRequest) {
  const session = await auth()
  const body = await req.json()
  const input = String(body?.input || '')
  const limit = session?.user?.id ? session.user.rateLimit || 30 : 10
  const key = session?.user?.id || req.ip || 'anon'
  if (!consumeRateLimit(key, limit)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
  }
  const outcome = await resolveInput(input)
  await logResolution(session?.user?.id, 'RESOLVE', input, outcome.ok ? 'ok' : outcome.error || 'error', req.ip)
  return NextResponse.json(outcome)
}
