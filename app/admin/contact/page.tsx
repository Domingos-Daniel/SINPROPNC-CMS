'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Loader } from '@/components/Loader'
import { Phone, Mail, MapPin, Clock, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface ContactItem {
  id: string
  label: string
  value: string
  icon: string
  is_active: boolean
  display_order: number
}

function ContactIconPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const options = [
    { value: 'phone', label: 'Telefone', icon: Phone },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'mapPin', label: 'Localização', icon: MapPin },
    { value: 'clock', label: 'Horário', icon: Clock },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {options.map((option) => {
        const Icon = option.icon
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
              selected
                ? 'border-[var(--cms-primary)] bg-[var(--cms-primary)] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-[var(--cms-primary)] hover:bg-slate-50'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function ContactManager() {
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: 'phone',
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setContacts(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from('contact_info').update({
        label: formData.label,
        value: formData.value,
        icon: formData.icon,
      }).eq('id', editingId)

      if (error) {
        toast.error('Erro ao guardar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Contacto actualizado!')
    } else {
      const maxOrder = contacts.length > 0
        ? Math.max(...contacts.map(c => c.display_order))
        : 0

      const { error } = await supabase.from('contact_info').insert([{
        label: formData.label,
        value: formData.value,
        icon: formData.icon,
        is_active: true,
        display_order: maxOrder + 1,
      }])

      if (error) {
        toast.error('Erro ao criar: ' + error.message)
        setSaving(false)
        return
      }
      toast.success('Contacto criado com sucesso!')
    }

    resetForm()
    setSaving(false)
    fetchContacts()
  }

  const handleEdit = (contact: ContactItem) => {
    setFormData({
      label: contact.label,
      value: contact.value,
      icon: contact.icon,
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar?')) return
    const supabase = createClient()
    const { error } = await supabase.from('contact_info').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }
    toast.success('Contacto eliminado!')
    fetchContacts()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from('contact_info').update({ is_active: !currentStatus }).eq('id', id)
    fetchContacts()
  }

  const resetForm = () => {
    setFormData({ label: '', value: '', icon: 'phone' })
    setEditingId(null)
    setShowForm(false)
  }

  const iconOptions = [
    { value: 'phone', label: 'Telefone', icon: Phone },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'mapPin', label: 'Localização', icon: MapPin },
    { value: 'clock', label: 'Horário', icon: Clock },
  ]

  if (loading) {
    return <Loader text="A carregar contactos..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Informações de Contacto</h1>
          <p className="text-gray-600 mt-2">Gerir informações de contacto do site</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancelar' : 'Novo Contacto'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Contacto' : 'Novo Contacto'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="label">Nome</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Ex: Telefone"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Ex: +244 923 000 000"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Ícone</Label>
                  <ContactIconPicker
                    value={formData.icon}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Spinner className="mr-2" />}
                  {saving ? 'A guardar...' : editingId ? 'Guardar Alterações' : 'Criar Contacto'}
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
        {contacts.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhum contacto criado. Crie o primeiro contacto.
            </CardContent>
          </Card>
        ) : (
          contacts.map((contact) => {
            const IconComponent = iconOptions.find(o => o.value === contact.icon)?.icon || Phone
            return (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        contact.icon === 'clock' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.label}</h3>
                        <p className="text-gray-600">{contact.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={contact.is_active ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggle(contact.id, contact.is_active)}
                      >
                        {contact.is_active ? 'Ativo' : 'Inativo'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
