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
import { getAllIcons, getIcon } from '@/lib/icons'
import { toast } from 'sonner'

interface Principle {
  id: string
  title: string
  description: string
  icon_name: string
  is_active: boolean
  display_order: number
}

export default function PrinciplesManager() {
  const [principles, setPrinciples] = useState<Principle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Users',
  })

  useEffect(() => {
    fetchPrinciples()
  }, [])

  const fetchPrinciples = async () => {
    try {
      const supabase = createClient()

      const { data: allData, error: allError } = await supabase
        .from('principles')
        .select('*')

      console.log('All principles (no filter):', allData, allError)

      const { data, error } = await supabase
        .from('principles')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      console.log('Active principles:', data, error)

      if (error) {
        console.error('Error fetching principles:', error)
        toast.error('Erro ao carregar princípios: ' + error.message)
      } else if (data && data.length === 0) {
        const { data: all } = await supabase
          .from('principles')
          .select('*')

        console.log('All principles without filter:', all)

        if (all && all.length > 0) {
          setPrinciples(all)
        } else {
          setPrinciples([])
        }
      } else {
        setPrinciples(data || [])
      }
    } catch (err: any) {
      console.error('Exception fetching principles:', err)
      toast.error('Exceção: ' + err.message)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from('principles').update({
        title: formData.title,
        description: formData.description,
        icon_name: formData.icon_name,
      }).eq('id', editingId)

      if (error) {
        toast.error('Erro ao guardar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Princípio actualizado!')
    } else {
      const maxOrder = principles.length > 0
        ? Math.max(...principles.map(p => p.display_order))
        : 0

      const { error } = await supabase.from('principles').insert([{
        title: formData.title,
        description: formData.description,
        icon_name: formData.icon_name,
        is_active: true,
        display_order: maxOrder + 1,
      }])

      if (error) {
        toast.error('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Princípio criado com sucesso!')
    }

    resetForm()
    setSaving(false)
    fetchPrinciples()
  }

  const handleEdit = (principle: Principle) => {
    setFormData({
      title: principle.title,
      description: principle.description,
      icon_name: principle.icon_name,
    })
    setEditingId(principle.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    const { error } = await supabase.from('principles').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }
    toast.success('Princípio eliminado!')
    fetchPrinciples()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('principles').update({ is_active: !currentStatus }).eq('id', id)
    fetchPrinciples()
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', icon_name: 'Users' })
    setEditingId(null)
    setShowForm(false)
  }

  const iconOptions = getAllIcons()

  const handleSeedDefaults = async () => {
    const supabase = createClient()
    const defaults = [
      { title: 'Sindicalismo Democrático', description: 'Eleição periódica por escrutínio secreto dos órgãos estatutários.', icon_name: 'Users', is_active: true, display_order: 1 },
      { title: 'Estatutos e Regulamentos', description: 'Rege-se por estatutos aprovados democraticamente.', icon_name: 'Scale', is_active: true, display_order: 2 },
      { title: 'Defesa dos Interesses', description: 'Promove os interesses individuais e colectivos dos associados.', icon_name: 'Heart', is_active: true, display_order: 3 },
      { title: 'Participação Activa', description: 'Promove a participação de todos na actividade sindical.', icon_name: 'Users2', is_active: true, display_order: 4 },
    ]

    await supabase.from('principles').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { error } = await supabase.from('principles').insert(defaults)

    if (error) {
      console.error('Insert error:', error)
      toast.error('Erro ao criar princípios: ' + error.message)
    } else {
      toast.success('Princípios padrão criados com sucesso!')
      fetchPrinciples()
    }
  }

  if (loading) {
    return <Loader text="A carregar princípios..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Princípios</h1>
          <p className="text-gray-600 mt-2">Gerir princípios do SINPROPNC</p>
        </div>
        <div className="flex gap-2">
          {principles.length === 0 && (
            <Button variant="outline" onClick={handleSeedDefaults}>
              Criar Princípios Padrão
            </Button>
          )}
          <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
            {showForm ? 'Cancelar' : 'Novo Princípio'}
          </Button>
        </div>
      </div>

      {principles.length === 0 && !showForm && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800">Nenhum princípio encontrado. Clique em &quot;Criar Princípios Padrão&quot; para adicionar os princípios padrão do SINPROPNC.</p>
        </div>
      )}

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Princípio' : 'Novo Princípio'}</CardTitle>
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
                    placeholder="Ex: Sindicalismo Democrático"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon_name">Ícone</Label>
                  <select
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do princípio..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : editingId ? 'Guardar Alterações' : 'Criar Princípio'}
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
        {principles.map((principle) => {
          const IconComponent = getIcon(principle.icon_name)
          return (
            <Card key={principle.id} className={!principle.is_active ? 'opacity-50' : ''}>
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{principle.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{principle.description || 'Sem descrição'}</p>
                  <div className="flex gap-2">
                    <Button
                      variant={principle.is_active ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(principle.id, principle.is_active)}
                    >
                      {principle.is_active ? 'Ativo' : 'Off'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(principle)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(principle.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
