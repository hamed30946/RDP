import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <h4 className="font-semibold mb-2">About</h4>
          <p className="text-slate-500">Internal media distribution built for compliance.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Company</h4>
          <div className="flex flex-col gap-1">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Legal</h4>
          <div className="flex flex-col gap-1">
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Compliance</h4>
          <p className="text-slate-500">No watermark removal. Authorized media only.</p>
        </div>
      </div>
    </footer>
  )
}
