'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { Loader } from '@/components/Loader'
import { slugify } from '@/lib/utils'
import { toast } from 'sonner'

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
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
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

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: slugManuallyEdited ? formData.slug : slugify(title),
    })
  }

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true)
    setFormData({ ...formData, slug })
  }

  const handleResetSlug = () => {
    setSlugManuallyEdited(false)
    setFormData({ ...formData, slug: slugify(formData.title) })
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
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
      toast.error('Erro ao criar página: ' + error.message)
      setSaving(false)
      return
    }

    toast.success('Página criada com sucesso!')
    setFormData({ title: '', slug: '', description: '' })
    setSlugManuallyEdited(false)
    setShowForm(false)
    setSaving(false)
    fetchPages()
  }

  const handleDeletePage = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta página?')) return

    const supabase = createClient()
    const { error } = await supabase.from('pages').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }

    toast.success('Página eliminada!')
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
        <Button onClick={() => { setShowForm(!showForm); setSlugManuallyEdited(false) }}>
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
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título da Página"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="slug-da-pagina"
                    required
                    className={slugManuallyEdited ? '' : 'bg-muted border-dashed'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleResetSlug}
                    title="Re-gerar slug a partir do título"
                    disabled={!formData.title}
                  >
                    ↻
                  </Button>
                </div>
                {!slugManuallyEdited && (
                  <p className="text-xs text-muted-foreground mt-1">Gerado automaticamente a partir do título</p>
                )}
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
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Spinner className="mr-2" />}
                {saving ? 'A criar...' : 'Criar Página'}
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
