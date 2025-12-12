import { Client } from 'minio'

const bucket = process.env.S3_BUCKET || 'downloads'

export const storageClient = new Client({
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: Number(process.env.S3_PORT || 9000),
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
})

export async function ensureBucket() {
  const exists = await storageClient.bucketExists(bucket).catch(() => false)
  if (!exists) {
    await storageClient.makeBucket(bucket, '')
  }
}

export async function putObjectFromUrl(key: string, url: string) {
  await ensureBucket()
  const res = await fetch(url)
  if (!res.ok || !res.body) throw new Error('Download failed')
  await storageClient.putObject(bucket, key, res.body as any)
  return key
}

export async function getSignedUrl(key: string, expirySeconds = 900) {
  await ensureBucket()
  return storageClient.presignedGetObject(bucket, key, expirySeconds)
}
