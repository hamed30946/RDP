import ipaddr from 'ipaddr.js'

const privateCidrs = [
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  '127.0.0.0/8',
  '::1/128',
  'fc00::/7',
  'fe80::/10',
]

export const isPrivateAddress = (hostname: string): boolean => {
  try {
    const addr = ipaddr.parse(hostname)
    return privateCidrs.some((cidr) => addr.match(ipaddr.parseCIDR(cidr)))
  } catch {
    return false
  }
}

export const isAllowedDomain = (hostname: string, allowlist: string[]): boolean => {
  if (!hostname) return false
  const normalized = hostname.toLowerCase()
  return allowlist.some((domain) => normalized === domain || normalized.endsWith(`.${domain}`))
}
