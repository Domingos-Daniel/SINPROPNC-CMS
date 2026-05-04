'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from '@/components/Loader'

export default function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    site_name: '',
    site_tagline: '',
    site_description: '',
    site_footer: '',
    primary_color: '#0066cc',
    secondary_color: '#666666',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('settings').select('*')

    if (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
      return
    }

    const settingsMap: Record<string, any> = {}
    data?.forEach((item) => {
      settingsMap[item.setting_key] = item.setting_value?.value || item.setting_value
    })

    setFormData({
      site_name: settingsMap.site_name || '',
      site_tagline: settingsMap.site_tagline || '',
      site_description: settingsMap.site_description || '',
      site_footer: settingsMap.site_footer || '',
      primary_color: settingsMap.primary_color || '#0066cc',
      secondary_color: settingsMap.secondary_color || '#666666',
    })
    setSettings(settingsMap)
    setLoading(false)
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    try {
      for (const [key, value] of Object.entries(formData)) {
        const existingSetting = settings[key]

        if (existingSetting) {
          await supabase
            .from('settings')
            .update({ setting_value: { value } })
            .eq('setting_key', key)
        } else {
          await supabase.from('settings').insert([
            {
              setting_key: key,
              setting_value: { value },
            },
          ])
        }
      }

      alert('Configurações guardadas com sucesso!')
      fetchSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Erro ao guardar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader text="A carregar configurações..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Personalizar a configuração do site</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Site</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <Label htmlFor="site_name">Nome do Site</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  placeholder="Nome do Site"
                />
              </div>
              <div>
                <Label htmlFor="site_tagline">Tagline</Label>
                <Input
                  id="site_tagline"
                  value={formData.site_tagline}
                  onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
                  placeholder="Tagline do site"
                />
              </div>
              <div>
                <Label htmlFor="site_description">Descrição</Label>
                <Textarea
                  id="site_description"
                  value={formData.site_description}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                  placeholder="Descrição do site para SEO"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="site_footer">Texto do Rodapé</Label>
                <Textarea
                  id="site_footer"
                  value={formData.site_footer}
                  onChange={(e) => setFormData({ ...formData, site_footer: e.target.value })}
                  placeholder="Conteúdo do rodapé"
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="primary_color">Cor Principal</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-12 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#0066cc"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary_color">Cor Secundária</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-12 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    placeholder="#666666"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-3">Pré-visualização</p>
                <div className="flex gap-4">
                  <div
                    className="w-20 h-20 rounded-lg border-2"
                    style={{ backgroundColor: formData.primary_color }}
                  />
                  <div
                    className="w-20 h-20 rounded-lg border-2"
                    style={{ backgroundColor: formData.secondary_color }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={handleSaveSettings} disabled={saving} size="lg">
          {saving ? 'A guardar...' : 'Guardar Todas as Configurações'}
        </Button>
      </div>
    </div>
  )
}
