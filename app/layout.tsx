import './globals.css'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import { ThemeProvider } from '../components/theme-provider'
import type { Metadata } from 'next'
import { NextAuthProvider } from '../components/auth-provider'

export const metadata: Metadata = {
  title: 'Sora Internal Downloader',
  description: 'Secure media delivery inside the network.',
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <NextAuthProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
