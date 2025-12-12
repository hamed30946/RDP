import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="section-container space-y-4">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Data handling</CardTitle>
        </CardHeader>
        <CardContent>
          We log actions for auditing with minimal personal data (user id, IP). Media is stored in object storage with expiring
          signed URLs.
        </CardContent>
      </Card>
    </div>
  )
}
