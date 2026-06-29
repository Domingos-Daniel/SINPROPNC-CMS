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
  featured_image: string | null
  category: string | null
  tags: string[] | null
  seo_title: string | null
  meta_description: string | null
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
          <Link href="/noticias" className="text-[var(--cms-primary)] hover:text-[var(--cms-primary)] font-semibold">
            Voltar às notícias
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header - Corporate Style */}
      <section className="relative bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-white/75 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Voltar às notícias</span>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
            {post.category && (
              <p className="text-green-200 font-semibold mb-3">{post.category}</p>
            )}
            <time className="text-white/75 text-lg">
              {new Date(post.published_at).toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-24 bg-[var(--cms-secondary)] rounded-full" />
            <div className="h-1 w-16 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <article className="max-w-3xl mx-auto">
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full aspect-video object-cover rounded-xl border border-neutral-200 mb-10"
              />
            )}
            {post.excerpt && (
              <p className="text-xl text-neutral-700 font-semibold mb-10 italic leading-relaxed border-l-4 border-[var(--cms-primary)] pl-6">
                {post.excerpt}
              </p>
            )}
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
              <div className="whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-50 px-3 py-1 text-sm font-medium text-[var(--cms-primary)]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
              className="inline-flex items-center gap-3 bg-white border-2 border-neutral-200 hover:border-[var(--cms-primary)] hover:text-[var(--cms-primary)] text-neutral-700 font-semibold px-8 py-4 rounded-lg transition-all"
            >
              <ChevronLeft size={20} />
              Mais notícias
            </Link>
            <Link
              href="/juntar"
              className="inline-flex items-center gap-3 bg-[var(--cms-primary)] hover:brightness-95 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg"
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
