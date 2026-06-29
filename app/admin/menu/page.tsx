'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Loader } from '@/components/Loader'
import { Switch } from '@/components/ui/switch'
import { ArrowDown, ArrowUp, Edit2, ExternalLink, GripVertical, Plus, Trash2 } from 'lucide-react'
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
  const [reordering, setReordering] = useState(false)
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
    const { error } = await supabase.from('menu_items').update({ is_active: !currentStatus }).eq('id', id)
    if (error) {
      toast.error('Erro ao alterar estado: ' + error.message)
      return
    }
    fetchMenuItems()
  }

  const moveMenuItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = menuItems.findIndex((item) => item.id === id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= menuItems.length) return

    const nextItems = [...menuItems]
    const [moved] = nextItems.splice(currentIndex, 1)
    nextItems.splice(targetIndex, 0, moved)

    setMenuItems(nextItems.map((item, index) => ({ ...item, display_order: index })))
    setReordering(true)

    const supabase = createClient()
    const results = await Promise.all(
      nextItems.map((item, index) =>
        supabase.from('menu_items').update({ display_order: index }).eq('id', item.id)
      )
    )
    const error = results.find((result) => result.error)?.error

    setReordering(false)
    if (error) {
      toast.error('Erro ao reordenar menu: ' + error.message)
      fetchMenuItems()
      return
    }
    toast.success('Ordem do menu actualizada')
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
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu de Navegação</h1>
          <p className="text-gray-600 mt-2">Gerir, ordenar e pré-visualizar a navegação pública do website</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {!showForm && <Plus className="mr-2 h-4 w-4" />}
          {showForm ? 'Cancelar' : 'Novo item'}
        </Button>
      </div>

      <Card className="mb-8 overflow-hidden">
        <CardHeader>
          <CardTitle>Preview do Menu Público</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              {menuItems.filter((item) => item.is_active).length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum item activo para mostrar no website.</p>
              ) : (
                menuItems
                  .filter((item) => item.is_active)
                  .map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--cms-primary)] hover:text-[var(--cms-primary)]"
                    >
                      {item.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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

      <div className="space-y-3">
        {menuItems.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhum item criado. Crie o primeiro item do menu.
            </CardContent>
          </Card>
        ) : (
          menuItems.map((item, idx) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <GripVertical className="h-5 w-5 flex-shrink-0 text-slate-400" />
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <span className="text-sm font-semibold text-slate-500">{idx + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="truncate text-sm text-gray-500">{item.href}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="icon" disabled={idx === 0 || reordering} onClick={() => moveMenuItem(item.id, 'up')}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled={idx === menuItems.length - 1 || reordering} onClick={() => moveMenuItem(item.id, 'down')}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
                    <Switch checked={item.is_active} onCheckedChange={() => handleToggle(item.id, item.is_active)} />
                    <span className="text-sm text-slate-600">{item.is_active ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
