import { prisma } from './prisma'

export async function auditLog(params: {
  userId?: string
  action: string
  input?: string
  outcome?: string
  ip?: string | null
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        input: params.input,
        outcome: params.outcome,
        ip: params.ip || undefined,
      },
    })
  } catch (err) {
    console.error('Audit log failed', err)
  }
}
