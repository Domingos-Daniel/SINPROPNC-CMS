import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

interface PostParams {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PostParams) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            SIMPROPNC
          </Link>
          <nav className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/blog">Blog</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Post Header */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {post.title}
          </h1>
          {post.published_at && (
            <p className="text-lg text-gray-600 mt-4">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </section>

      {/* Post Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Button asChild variant="outline">
              <Link href="/blog">
                ← Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-gray-400">
            © 2024 SIMPROPNC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
