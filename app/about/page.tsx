import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function AboutPage() {
  return (
    <div className="section-container space-y-6">
      <h1 className="text-3xl font-bold">About</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mission</CardTitle>
        </CardHeader>
        <CardContent>
          Internal-only downloader focused on security, compliance, and reliability. No scraping behind auth and no watermark removal.
        </CardContent>
      </Card>
    </div>
  )
}
