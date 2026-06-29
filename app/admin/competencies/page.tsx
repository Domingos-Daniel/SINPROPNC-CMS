'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Loader } from '@/components/Loader'
import { Trash2, Edit2 } from 'lucide-react'
import { getIcon } from '@/lib/icons'
import { IconPicker } from '@/components/admin/IconPicker'
import { toast } from 'sonner'

interface Competency {
  id: string
  title: string
  description: string
  icon_name: string
  category: string
  is_active: boolean
  display_order: number
}

export default function CompetenciesManager() {
  const [competencies, setCompetencies] = useState<Competency[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Shield',
    category: 'main',
  })

  useEffect(() => {
    fetchCompetencies()
  }, [])

  const fetchCompetencies = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('competencies')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setCompetencies(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from('competencies').update({
        title: formData.title,
        description: formData.description,
        icon_name: formData.icon_name,
        category: formData.category,
      }).eq('id', editingId)

      if (error) {
        toast.error('Erro ao guardar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Competência actualizada!')
    } else {
      const maxOrder = competencies.length > 0
        ? Math.max(...competencies.map(c => c.display_order))
        : 0

      const { error } = await supabase.from('competencies').insert([{
        title: formData.title,
        description: formData.description,
        icon_name: formData.icon_name,
        category: formData.category,
        is_active: true,
        display_order: maxOrder + 1,
      }])

      if (error) {
        toast.error('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Competência criada com sucesso!')
    }

    resetForm()
    setSaving(false)
    fetchCompetencies()
  }

  const handleEdit = (competency: Competency) => {
    setFormData({
      title: competency.title,
      description: competency.description,
      icon_name: competency.icon_name,
      category: competency.category,
    })
    setEditingId(competency.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    const { error } = await supabase.from('competencies').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }
    toast.success('Competência eliminada!')
    fetchCompetencies()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('competencies').update({ is_active: !currentStatus }).eq('id', id)
    fetchCompetencies()
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', icon_name: 'Shield', category: 'main' })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredCompetencies = filter === 'all'
    ? competencies
    : competencies.filter(c => c.category === filter)

  if (loading) {
    return <Loader text="A carregar competências..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competências</h1>
          <p className="text-gray-600 mt-2">Gerir competências e atribuições do SINPROPNC</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancelar' : 'Nova Competência'}
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'main' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('main')}
        >
          Principais
        </Button>
        <Button
          variant={filter === 'secondary' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('secondary')}
        >
          Secundárias
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Competência' : 'Nova Competência'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Negociação Colectiva"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Ícone</Label>
                  <IconPicker
                    value={formData.icon_name}
                    onChange={(icon_name) => setFormData({ ...formData, icon_name })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="main">Principal</option>
                    <option value="secondary">Secundária</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da competência..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : editingId ? 'Guardar Alterações' : 'Criar Competência'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompetencies.map((competency) => {
          const IconComponent = getIcon(competency.icon_name)
          const isMain = competency.category === 'main'
          return (
            <Card key={competency.id} className={`${!competency.is_active ? 'opacity-50' : ''} ${isMain ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isMain ? 'bg-blue-600' : 'bg-neutral-100'}`}>
                    <IconComponent className={`w-6 h-6 ${isMain ? 'text-white' : 'text-neutral-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{competency.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${isMain ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-600'}`}>
                        {isMain ? 'Principal' : 'Secundária'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{competency.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant={competency.is_active ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggle(competency.id, competency.is_active)}
                      >
                        {competency.is_active ? 'Ativo' : 'Off'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(competency)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(competency.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
