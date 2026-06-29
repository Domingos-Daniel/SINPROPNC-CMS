import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { CSSProperties } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { headers } from 'next/headers'
import { HeaderClient, DEFAULT_MENU_ITEMS, DEFAULT_CONTACT_INFO } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SINPROPNC - Sindicato Provincial do Pessoal Navegante de Cabine',
  description: 'Sindicato Provincial do Pessoal Navegante de Cabine da Aviação Civil de Angola',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const dynamic = 'force-dynamic'

async function getHeaderData() {
  try {
    const supabase = await createClient()
    
    const [menuRes, contactRes, settingsRes] = await Promise.all([
      supabase.from('menu_items').select('*').eq('is_active', true).order('display_order', { ascending: true }),
      supabase.from('contact_info').select('*').eq('is_active', true).order('display_order', { ascending: true }),
      supabase.from('settings').select('*'),
    ])

    const settings: Record<string, any> = {}
    settingsRes.data?.forEach((item) => {
      settings[item.setting_key] = item.setting_value?.value ?? item.setting_value
    })

    return {
      menuItems: menuRes.data || [],
      contactInfo: contactRes.data || [],
      settings,
    }
  } catch (error) {
    console.error('Error fetching header data:', error)
    return {
      menuItems: [],
      contactInfo: [],
      settings: {},
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''
  
  // Don't render header on admin and auth routes
  const isSpecialRoute = pathname.startsWith('/admin') || pathname.startsWith('/auth')
  
  const { menuItems, contactInfo, settings } = await getHeaderData()
  const primaryColor = String(settings.primary_color || '#0052B4')
  const secondaryColor = String(settings.secondary_color || '#22C55E')
  const themeStyle = {
    '--primary': primaryColor,
    '--ring': primaryColor,
    '--accent': secondaryColor,
    '--sidebar-primary': primaryColor,
    '--cms-primary': primaryColor,
    '--cms-secondary': secondaryColor,
  } as CSSProperties

  return (
    <html lang="pt-PT" style={themeStyle}>
      <body className="font-sans antialiased bg-white">
        {!isSpecialRoute && (
          <HeaderClient menuItems={menuItems} contactInfo={contactInfo} />
        )}
        <main className="min-h-screen">
          {children}
        </main>
        {!isSpecialRoute && <Footer menuItems={menuItems} contactInfo={contactInfo} settings={settings} />}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
