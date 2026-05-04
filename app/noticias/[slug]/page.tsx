'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft } from 'lucide-react'
import { Loader } from '@/components/Loader'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published_at: string
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', resolvedParams.slug)
          .eq('is_published', true)
          .single()

        if (!error && data) {
          setPost(data)
        }
      } catch (error) {
        console.error('Erro ao carregar notícia:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [resolvedParams.slug])

  if (loading) {
    return <Loader text="A carregar notícia..." />
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
          <Link href="/noticias" className="text-blue-600 hover:text-blue-700">
            Voltar às notícias
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/noticias"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4"
          >
            <ChevronLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <time className="text-blue-100">
            {new Date(post.published_at).toLocaleDateString('pt-PT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <article className="max-w-4xl mx-auto px-4 prose prose-lg max-w-none">
          {post.excerpt && (
            <p className="text-xl text-gray-700 font-semibold mb-6 italic">{post.excerpt}</p>
          )}
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </article>
      </section>

      {/* Back Link */}
      <section className="py-6 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/noticias"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ChevronLeft size={20} />
            Voltar às notícias
          </Link>
        </div>
      </section>
    </div>
  )
}
