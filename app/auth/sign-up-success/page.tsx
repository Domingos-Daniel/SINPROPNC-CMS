'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Verifique o seu Email</CardTitle>
          <CardDescription>
            Enviámos um link de confirmação para verificar a sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clique no link do seu email para confirmar a sua conta e começar a gerir o CMS.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Voltar ao Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
