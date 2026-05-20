'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ArrowRight } from 'lucide-react'
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center py-20">
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Notícia não encontrada</h1>
          <Link href="/noticias" className="text-blue-600 hover:text-blue-700 font-semibold">
            Voltar às notícias
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header - Corporate Style */}
      <section className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -left-20 bottom-0 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Voltar às notícias</span>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
            <time className="text-blue-100 text-lg">
              {new Date(post.published_at).toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-24 bg-green-500 rounded-full" />
            <div className="h-1 w-16 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <article className="max-w-3xl mx-auto">
            {post.excerpt && (
              <p className="text-xl text-neutral-700 font-semibold mb-10 italic leading-relaxed border-l-4 border-blue-600 pl-6">
                {post.excerpt}
              </p>
            )}
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
              <div className="whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50 py-20 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Gostou desta notícia?</h2>
          <p className="text-neutral-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Fique por dentro de todas as novidades do SINPROPNC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-3 bg-white border-2 border-neutral-200 hover:border-blue-600 hover:text-blue-600 text-neutral-700 font-semibold px-8 py-4 rounded-lg transition-all"
            >
              <ChevronLeft size={20} />
              Mais notícias
            </Link>
            <Link
              href="/juntar"
              className="inline-flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg"
            >
              Tornar-se Associado
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
