import 'dotenv/config'
import { registerWorker } from '../lib/queue'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('Starting worker...')
  registerWorker()
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
