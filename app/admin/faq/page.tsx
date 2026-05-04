'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from '@/components/Loader'
import { Trash2, Edit2 } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  is_active: boolean
  display_order: number
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  })

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setFaqs(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      await supabase.from('faqs').update({
        question: formData.question,
        answer: formData.answer,
      }).eq('id', editingId)
    } else {
      const maxOrder = faqs.length > 0 
        ? Math.max(...faqs.map(f => f.display_order)) 
        : 0

      await supabase.from('faqs').insert([{
        question: formData.question,
        answer: formData.answer,
        is_active: true,
        display_order: maxOrder + 1,
      }])
    }

    resetForm()
    fetchFaqs()
  }

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
    })
    setEditingId(faq.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    await supabase.from('faqs').delete().eq('id', id)
    fetchFaqs()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('faqs').update({ is_active: !currentStatus }).eq('id', id)
    fetchFaqs()
  }

  const resetForm = () => {
    setFormData({ question: '', answer: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <Loader text="A carregar FAQs..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h1>
          <p className="text-gray-600 mt-2">Gerir FAQs da página de contacto</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancelar' : 'Nova FAQ'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar FAQ' : 'Nova Pergunta Frequente'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question">Pergunta</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Ex: Como me filio ao SINPROPNC?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="answer">Resposta</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Escreva a resposta..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Guardar Alterações' : 'Criar FAQ'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhuma FAQ criada. Crie a primeira pergunta frequente.
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq, idx) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{idx + 1}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <p className="text-gray-600 pl-11">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={faq.is_active ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(faq.id, faq.is_active)}
                    >
                      {faq.is_active ? 'Ativa' : 'Inativa'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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