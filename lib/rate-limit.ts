const buckets = new Map<string, { count: number; expires: number }>()

export function consumeRateLimit(key: string, limit: number, windowMs = 60_000) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (bucket && bucket.expires > now) {
    if (bucket.count >= limit) return false
    bucket.count += 1
    return true
  }
  buckets.set(key, { count: 1, expires: now + windowMs })
  return true
}
