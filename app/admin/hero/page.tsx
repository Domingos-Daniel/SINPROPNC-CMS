'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Loader } from '@/components/Loader'
import { Trash2, Image as ImageIcon, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image_url: string | null
  background_image_url: string | null
  is_active: boolean
  display_order: number
}

export default function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    image_url: '',
    background_image_url: '',
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setSlides(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from('hero_slides').update({
        title: formData.title,
        subtitle: formData.subtitle,
        button_text: formData.button_text,
        button_link: formData.button_link,
        image_url: formData.image_url || null,
        background_image_url: formData.background_image_url || null,
      }).eq('id', editingId)

      if (error) {
        toast.error('Erro ao guardar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Slide actualizado!')
    } else {
      const maxOrder = slides.length > 0
        ? Math.max(...slides.map(s => s.display_order))
        : 0

      const { error } = await supabase.from('hero_slides').insert([{
        title: formData.title,
        subtitle: formData.subtitle,
        button_text: formData.button_text,
        button_link: formData.button_link,
        image_url: formData.image_url || null,
        background_image_url: formData.background_image_url || null,
        is_active: true,
        display_order: maxOrder + 1,
      }])

      if (error) {
        toast.error('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Slide criado com sucesso!')
    }

    resetForm()
    setSaving(false)
    fetchSlides()
  }

  const handleEdit = (slide: HeroSlide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      image_url: slide.image_url || '',
      background_image_url: slide.background_image_url || '',
    })
    setEditingId(slide.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }
    toast.success('Slide eliminado!')
    fetchSlides()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('hero_slides').update({ is_active: !currentStatus }).eq('id', id)
    fetchSlides()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      image_url: '',
      background_image_url: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <Loader text="A carregar slides..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600 mt-2">Gerir slides do carrousel da página inicial</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancelar' : 'Novo Slide'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Slide' : 'Novo Slide'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título principal do slide"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Descrição breve"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Texto do Botão</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Ex: Saber mais"
                  />
                </div>
                <div>
                  <Label htmlFor="button_link">Link do Botão</Label>
                  <Input
                    id="button_link"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="Ex: /sobre-nos"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="background_image_url">URL da Imagem de Fundo</Label>
                <Input
                  id="background_image_url"
                  value={formData.background_image_url}
                  onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem-fundo.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">URL da imagem de fundo do slide</p>
              </div>
              <div>
                <Label htmlFor="image_url">URL da Imagem (ilustração)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">URL da imagem ilustrativa do lado direito</p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : editingId ? 'Guardar Alterações' : 'Criar Slide'}
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
        {slides.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhum slide criado. Crie o primeiro slide.
            </CardContent>
          </Card>
        ) : (
          slides.map((slide, idx) => (
            <Card key={slide.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-medium">
                        {idx + 1}
                      </span>
                      <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm pl-11">{slide.subtitle}</p>
                    <div className="flex gap-4 mt-3 pl-11">
                      {slide.background_image_url && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ImageIcon className="w-3 h-3" />
                          <span>Fundo</span>
                        </div>
                      )}
                      {slide.image_url && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ImageIcon className="w-3 h-3" />
                          <span>Imagem</span>
                        </div>
                      )}
                      {slide.button_text && (
                        <span className="text-xs text-gray-500">Botão: {slide.button_text}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={slide.is_active ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(slide.id, slide.is_active)}
                    >
                      {slide.is_active ? 'Ativo' : 'Inativo'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(slide)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(slide.id)}
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
