'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const submit = async () => {
    await signIn('sso', { email, name, callbackUrl: '/' })
  }

  return (
    <div className="section-container max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>SSO (placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={submit}>Sign in</Button>
        </CardContent>
      </Card>
    </div>
  )
}
