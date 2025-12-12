import { Queue, Worker, Job } from 'bullmq'
import { redisConfig } from './redis'
import { resolveInput } from './resolver'
import { prisma } from './prisma'
import { auditLog } from './audit'
import { putObjectFromUrl } from './storage'
import crypto from 'crypto'

export const downloadQueue = new Queue('downloadQueue', {
  connection: redisConfig,
})

export function registerWorker() {
  const worker = new Worker(
    'downloadQueue',
    async (job: Job) => {
      const { input, userId } = job.data as { input: string; userId?: string }
      const resolution = await resolveInput(input)
      if (!resolution.ok || !resolution.resolvedUrl) {
        throw new Error(resolution.error || 'Unable to resolve')
      }
      const key = `${crypto.randomUUID()}`
      await putObjectFromUrl(key, resolution.resolvedUrl)
      const downloadToken = crypto.randomUUID()
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: 'DONE',
          resolvedUrl: resolution.resolvedUrl,
          downloadToken,
          fileName: resolution.filename,
          mime: resolution.mime,
          size: resolution.size,
        },
      })
      await auditLog({
        userId,
        action: 'JOB_COMPLETED',
        input,
        outcome: key,
      })
      return { downloadToken }
    },
    { connection: redisConfig }
  )
  worker.on('failed', async (job, err) => {
    if (!job) return
    await prisma.job.update({ where: { id: job.id }, data: { status: 'ERROR', error: err.message } })
  })
  return worker
}
