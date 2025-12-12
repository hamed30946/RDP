import { prisma } from './prisma'
import { isAllowedDomain, isPrivateAddress } from './ssrf'
import { auditLog } from './audit'

const mediaExtensions = ['.mp4', '.webm', '.mov']

function isMediaUrl(input: string) {
  try {
    const url = new URL(input)
    return mediaExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))
  } catch {
    return false
  }
}

async function getAllowlist() {
  const domains = await prisma.allowlistDomain.findMany()
  if (domains.length) return domains.map((d) => d.domain.toLowerCase())
  const envList = (process.env.ALLOWLIST_DOMAINS || 'localhost').split(',').map((d) => d.trim().toLowerCase())
  return envList
}

async function checkHostSafety(url: URL) {
  const allowlist = await getAllowlist()
  if (isPrivateAddress(url.hostname)) throw new Error('Blocked private address')
  if (!isAllowedDomain(url.hostname, allowlist)) throw new Error('Domain not allowed')
}

export async function resolveInput(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: 'Input required' }

  if (trimmed.startsWith('asset:')) {
    const id = trimmed.replace('asset:', '')
    const asset = await prisma.asset.findUnique({ where: { id } })
    if (!asset || !asset.approved) return { ok: false, error: 'Asset not approved' }
    return {
      ok: true,
      resolvedUrl: asset.url,
      filename: asset.title,
      mime: asset.mime,
      size: asset.size,
    }
  }

  if (isMediaUrl(trimmed)) {
    try {
      const url = new URL(trimmed)
      await checkHostSafety(url)
      return { ok: true, resolvedUrl: url.toString(), filename: url.pathname.split('/').pop() }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  }

  // Optional HTML mode
  try {
    const url = new URL(trimmed)
    await checkHostSafety(url)
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) throw new Error('Failed to fetch document')
    const html = await res.text()
    const match = html.match(/<video[^>]*src=["']([^"']+)["']/i) || html.match(/href=["']([^"']+\.(?:mp4|webm|mov))["']/i)
    if (match?.[1]) {
      const mediaUrl = new URL(match[1], url).toString()
      return { ok: true, resolvedUrl: mediaUrl }
    }
    return { ok: false, error: 'No media found' }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function logResolution(userId: string | undefined, action: string, input: string, outcome: string, ip?: string | null) {
  await auditLog({ userId, action, input, outcome, ip })
}
