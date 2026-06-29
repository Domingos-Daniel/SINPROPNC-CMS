'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { Loader } from '@/components/Loader'
import { slugify } from '@/lib/utils'
import { toast } from 'sonner'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  is_published: boolean
  published_at: string
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    is_published: true,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      setLoading(false)
      return
    }

    setPosts(data || [])
    setLoading(false)
  }

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title })
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const slug = slugify(formData.title)

    const { error } = await supabase.from('posts').insert([
      {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
      },
    ])

    if (error) {
      console.error('Error creating post:', error)
      toast.error('Erro ao criar publicação: ' + error.message)
      setSaving(false)
      return
    }

    toast.success('Publicação criada com sucesso!')
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      is_published: true,
    })
    setSlugManuallyEdited(false)
    setShowForm(false)
    setSaving(false)
    fetchPosts()
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta publicação?')) return

    const supabase = createClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao eliminar: ' + error.message)
      return
    }

    toast.success('Publicação eliminada!')
    fetchPosts()
  }

  if (loading) {
    return <Loader text="A carregar publicações..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Publicações</h1>
          <p className="text-gray-600 mt-2">Gerir notícias e publicações</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setSlugManuallyEdited(false) }}>
          {showForm ? 'Cancelar' : 'Nova Publicação'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Criar Nova Publicação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título da Publicação"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slugify(formData.title)}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Gerado automaticamente a partir do título</p>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerto</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve descrição da publicação"
                />
              </div>
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo da publicação"
                  rows={8}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label>Publicar imediatamente</Label>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Spinner className="mr-2" />}
                {saving ? 'A criar...' : 'Criar Publicação'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center text-gray-600">
              Nenhuma publicação criada ainda. Crie a sua primeira publicação.
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.excerpt}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {post.is_published ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/posts/${post.id}`}>Editar</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Eliminar
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
