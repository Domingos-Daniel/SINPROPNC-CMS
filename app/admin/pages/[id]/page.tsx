'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { IconPicker } from '@/components/admin/IconPicker'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { slugify } from '@/lib/utils'
import {
  SECTION_LAYOUTS,
  createDefaultSectionContent,
  getSectionLayout,
  normalizeLayoutId,
  type SectionContent,
  type SectionItem,
} from '@/lib/section-layouts'
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
  content: SectionContent | null
}

const EMPTY_ITEM: SectionItem = {
  title: '',
  description: '',
  icon: 'Shield',
  value: '',
  link: '',
}

function normalizeContent(type: string, content?: SectionContent | null): SectionContent {
  return {
    ...createDefaultSectionContent(type),
    ...(content || {}),
  }
}

function SectionBuilderForm({
  type,
  content,
  onTypeChange,
  onContentChange,
  mode,
}: {
  type: string
  content: SectionContent
  onTypeChange?: (type: string) => void
  onContentChange: (content: SectionContent) => void
  mode: 'create' | 'edit'
}) {
  const layout = getSectionLayout(type)
  const items = content.items || []
  const groupedLayouts = useMemo(() => {
    return SECTION_LAYOUTS.reduce<Record<string, typeof SECTION_LAYOUTS>>((acc, item) => {
      acc[item.category] ||= []
      acc[item.category].push(item)
      return acc
    }, {})
  }, [])

  const update = (patch: Partial<SectionContent>) => onContentChange({ ...content, ...patch })
  const updateItem = (index: number, patch: Partial<SectionItem>) => {
    const next = [...items]
    next[index] = { ...next[index], ...patch }
    update({ items: next })
  }
  const addItem = () => update({ items: [...items, { ...EMPTY_ITEM }] })
  const removeItem = (index: number) => update({ items: items.filter((_, itemIndex) => itemIndex !== index) })

  return (
    <div className="space-y-6">
      {mode === 'create' && onTypeChange && (
        <div className="space-y-4">
          <Label>Tipo de layout</Label>
          {Object.entries(groupedLayouts).map(([category, layouts]) => (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{category}</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {layouts.map((layoutOption) => {
                  const selected = normalizeLayoutId(type) === layoutOption.id
                  return (
                    <button
                      key={layoutOption.id}
                      type="button"
                      onClick={() => {
                        onTypeChange(layoutOption.id)
                        onContentChange(createDefaultSectionContent(layoutOption.id))
                      }}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected
                          ? 'border-[var(--cms-primary)] bg-[var(--cms-primary)] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[var(--cms-primary)] hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-semibold">{layoutOption.name}</p>
                      <p className={`mt-1 text-sm ${selected ? 'text-white/75' : 'text-slate-500'}`}>
                        {layoutOption.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Eyebrow / Etiqueta</Label>
          <Input value={content.eyebrow || ''} onChange={(event) => update({ eyebrow: event.target.value })} placeholder="Ex: Institucional" />
        </div>
        <div>
          <Label>Variante</Label>
          <select
            value={content.variant || 'light'}
            onChange={(event) => update({ variant: event.target.value as SectionContent['variant'] })}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="light">Clara</option>
            <option value="brand">Marca</option>
            <option value="dark">Escura</option>
          </select>
        </div>
      </div>

      <div>
        <Label>Título</Label>
        <Input value={content.title || ''} onChange={(event) => update({ title: event.target.value })} placeholder="Título da secção" />
      </div>

      <div>
        <Label>Subtítulo</Label>
        <Input value={content.subtitle || ''} onChange={(event) => update({ subtitle: event.target.value })} placeholder="Texto curto de apoio" />
      </div>

      {!['card_grid', 'principles', 'competencies_main', 'competencies_secondary', 'stats_band', 'process_steps', 'faq_list'].includes(normalizeLayoutId(type)) && (
        <div>
          <Label>Conteúdo</Label>
          <Textarea value={content.content || ''} onChange={(event) => update({ content: event.target.value })} rows={5} placeholder="Conteúdo principal da secção" />
        </div>
      )}

      {normalizeLayoutId(type) === 'split_feature' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>URL da imagem</Label>
            <Input value={content.image_url || ''} onChange={(event) => update({ image_url: event.target.value })} placeholder="https://..." />
          </div>
          <div>
            <Label>Texto alternativo</Label>
            <Input value={content.image_alt || ''} onChange={(event) => update({ image_alt: event.target.value })} placeholder="Descrição da imagem" />
          </div>
        </div>
      )}

      {['split_feature', 'cta_banner'].includes(normalizeLayoutId(type)) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Texto do botão principal</Label>
            <Input value={content.button_text || ''} onChange={(event) => update({ button_text: event.target.value })} placeholder="Ex: Contactar" />
          </div>
          <div>
            <Label>Link do botão principal</Label>
            <Input value={content.button_link || ''} onChange={(event) => update({ button_link: event.target.value })} placeholder="/contacto" />
          </div>
          <div>
            <Label>Texto do botão secundário</Label>
            <Input value={content.secondary_button_text || ''} onChange={(event) => update({ secondary_button_text: event.target.value })} placeholder="Opcional" />
          </div>
          <div>
            <Label>Link do botão secundário</Label>
            <Input value={content.secondary_button_link || ''} onChange={(event) => update({ secondary_button_link: event.target.value })} placeholder="/servicos" />
          </div>
        </div>
      )}

      {layout.supportsItems && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label>{layout.itemLabel || 'Itens'}</Label>
              <p className="text-xs text-slate-500">Adicione, edite ou remova blocos desta secção.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700">{layout.itemLabel || 'Item'} {index + 1}</p>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {normalizeLayoutId(type) === 'stats_band' && (
                    <div>
                      <Label>Valor</Label>
                      <Input value={item.value || ''} onChange={(event) => updateItem(index, { value: event.target.value })} placeholder="Ex: 24h" />
                    </div>
                  )}
                  <div>
                    <Label>{normalizeLayoutId(type) === 'faq_list' ? 'Pergunta' : 'Título'}</Label>
                    <Input value={item.title || ''} onChange={(event) => updateItem(index, { title: event.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>{normalizeLayoutId(type) === 'faq_list' ? 'Resposta' : 'Descrição'}</Label>
                    <Textarea value={item.description || ''} onChange={(event) => updateItem(index, { description: event.target.value })} rows={3} />
                  </div>
                  {normalizeLayoutId(type) === 'card_grid' && (
                    <div className="md:col-span-2">
                      <Label>Ícone</Label>
                      <IconPicker value={item.icon || 'Shield'} onChange={(icon) => updateItem(index, { icon })} />
                    </div>
                  )}
                  {normalizeLayoutId(type) === 'card_grid' && (
                    <div className="md:col-span-2">
                      <Label>Link opcional</Label>
                      <Input value={item.link || ''} onChange={(event) => updateItem(index, { link: event.target.value })} placeholder="/servicos" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
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
  const [reordering, setReordering] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingType, setEditingType] = useState('editorial_text')
  const [editingContent, setEditingContent] = useState<SectionContent>(createDefaultSectionContent('editorial_text'))
  const [newSectionType, setNewSectionType] = useState('editorial_text')
  const [newSectionContent, setNewSectionContent] = useState<SectionContent>(createDefaultSectionContent('editorial_text'))
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    is_published: true,
  })

  useEffect(() => {
    fetchPageData()
  }, [pageId])

  const fetchPageData = async () => {
    const supabase = createClient()
    const { data: pageData, error: pageError } = await supabase.from('pages').select('*').eq('id', pageId).single()

    if (pageError) {
      toast.error('Erro ao carregar página: ' + pageError.message)
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

    const { data: sectionsData, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    if (sectionsError) {
      toast.error('Erro ao carregar secções: ' + sectionsError.message)
    } else {
      setSections(sectionsData || [])
    }
    setLoading(false)
  }

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: slugManuallyEdited ? formData.slug : slugify(title) })
  }

  const handleUpdatePage = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('pages')
      .update({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        is_published: formData.is_published,
        status: formData.is_published ? 'published' : 'draft',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    setSaving(false)
    if (error) {
      toast.error('Erro ao guardar: ' + error.message)
      return
    }
    toast.success('Página actualizada com sucesso')
  }

  const handleAddSection = async () => {
    setSectionSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('sections').insert({
      page_id: pageId,
      section_type: newSectionType,
      display_order: sections.length,
      content: newSectionContent,
      is_active: true,
    })

    setSectionSaving(false)
    if (error) {
      toast.error('Erro ao adicionar secção: ' + error.message)
      return
    }
    toast.success('Secção adicionada')
    setNewSectionType('editorial_text')
    setNewSectionContent(createDefaultSectionContent('editorial_text'))
    fetchPageData()
  }

  const startEditing = (section: Section) => {
    const normalizedType = normalizeLayoutId(section.section_type)
    setEditingSection(section.id)
    setEditingType(normalizedType)
    setEditingContent(normalizeContent(normalizedType, section.content))
  }

  const cancelEditing = () => {
    setEditingSection(null)
    setEditingContent(createDefaultSectionContent('editorial_text'))
  }

  const handleUpdateSection = async (sectionId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('sections')
      .update({
        section_type: editingType,
        content: editingContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sectionId)

    if (error) {
      toast.error('Erro ao guardar secção: ' + error.message)
      return
    }
    toast.success('Secção actualizada')
    cancelEditing()
    fetchPageData()
  }

  const duplicateSection = async (section: Section) => {
    const supabase = createClient()
    const { error } = await supabase.from('sections').insert({
      page_id: pageId,
      section_type: normalizeLayoutId(section.section_type),
      display_order: sections.length,
      content: section.content,
      is_active: true,
    })
    if (error) {
      toast.error('Erro ao duplicar: ' + error.message)
      return
    }
    toast.success('Secção duplicada')
    fetchPageData()
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Eliminar esta secção?')) return
    const supabase = createClient()
    const { error } = await supabase.from('sections').delete().eq('id', sectionId)
    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }
    toast.success('Secção eliminada')
    fetchPageData()
  }

  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex((section) => section.id === sectionId)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sections.length) return

    setReordering(true)
    const nextSections = [...sections]
    const [current] = nextSections.splice(currentIndex, 1)
    nextSections.splice(targetIndex, 0, current)
    setSections(nextSections.map((section, index) => ({ ...section, display_order: index })))

    const supabase = createClient()
    const updates = nextSections.map((section, index) =>
      supabase.from('sections').update({ display_order: index }).eq('id', section.id),
    )
    const results = await Promise.all(updates)
    setReordering(false)

    const error = results.find((result) => result.error)?.error
    if (error) {
      toast.error('Erro ao reordenar: ' + error.message)
      fetchPageData()
      return
    }
    toast.success('Ordem actualizada')
  }

  if (loading) return <div className="p-8">A carregar...</div>

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button variant="outline" onClick={() => router.back()}>Voltar</Button>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Editor de Página</h1>
          <p className="mt-1 text-gray-600">{page?.title}</p>
        </div>
        <Button asChild variant="outline">
          <a href={`/${formData.slug}`} target="_blank" rel="noreferrer">Ver página pública</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePage} className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input value={formData.title} onChange={(event) => handleTitleChange(event.target.value)} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true)
                      setFormData({ ...formData, slug: event.target.value })
                    }}
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} rows={3} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                  <Label>Publicada</Label>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : 'Guardar página'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.length === 0 ? (
                <p className="text-sm text-slate-500">Ainda não existem secções.</p>
              ) : (
                sections.map((section, index) => {
                  const layout = getSectionLayout(section.section_type)
                  return (
                    <div key={section.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                      <GripVertical className="h-4 w-4 text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{section.content?.title || layout.name}</p>
                        <p className="text-xs text-slate-500">{layout.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button type="button" variant="outline" size="icon" disabled={index === 0 || reordering} onClick={() => moveSection(section.id, 'up')}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" size="icon" disabled={index === sections.length - 1 || reordering} onClick={() => moveSection(section.id, 'down')}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar secção profissional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SectionBuilderForm
                mode="create"
                type={newSectionType}
                content={newSectionContent}
                onTypeChange={setNewSectionType}
                onContentChange={setNewSectionContent}
              />
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview ao vivo</p>
                <SectionRenderer type={newSectionType} content={newSectionContent} preview />
              </div>
              <Button onClick={handleAddSection} className="w-full" disabled={sectionSaving}>
                {sectionSaving && <Spinner className="mr-2" />}
                {sectionSaving ? 'A adicionar...' : 'Adicionar secção'}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const normalizedType = normalizeLayoutId(section.section_type)
              const layout = getSectionLayout(normalizedType)
              const isEditing = editingSection === section.id
              const displayContent = normalizeContent(normalizedType, section.content)

              return (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Secção {index + 1}</p>
                        <CardTitle className="mt-1">{displayContent.title || layout.name}</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">{layout.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => moveSection(section.id, 'up')} disabled={index === 0 || reordering}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveSection(section.id, 'down')} disabled={index === sections.length - 1 || reordering}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => duplicateSection(section)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => (isEditing ? cancelEditing() : startEditing(section))}>
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteSection(section.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {isEditing ? (
                      <>
                        <SectionBuilderForm
                          mode="edit"
                          type={editingType}
                          content={editingContent}
                          onContentChange={setEditingContent}
                        />
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview da edição</p>
                          <SectionRenderer type={editingType} content={editingContent} preview />
                        </div>
                        <Button onClick={() => handleUpdateSection(section.id)} className="w-full">
                          Guardar secção
                        </Button>
                      </>
                    ) : (
                      <SectionRenderer type={normalizedType} content={displayContent} preview />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
