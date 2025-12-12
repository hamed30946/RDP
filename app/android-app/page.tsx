import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export default function AndroidAppPage() {
  return (
    <div className="section-container space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Android Companion</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Install the vetted Android helper to push authorized downloads to your device. No impersonation or scraping.
        </p>
        <Button className="mx-auto">Request Access</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Secure pairing</CardTitle>
          </CardHeader>
          <CardContent>Uses SSO tokens; never stores credentials on-device.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offline ready</CardTitle>
          </CardHeader>
          <CardContent>Queue downloads while on VPN and sync when available.</CardContent>
        </Card>
      </div>
    </div>
  )
}
