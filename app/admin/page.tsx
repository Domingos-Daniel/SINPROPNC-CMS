'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/Loader'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    posts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [pagesRes, postsRes] = await Promise.all([
        supabase.from('pages').select('id', { count: 'exact' }),
        supabase.from('posts').select('id', { count: 'exact' }),
      ])

      setStats({
        pages: pagesRes.count || 0,
        posts: postsRes.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <Loader text="A carregar..." />
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel de gestão do SINPROPNC</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Páginas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{stats.pages}</p>
            <p className="text-sm text-gray-600 mt-2">Total de páginas criadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publicações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{stats.posts}</p>
            <p className="text-sm text-gray-600 mt-2">Total de publicações</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/pages" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-gray-900">Gerir Páginas</h3>
            <p className="text-sm text-gray-600">Criar e editar páginas</p>
          </a>
          <a href="/admin/posts" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-gray-900">Gerir Publicações</h3>
            <p className="text-sm text-gray-600">Escrever e publicar notícias</p>
          </a>
          <a href="/admin/settings" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-gray-900">Configurações</h3>
            <p className="text-sm text-gray-600">Personalizar o site</p>
          </a>
        </div>
      </div>
    </div>
  )
}
