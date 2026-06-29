'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/Loader'
import { Spinner } from '@/components/ui/spinner'
import { Copy, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface SiteAsset {
  id: string
  title: string
  url: string
  kind: string
  alt_text: string | null
  created_at: string
}

export default function MediaManager() {
  const [assets, setAssets] = useState<SiteAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('site_assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar media: ' + error.message)
    } else {
      setAssets(data || [])
    }
    setLoading(false)
  }

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage.from('cms-media').upload(path, file)
    if (uploadError) {
      toast.error('Erro no upload: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('cms-media').getPublicUrl(path)
    const { error: insertError } = await supabase.from('site_assets').insert({
      title: title || file.name,
      alt_text: altText || null,
      kind: file.type.startsWith('image/') ? 'image' : 'file',
      url: data.publicUrl,
    })

    if (insertError) {
      toast.error('Upload feito, mas falhou o registo: ' + insertError.message)
    } else {
      toast.success('Media carregado com sucesso')
      setTitle('')
      setAltText('')
      setFile(null)
      fetchAssets()
    }
    setUploading(false)
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    toast.success('URL copiada')
  }

  if (loading) {
    return <Loader text="A carregar media..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Media</h1>
        <p className="text-gray-600 mt-2">Carregar e gerir imagens/documentos do website</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Novo Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome do ficheiro" />
            </div>
            <div>
              <Label htmlFor="alt">Texto Alternativo</Label>
              <Input id="alt" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Descrição da imagem" />
            </div>
            <div>
              <Label htmlFor="file">Ficheiro</Label>
              <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
            </div>
            <Button type="submit" disabled={uploading || !file}>
              {uploading && <Spinner className="mr-2" />}
              {uploading ? 'A carregar...' : 'Carregar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.length === 0 ? (
          <Card className="md:col-span-3 lg:col-span-4">
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhum ficheiro carregado ainda.
            </CardContent>
          </Card>
        ) : (
          assets.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="pt-6">
                <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center mb-4">
                  {asset.kind === 'image' ? (
                    <img src={asset.url} alt={asset.alt_text || asset.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{asset.title}</h3>
                <p className="text-xs text-gray-500 truncate mt-1">{asset.url}</p>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => copyUrl(asset.url)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar URL
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
