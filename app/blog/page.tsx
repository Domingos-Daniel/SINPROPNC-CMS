import { getPosts } from '@/lib/data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = {
  title: 'Blog',
  description: 'Read our latest posts and updates',
}

export default async function BlogPage() {
  const posts = await getPosts(true)

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
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Blog Header */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Blog
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Latest posts and updates from our organization
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    {post.published_at && (
                      <p className="text-sm text-gray-600">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {post.excerpt && (
                    <p className="text-gray-700 mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  <Button asChild variant="outline">
                    <Link href={`/blog/${post.slug}`}>
                      Read More →
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          )}
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
