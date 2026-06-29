import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  category: string | null
  published_at: string
}

const DEFAULT_NEWS_IMG = '/android-chrome-512x512.png'

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, category, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export default async function NoticiasPage() {
  const posts = await getPosts()

  return (
    <div className="bg-white">
      {/* Header - Corporate Style */}
      <section className="relative bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Notícias</h1>
            <p className="text-xl text-white/75 leading-relaxed font-light">
              Fique atualizado com as últimas novidades do SINPROPNC e do sector da aviação civil.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-24 bg-[var(--cms-secondary)] rounded-full" />
            <div className="h-1 w-16 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/noticias/${post.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video bg-slate-50 overflow-hidden">
                    <img
                      src={post.featured_image || DEFAULT_NEWS_IMG}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                      {post.category && (
                        <span className="font-semibold text-[var(--cms-primary)]">{post.category}</span>
                      )}
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-[var(--cms-primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-neutral-600 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[var(--cms-primary)] font-semibold group-hover:gap-3 transition-all">
                      <span>Ler mais</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📰</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Nenhuma notícia publicada</h2>
              <p className="text-neutral-600">Em breve teremos novas notícias para si.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50 py-20 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Quer receber as nossas notícias?</h2>
          <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
            Subscreva a nossa newsletter e receba as últimas notícias diretamente no seu email.
          </p>
          <Link
            href="/juntar"
            className="inline-flex items-center gap-3 bg-[var(--cms-primary)] hover:brightness-95 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg"
          >
            Tornar-se Associado
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
