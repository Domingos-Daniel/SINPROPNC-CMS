'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface PostData {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  is_published: boolean
  published_at: string | null
}

export default function PostEditor() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    is_published: false,
  })

  useEffect(() => {
    fetchPostData()
  }, [postId])

  const fetchPostData = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      setLoading(false)
      return
    }

    setPost(data)
    setFormData({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      is_published: data.is_published,
    })
    setLoading(false)
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('posts')
      .update({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        is_published: formData.is_published,
        published_at: formData.is_published && !post?.is_published ? new Date().toISOString() : post?.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)

    if (error) {
      console.error('Error updating post:', error)
      alert('Error saving post')
      setSaving(false)
      return
    }

    alert('Post updated successfully!')
    setSaving(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Post</h1>
      </div>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePost} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Post content"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <div>
                  <Label className="cursor-pointer">Publish this post</Label>
                  <p className="text-xs text-gray-600">
                    {formData.is_published ? 'Visible to readers' : 'Draft - not visible'}
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={saving}>
                {saving ? 'Saving...' : 'Save Post'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formData.title}</h2>
              {formData.excerpt && (
                <p className="text-gray-600 mt-2">{formData.excerpt}</p>
              )}
            </div>
            <div className="prose prose-sm max-w-none bg-white p-4 rounded border">
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {formData.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
