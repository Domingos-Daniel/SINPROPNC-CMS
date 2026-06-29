'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/Loader'
import { Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  created_at: string
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar mensagens: ' + error.message)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (error) {
      toast.error('Erro ao actualizar: ' + error.message)
      return
    }
    toast.success('Mensagem actualizada')
    fetchMessages()
  }

  if (loading) {
    return <Loader text="A carregar mensagens..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-600 mt-2">Pedidos recebidos através do formulário do website</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhuma mensagem recebida ainda.
            </CardContent>
          </Card>
        ) : (
          messages.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status === 'new' ? 'Nova' : 'Tratada'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{item.subject}</p>
                    <p className="text-gray-600 whitespace-pre-line">{item.message}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                      <a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 hover:text-blue-700">
                        <Mail className="w-4 h-4" />
                        {item.email}
                      </a>
                      {item.phone && (
                        <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-blue-700">
                          <Phone className="w-4 h-4" />
                          {item.phone}
                        </a>
                      )}
                      <span>{new Date(item.created_at).toLocaleString('pt-PT')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={item.status === 'new' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStatus(item.id, item.status === 'new' ? 'done' : 'new')}
                    >
                      {item.status === 'new' ? 'Marcar Tratada' : 'Reabrir'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
