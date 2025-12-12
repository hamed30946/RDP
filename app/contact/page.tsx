'use client'
import { useState } from 'react'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<string | null>(null)

  const submit = async () => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setStatus(data.ok ? 'Message stored' : data.error)
    if (data.ok) setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="section-container space-y-4">
      <h1 className="text-3xl font-bold">Contact</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send us a note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Textarea
            rows={4}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <Button onClick={submit}>Send</Button>
          {status && <p className="text-sm text-slate-500">{status}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
