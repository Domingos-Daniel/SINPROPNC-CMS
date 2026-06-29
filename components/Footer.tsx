'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Plane, Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react'

interface MenuItemType {
  id: string
  label: string
  href: string
  is_active: boolean
  display_order: number
}

interface ContactInfoType {
  id: string
  label: string
  value: string
  icon: string
  is_active: boolean
  display_order: number
}

interface FooterProps {
  menuItems?: MenuItemType[]
  contactInfo?: ContactInfoType[]
  settings?: Record<string, any>
}

function setting(settings: Record<string, any> | undefined, key: string, fallback = '') {
  const value = settings?.[key]
  if (value && typeof value === 'object' && 'value' in value) {
    return String(value.value ?? fallback)
  }
  return value ? String(value) : fallback
}

export function Footer({ menuItems = [], contactInfo = [], settings = {} }: FooterProps) {
  const pathname = usePathname()
  
  // Don't show footer on admin/auth routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null
  }
  
  const currentYear = new Date().getFullYear()
  const siteName = setting(settings, 'site_name', 'SINPROPNC')
  const footerText = setting(settings, 'site_footer', 'Sindicato Provincial do Pessoal Navegante de Cabine da Aviação Civil de Angola')
  const facebook = setting(settings, 'social_facebook')
  const twitter = setting(settings, 'social_twitter')
  const linkedin = setting(settings, 'social_linkedin')
  const phone = contactInfo.find((item) => item.label === 'Telefone')?.value || '+244 923 436 908'
  const email = contactInfo.find((item) => item.label === 'Email')?.value || 'sinpropnc@gmail.com'
  const location = contactInfo.find((item) => item.label === 'Localização')?.value || 'Luanda, Angola'
  const menu = menuItems.length > 0 ? menuItems.slice(0, 6) : [
    { id: '1', label: 'Início', href: '/', is_active: true, display_order: 0 },
    { id: '2', label: 'Sobre Nós', href: '/sobre-nos', is_active: true, display_order: 1 },
    { id: '3', label: 'O Que Fazemos', href: '/o-que-fazemos', is_active: true, display_order: 2 },
    { id: '4', label: 'Notícias', href: '/noticias', is_active: true, display_order: 3 },
    { id: '5', label: 'Contacto', href: '/contacto', is_active: true, display_order: 4 },
  ]

  return (
    <footer className="bg-slate-950 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-[var(--cms-primary)] rounded-lg flex items-center justify-center text-white font-bold">
                <Plane className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg">{siteName}</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {footerText}
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide uppercase">Menu</h4>
            <ul className="space-y-3 text-sm">
              {menu.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-neutral-400 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide uppercase">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--cms-secondary)]" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-neutral-400 hover:text-white transition">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--cms-secondary)]" />
                <a href={`mailto:${email}`} className="text-neutral-400 hover:text-white transition">{email}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--cms-secondary)]" />
                <span className="text-neutral-400">{location}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide uppercase">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href={facebook || '#'} className="p-3 rounded-lg bg-slate-800 hover:bg-[var(--cms-primary)] transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={twitter || '#'} className="p-3 rounded-lg bg-slate-800 hover:bg-[var(--cms-primary)] transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={linkedin || '#'} className="p-3 rounded-lg bg-slate-800 hover:bg-[var(--cms-primary)] transition" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © {currentYear} {siteName}. Todos os direitos reservados.
            </p>
            <a 
              href="https://safeq-ao.ao" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-500 text-sm hover:text-white transition flex items-center gap-2"
            >
              Powered by <span className="font-semibold">SafeQ</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
