'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

const links = [
  { href: '/', label: 'Home' },
  { href: '/bulk-downloader', label: 'Bulk Downloader' },
  { href: '/android-app', label: 'Android App' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="border-b border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-gradient">
          Sora Internal
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-indigo-600 ${pathname === link.href ? 'text-indigo-600 font-semibold' : 'text-slate-600 dark:text-slate-200'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="text-slate-500 hover:text-indigo-600">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
