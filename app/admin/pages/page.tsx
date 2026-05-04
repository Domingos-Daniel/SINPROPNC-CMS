'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader } from '@/components/Loader'

interface Page {
  id: string
  slug: string
  title: string
  description: string
  is_published: boolean
  created_at: string
}

export default function PagesManager() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', slug: '', description: '' })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching pages:', error)
      setLoading(false)
      return
    }

    setPages(data || [])
    setLoading(false)
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const { error } = await supabase.from('pages').insert([
      {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        is_published: true,
      },
    ])

    if (error) {
      console.error('Error creating page:', error)
      return
    }

    setFormData({ title: '', slug: '', description: '' })
    setShowForm(false)
    fetchPages()
  }

  const handleDeletePage = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta página?')) return

    const supabase = createClient()
    const { error } = await supabase.from('pages').delete().eq('id', id)

    if (error) {
      console.error('Error deleting page:', error)
      return
    }

    fetchPages()
  }

  if (loading) {
    return <Loader text="A carregar páginas..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Páginas</h1>
          <p className="text-gray-600 mt-2">Gerir as páginas do site</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nova Página'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Criar Nova Página</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título da Página"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="slug-da-pagina"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da página"
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Página
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhuma página criada ainda. Crie a sua primeira página.
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{page.title}</h3>
                  <p className="text-sm text-gray-600">/{page.slug}</p>
                  <p className="text-xs text-gray-500 mt-1">{page.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/pages/${page.id}`}>Editar</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
