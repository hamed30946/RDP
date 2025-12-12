import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function DisclaimerPage() {
  return (
    <div className="section-container space-y-4">
      <h1 className="text-3xl font-bold">Disclaimer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          This tool is for authorized, internal media handling only. It does not and will not attempt watermark removal, DRM bypass,
          or scraping protected sources.
        </CardContent>
      </Card>
    </div>
  )
}
