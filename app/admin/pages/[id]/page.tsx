'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { slugify } from '@/lib/utils'
import { toast } from 'sonner'

interface PageData {
  id: string
  slug: string
  title: string
  description: string
  is_published: boolean
}

interface Section {
  id: string
  section_type: string
  display_order: number
  content: {
    title?: string
    subtitle?: string
    content?: string
    items?: Array<{ title: string; description: string; icon: string }>
  }
}

export default function PageEditor() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string

  const [page, setPage] = useState<PageData | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sectionSaving, setSectionSaving] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    is_published: true,
  })
  const [newSection, setNewSection] = useState({
    type: 'text',
    title: '',
    subtitle: '',
    content: ''
  })
  const [editingSection, setEditingSection] = useState<string | null>(null)

  useEffect(() => {
    fetchPageData()
  }, [pageId])

  const fetchPageData = async () => {
    const supabase = createClient()

    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (pageError) {
      console.error('Error fetching page:', pageError)
      setLoading(false)
      return
    }

    setPage(pageData)
    setFormData({
      title: pageData.title,
      slug: pageData.slug,
      description: pageData.description || '',
      is_published: pageData.is_published,
    })

    const { data: sectionsData } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    setSections(sectionsData || [])
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

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('pages')
      .update({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    if (error) {
      console.error('Error updating page:', error)
      toast.error('Erro ao guardar: ' + error.message)
      setSaving(false)
      return
    }

    toast.success('Página actualizada com sucesso!')
    setSaving(false)
  }

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault()
    setSectionSaving(true)
    const supabase = createClient()

    const sectionContent: any = {
      title: newSection.title || null,
      subtitle: newSection.subtitle || null,
      content: newSection.content || null,
    }

    const { error } = await supabase.from('sections').insert([
      {
        page_id: pageId,
        section_type: newSection.type,
        display_order: sections.length,
        content: sectionContent,
      },
    ])

    if (error) {
      console.error('Error adding section:', error)
      toast.error('Erro ao adicionar secção: ' + error.message)
      setSectionSaving(false)
      return
    }

    toast.success('Secção adicionada!')
    setNewSection({ type: 'text', title: '', subtitle: '', content: '' })
    setSectionSaving(false)
    fetchPageData()
  }

  const handleUpdateSection = async (sectionId: string, updatedContent: any) => {
    const supabase = createClient()

    const { error } = await supabase
      .from('sections')
      .update({ content: updatedContent })
      .eq('id', sectionId)

    if (error) {
      console.error('Error updating section:', error)
      toast.error('Erro ao guardar secção: ' + error.message)
      return
    }

    toast.success('Secção actualizada!')
    setEditingSection(null)
    fetchPageData()
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Eliminar esta secção?')) return

    const supabase = createClient()
    const { error } = await supabase.from('sections').delete().eq('id', sectionId)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }

    toast.success('Secção eliminada!')
    fetchPageData()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Editar Página</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Página</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePage} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
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
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_published: checked })
                    }
                  />
                  <Label>Publicada</Label>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : 'Guardar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Nova Secção</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSection} className="space-y-4">
                <div>
                  <Label htmlFor="section-type">Tipo de Secção</Label>
                  <select
                    id="section-type"
                    value={newSection.type}
                    onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="text">Texto</option>
                    <option value="cards">Cards (manual)</option>
                    <option value="principles">Princípios (da BD)</option>
                    <option value="competencies_main">Competências Principais (da BD)</option>
                    <option value="competencies_secondary">Competências Secundárias (da BD)</option>
                    <option value="image_text">Imagem + Texto</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="section-title">Título</Label>
                  <Input
                    id="section-title"
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder="Título da secção (opcional)"
                  />
                </div>
                <div>
                  <Label htmlFor="section-subtitle">Subtítulo</Label>
                  <Input
                    id="section-subtitle"
                    value={newSection.subtitle}
                    onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                    placeholder="Subtítulo (opcional)"
                  />
                </div>
                <div>
                  <Label htmlFor="section-content">Conteúdo</Label>
                  <Textarea
                    id="section-content"
                    value={newSection.content}
                    onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                    placeholder="Conteúdo da secção"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={sectionSaving}>
                  {sectionSaving && <Spinner className="mr-2" />}
                  {sectionSaving ? 'A adicionar...' : 'Adicionar Secção'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{section.section_type}</p>
                    <h3 className="font-semibold text-gray-900">
                      {section.content?.title || 'Secção sem título'}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingSection(editingSection === section.id ? null : section.id)
                      }
                    >
                      {editingSection === section.id ? 'Cancelar' : 'Editar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {editingSection === section.id && (
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      defaultValue={section.content?.title || ''}
                      id={`edit-title-${section.id}`}
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      defaultValue={section.content?.subtitle || ''}
                      id={`edit-subtitle-${section.id}`}
                    />
                  </div>
                  <div>
                    <Label>Conteúdo</Label>
                    <Textarea
                      defaultValue={section.content?.content || ''}
                      id={`edit-content-${section.id}`}
                      rows={6}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const titleInput = document.getElementById(
                        `edit-title-${section.id}`
                      ) as HTMLInputElement
                      const subtitleInput = document.getElementById(
                        `edit-subtitle-${section.id}`
                      ) as HTMLInputElement
                      const contentInput = document.getElementById(
                        `edit-content-${section.id}`
                      ) as HTMLTextAreaElement
                      handleUpdateSection(section.id, {
                        title: titleInput.value,
                        subtitle: subtitleInput.value,
                        content: contentInput.value,
                      })
                    }}
                    className="w-full"
                  >
                    Guardar Alterações
                  </Button>
                </CardContent>
              )}
              {editingSection !== section.id && (
                <CardContent>
                  {section.content?.subtitle && (
                    <p className="text-gray-500 text-sm mb-2 italic">{section.content.subtitle}</p>
                  )}
                  <p className="text-gray-600 text-sm">{section.content?.content}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
