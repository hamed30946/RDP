'use client'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Textarea } from '../../components/ui/textarea'

interface Domain { id: string; domain: string }
interface Audit { id: string; action: string; input?: string; outcome?: string; createdAt: string }

export default function AdminPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [maxBulk, setMaxBulk] = useState(50)
  const [logs, setLogs] = useState<Audit[]>([])

  useEffect(() => {
    fetch('/api/admin').then(async (res) => {
      const data = await res.json()
      setDomains(data.domains)
      setMaxBulk(data.maxBulk || 50)
      setLogs(data.logs)
    })
  }, [])

  const addDomain = async () => {
    const res = await fetch('/api/admin/allowlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: newDomain }),
    })
    const data = await res.json()
    setDomains(data.domains)
    setNewDomain('')
  }

  const saveLimits = async () => {
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxBulk }),
    })
  }

  return (
    <div className="section-container space-y-6">
      <h1 className="text-3xl font-bold">Admin Console</h1>
      <Card>
        <CardHeader>
          <CardTitle>Domain allowlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="cdn.example.com" />
            <Button onClick={addDomain}>Add</Button>
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
            {domains.map((d) => (
              <li key={d.id}>{d.domain}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="text-sm">Max bulk size</label>
          <Input type="number" value={maxBulk} onChange={(e) => setMaxBulk(Number(e.target.value))} />
          <Button onClick={saveLimits}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-auto text-sm">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <div className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</div>
              <div>
                <div className="font-semibold">{log.action}</div>
                <div className="text-slate-500">{log.input}</div>
                <div className="text-slate-500">{log.outcome}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
