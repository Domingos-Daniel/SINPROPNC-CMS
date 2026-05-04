'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/Loader'
import { Trash2, Edit2, GripVertical } from 'lucide-react'
import { getAllIcons, getIcon } from '@/lib/icons'

interface ServiceItem {
  id: string
  title: string
  icon_name: string
  link: string
  is_active: boolean
  display_order: number
}

export default function QuickServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    icon_name: 'Shield',
    link: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('quick_services')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setServices(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      await supabase.from('quick_services').update({
        title: formData.title,
        icon_name: formData.icon_name,
        link: formData.link,
      }).eq('id', editingId)
    } else {
      const maxOrder = services.length > 0 
        ? Math.max(...services.map(s => s.display_order)) 
        : 0

      await supabase.from('quick_services').insert([{
        title: formData.title,
        icon_name: formData.icon_name,
        link: formData.link,
        is_active: true,
        display_order: maxOrder + 1,
      }])
    }

    resetForm()
    fetchServices()
  }

  const handleEdit = (service: ServiceItem) => {
    setFormData({
      title: service.title,
      icon_name: service.icon_name,
      link: service.link,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    await supabase.from('quick_services').delete().eq('id', id)
    fetchServices()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('quick_services').update({ is_active: !currentStatus }).eq('id', id)
    fetchServices()
  }

  const resetForm = () => {
    setFormData({ title: '', icon_name: 'Shield', link: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const iconOptions = getAllIcons()

  if (loading) {
    return <Loader text="A carregar serviços..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços Rápidos</h1>
          <p className="text-gray-600 mt-2">Gerir botões de acesso rápido da página inicial</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancelar' : 'Novo Serviço'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title">Nome</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Jurídico"
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
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="Ex: /servicos#juridico"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Guardar Alterações' : 'Criar Serviço'}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {services.map((service) => {
          const IconComponent = getIcon(service.icon_name)
          return (
            <Card key={service.id} className={!service.is_active ? 'opacity-50' : ''}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3">{service.title}</h3>
                <div className="flex justify-center gap-1">
                  <Button
                    variant={service.is_active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle(service.id, service.is_active)}
                  >
                    {service.is_active ? 'Ativo' : 'Off'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}