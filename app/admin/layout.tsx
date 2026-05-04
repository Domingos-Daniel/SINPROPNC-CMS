'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader } from '@/components/Loader'
import { Analytics } from '@vercel/analytics/next'
import { 
  LayoutDashboard, 
  Home, 
  FileText, 
  Newspaper, 
  Users, 
  MapPin, 
  HelpCircle, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu
} from 'lucide-react'
import '@/app/globals.css'

const navGroups = [
  {
    title: 'Geral',
    items: [
      { name: 'Painel', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Página Inicial',
    items: [
      { name: 'Hero / Slides', href: '/admin/hero', icon: Home },
      { name: 'Serviços Rápidos', href: '/admin/services', icon: Shield },
      { name: 'Princípios', href: '/admin/principles', icon: FileText },
      { name: 'Competências', href: '/admin/competencies', icon: Shield },
    ]
  },
  {
    title: 'Conteúdo',
    items: [
      { name: 'Páginas', href: '/admin/pages', icon: FileText },
      { name: 'Publicações', href: '/admin/posts', icon: Newspaper },
    ]
  },
  {
    title: 'Site',
    items: [
      { name: 'Contactos', href: '/admin/contact', icon: Users },
      { name: 'Menu', href: '/admin/menu', icon: MapPin },
      { name: 'FAQs', href: '/admin/faq', icon: HelpCircle },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { name: 'Configurações', href: '/admin/settings', icon: Settings },
    ]
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return <Loader text="A carregar..." />
  }

  return (
    <html lang="pt-PT">
      <body className="font-sans antialiased bg-slate-50">
        <div className="min-h-screen bg-slate-50">
          {/* Mobile Header */}
          <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mr-4"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <span className="font-bold text-slate-800">SINPROPNC CMS</span>
          </header>

          {/* Mobile Overlay */}
          {mobileOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed top-0 left-0 h-full bg-slate-900 text-white z-50
            transition-all duration-300 ease-in-out flex flex-col
            ${sidebarOpen ? 'w-64' : 'w-20'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 flex-shrink-0">
              <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-sm">S</span>
                </div>
                {sidebarOpen && (
                  <span className="font-bold text-lg">SINPROPNC</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex text-slate-400 hover:text-white"
              >
                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
              {navGroups.map((group) => (
                <div key={group.title} className="mb-4">
                  {sidebarOpen && (
                    <div className="px-4 mb-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {group.title}
                      </p>
                    </div>
                  )}
                  <div className="space-y-1 px-3">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            flex items-center gap-3 rounded-lg transition-colors
                            ${isActive 
                              ? 'bg-blue-600 text-white' 
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }
                            ${!sidebarOpen && 'justify-center px-0'}
                            py-2.5 px-3
                          `}
                          title={!sidebarOpen ? item.name : undefined}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* User & Logout Section */}
            <div className="border-t border-slate-800 p-4 space-y-3 flex-shrink-0">
              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                className={`
                  w-full justify-center bg-red-600 hover:bg-red-700 text-white
                  ${sidebarOpen ? 'px-4' : 'px-0'}
                `}
              >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span className="ml-2">Terminar Sessão</span>}
              </Button>
              
              {/* User Info */}
              <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email?.split('@')[0] || 'Admin'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className={`
            min-h-screen transition-all duration-300
            ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          `}>
            {/* Top bar for mobile */}
            <div className="lg:hidden h-16" />

            {/* Page content */}
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}