'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Loader } from '@/components/Loader'
import { Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface MenuItem {
  id: string
  label: string
  href: string
  is_active: boolean
  display_order: number
}

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    href: '',
  })

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setMenuItems(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from('menu_items').update({
        label: formData.label,
        href: formData.href.startsWith('/') ? formData.href : `/${formData.href}`,
      }).eq('id', editingId)

      if (error) {
        toast.error('Erro ao guardar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Item do menu actualizado!')
    } else {
      const maxOrder = menuItems.length > 0
        ? Math.max(...menuItems.map(m => m.display_order))
        : 0

      const { error } = await supabase.from('menu_items').insert([{
        label: formData.label,
        href: formData.href.startsWith('/') ? formData.href : `/${formData.href}`,
        is_active: true,
        display_order: maxOrder + 1,
      }])

      if (error) {
        toast.error('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Item do menu criado com sucesso!')
    }

    resetForm()
    setSaving(false)
    fetchMenuItems()
  }

  const handleEdit = (item: MenuItem) => {
    setFormData({
      label: item.label,
      href: item.href,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    const { error } = await supabase.from('menu_items').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }
    toast.success('Item do menu eliminado!')
    fetchMenuItems()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('menu_items').update({ is_active: !currentStatus }).eq('id', id)
    fetchMenuItems()
  }

  const resetForm = () => {
    setFormData({ label: '', href: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <Loader text="A carregar menu..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu de Navegação</h1>
          <p className="text-gray-600 mt-2">Gerir itens do menu de navegação</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancelar' : 'Novo Item'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Item do Menu' : 'Novo Item do Menu'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">Nome do Item</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Ex: Sobre Nós"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="href">URL (slug)</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    placeholder="Ex: /sobre-nos"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : editingId ? 'Guardar Alterações' : 'Criar Item'}
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
        {menuItems.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhum item criado. Crie o primeiro item do menu.
            </CardContent>
          </Card>
        ) : (
          menuItems.map((item, idx) => (
            <Card key={item.id}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 font-medium">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="text-gray-500 text-sm">{item.href}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={item.is_active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle(item.id, item.is_active)}
                  >
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
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
