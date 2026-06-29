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
import { Palette } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    site_name: '',
    site_tagline: '',
    site_description: '',
    site_footer: '',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    home_about_title: '',
    home_about_body: '',
    home_mission_title: '',
    home_mission_body: '',
    home_cta_title: '',
    home_cta_body: '',
    primary_color: '#0066cc',
    secondary_color: '#666666',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--cms-primary', formData.primary_color)
    document.documentElement.style.setProperty('--cms-secondary', formData.secondary_color)
    document.documentElement.style.setProperty('--primary', formData.primary_color)
    document.documentElement.style.setProperty('--accent', formData.secondary_color)
    document.documentElement.style.setProperty('--ring', formData.primary_color)
    document.documentElement.style.setProperty('--sidebar-primary', formData.primary_color)
  }, [formData.primary_color, formData.secondary_color])

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
      social_facebook: settingsMap.social_facebook || '',
      social_twitter: settingsMap.social_twitter || '',
      social_linkedin: settingsMap.social_linkedin || '',
      home_about_title: settingsMap.home_about_title || '',
      home_about_body: settingsMap.home_about_body || '',
      home_mission_title: settingsMap.home_mission_title || '',
      home_mission_body: settingsMap.home_mission_body || '',
      home_cta_title: settingsMap.home_cta_title || '',
      home_cta_body: settingsMap.home_cta_body || '',
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

      toast.success('Configurações guardadas com sucesso!')
      fetchSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Erro ao guardar configurações')
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
              <div>
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input
                  id="social_facebook"
                  value={formData.social_facebook}
                  onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="social_twitter">Twitter / X</Label>
                <Input
                  id="social_twitter"
                  value={formData.social_twitter}
                  onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                  placeholder="https://x.com/..."
                />
              </div>
              <div>
                <Label htmlFor="social_linkedin">LinkedIn</Label>
                <Input
                  id="social_linkedin"
                  value={formData.social_linkedin}
                  onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-[var(--cms-primary)]" />
              Tema Global
            </CardTitle>
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
                <p className="text-sm text-gray-600 mb-3">Pré-visualização aplicada ao website e ao CMS</p>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="bg-[var(--cms-primary)] px-5 py-4 text-white">
                    <p className="text-sm font-semibold uppercase tracking-wide opacity-75">SINPROPNC</p>
                    <p className="mt-1 text-xl font-bold">Cabeçalho institucional</p>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-md bg-[var(--cms-primary)] px-4 py-2 text-sm font-semibold text-white">
                        Botão principal
                      </span>
                      <span className="rounded-md bg-[var(--cms-secondary)] px-4 py-2 text-sm font-semibold text-white">
                        Destaque secundário
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 rounded-md border border-[var(--cms-primary)]/30 bg-[var(--cms-primary)]/10" />
                      <div className="h-16 rounded-md border border-[var(--cms-secondary)]/30 bg-[var(--cms-secondary)]/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Página Inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="home_about_title">Título Sobre</Label>
                <Input
                  id="home_about_title"
                  value={formData.home_about_title}
                  onChange={(e) => setFormData({ ...formData, home_about_title: e.target.value })}
                  placeholder="Sobre o SINPROPNC"
                />
              </div>
              <div>
                <Label htmlFor="home_about_body">Texto Sobre</Label>
                <Textarea
                  id="home_about_body"
                  value={formData.home_about_body}
                  onChange={(e) => setFormData({ ...formData, home_about_body: e.target.value })}
                  rows={5}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="home_mission_title">Título Missão</Label>
                <Input
                  id="home_mission_title"
                  value={formData.home_mission_title}
                  onChange={(e) => setFormData({ ...formData, home_mission_title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="home_mission_body">Texto Missão</Label>
                <Textarea
                  id="home_mission_body"
                  value={formData.home_mission_body}
                  onChange={(e) => setFormData({ ...formData, home_mission_body: e.target.value })}
                  rows={5}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="home_cta_title">Título CTA</Label>
              <Input
                id="home_cta_title"
                value={formData.home_cta_title}
                onChange={(e) => setFormData({ ...formData, home_cta_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="home_cta_body">Texto CTA</Label>
              <Input
                id="home_cta_body"
                value={formData.home_cta_body}
                onChange={(e) => setFormData({ ...formData, home_cta_body: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button onClick={handleSaveSettings} disabled={saving} size="lg">
          {saving && <Spinner className="mr-2" />}
          {saving ? 'A guardar...' : 'Guardar Todas as Configurações'}
        </Button>
      </div>
    </div>
  )
}
