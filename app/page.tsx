'use client'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'

interface ResolveResponse {
  ok: boolean
  resolvedUrl?: string
  filename?: string
  mime?: string
  size?: number
  error?: string
}

const features = [
  {
    title: 'Fast Video Download',
    body: 'Optimized queue + worker pipeline with Redis and S3-backed storage.',
  },
  { title: 'Secure by default', body: 'Allowlists, SSRF guardrails, audit logs, and rate limits.' },
  { title: 'Bulk friendly', body: 'Process batches safely with per-user limits and progress.' },
]

const steps = [
  'Paste a direct media URL or asset ID',
  'We validate and resolve using the allowlist + registry',
  'Download securely from object storage',
]

const testimonials = [
  {
    name: 'Compliance Lead',
    quote: 'We finally have a downloader that respects policy by design.',
  },
  {
    name: 'Media Ops',
    quote: 'Queues and audit logs keep stakeholders aligned.',
  },
  {
    name: 'Security',
    quote: 'No scraping or bypassing. Every event is recorded.',
  },
]

export default function HomePage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResolveResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })
      const data = (await res.json()) as ResolveResponse
      setResult(data)
      if (!data.ok) setError(data.error || 'Unable to resolve')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-container">
      <section className="text-center space-y-6 py-12">
        <p className="uppercase text-xs tracking-[0.2em] text-slate-500">Internal Only</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient">Sora Video Downloader</h1>
        <p className="text-slate-600 dark:text-slate-200 max-w-2xl mx-auto">
          Authorized media delivery behind SSO with strict compliance guardrails and complete auditability.
        </p>
        <div className="max-w-3xl mx-auto card p-6 grid gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              aria-label="Media URL or asset ID"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://cdn.example.com/video.mp4 or asset:1234"
            />
            <Button onClick={handleSubmit} disabled={loading} className="sm:w-40">
              {loading ? 'Resolving...' : 'Download'}
            </Button>
          </div>
          {result && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                {result.ok ? (
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{result.resolvedUrl}</div>
                    <div className="text-slate-500 text-sm">{result.filename}</div>
                    <div className="text-slate-500 text-sm">{result.mime}</div>
                    <div className="text-slate-500 text-sm">{result.size ? `${result.size} bytes` : null}</div>
                    <Button asChild variant="outline" className="mt-2">
                      <a href={result.resolvedUrl} download>
                        Download
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-red-600">{result.error || 'Resolution failed'}</p>
                )}
              </CardContent>
            </Card>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent>{f.body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12 grid sm:grid-cols-3 gap-4">
        {steps.map((step, idx) => (
          <Card key={step}>
            <CardHeader>
              <CardTitle>
                Step {idx + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>{step}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Guides</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {['iPhone', 'Android', 'Find direct URL'].map((g) => (
            <Card key={g}>
              <CardHeader>
                <CardTitle>{g}</CardTitle>
              </CardHeader>
              <CardContent>
                Use the allowlisted domains only. Copy the direct media link and paste it here; avoid any authentication-gated pages.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="1">
            <AccordionTrigger>Do you remove watermarks or DRM?</AccordionTrigger>
            <AccordionContent>Never. The service only works with authorized public media or registry assets.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>Is scraping supported?</AccordionTrigger>
            <AccordionContent>We avoid scraping behind authentication and respect domain allowlists.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>Are actions logged?</AccordionTrigger>
            <AccordionContent>Yes. Every resolve, job, and download is auditable.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="mt-12 grid sm:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <Card key={t.name}>
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
            </CardHeader>
            <CardContent>{t.quote}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Updates</h2>
        <div className="space-y-3">
          {['Added signed downloads', 'Expanded admin controls', 'Improved SSRF defenses'].map((item) => (
            <div key={item} className="card p-4 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <p className="text-sm text-slate-700 dark:text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 card p-6">
        <h2 className="text-xl font-semibold mb-2">Copyright & authorization</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Downloads require explicit authorization. We do not bypass DRM, remove watermarks, or access gated content.
        </p>
      </section>
    </div>
  )
}
