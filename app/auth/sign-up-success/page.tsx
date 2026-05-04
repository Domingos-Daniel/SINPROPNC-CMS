'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Conta Criada com Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A sua conta de administrador foi criada. Já pode aceder ao painel de administração.
          </p>
          <Button asChild className="w-full">
            <Link href="/admin">Ir para o Admin</Link>
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:underline">
              Ou entrar com outra conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}