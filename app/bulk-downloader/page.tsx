'use client'
import { useState } from 'react'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

interface JobRow {
  id: string
  input: string
  status: string
  downloadToken?: string
  error?: string
}

export default function BulkDownloaderPage() {
  const [inputs, setInputs] = useState('')
  const [rows, setRows] = useState<JobRow[]>([])
  const [loading, setLoading] = useState(false)

  const process = async () => {
    setLoading(true)
    const list = inputs
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 50)
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: list }),
    })
    const data = await res.json()
    const newRows = data.jobs as JobRow[]
    setRows(newRows)
    setLoading(false)
  }

  const refresh = async (id: string) => {
    const res = await fetch(`/api/jobs/${id}`)
    const data = await res.json()
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))
  }

  const copyLinks = () => {
    const success = rows.filter((r) => r.status === 'DONE' && r.downloadToken)
    const urls = success.map((r) => `${window.location.origin}/api/download?token=${r.downloadToken}`).join('\n')
    navigator.clipboard.writeText(urls)
  }

  const exportCsv = () => {
    const header = 'input,status,download\n'
    const body = rows
      .map((r) => `${r.input},${r.status},${r.downloadToken ? `/api/download?token=${r.downloadToken}` : ''}`)
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jobs.csv'
    a.click()
  }

  return (
    <div className="section-container space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bulk Downloader</h1>
        <p className="text-slate-600 dark:text-slate-300">Process up to 50 links (admin can raise to 500).</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submit links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={6}
            value={inputs}
            onChange={(e) => setInputs(e.target.value)}
            placeholder="One URL or asset ID per line"
          />
          <div className="flex gap-2">
            <Button onClick={process} disabled={loading}>
              {loading ? 'Queuing...' : 'Process Links'}
            </Button>
            <Button variant="outline" onClick={copyLinks}>
              Copy all successful links
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-auto card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Input</th>
              <th>Status</th>
              <th>Download</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="py-2 pr-4">{row.input}</td>
                <td>{row.status}</td>
                <td>
                  {row.downloadToken ? (
                    <a className="text-indigo-600" href={`/api/download?token=${row.downloadToken}`}>
                      Download
                    </a>
                  ) : row.error ? (
                    <span className="text-red-600">{row.error}</span>
                  ) : (
                    'Pending'
                  )}
                </td>
                <td>
                  <Button size="sm" variant="outline" onClick={() => refresh(row.id)}>
                    Refresh
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
