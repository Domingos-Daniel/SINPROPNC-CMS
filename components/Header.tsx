'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail, MapPin, Plane } from 'lucide-react'

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

interface HeaderClientProps {
  menuItems: MenuItemType[]
  contactInfo: ContactInfoType[]
}

const DEFAULT_MENU_ITEMS: MenuItemType[] = [
  { id: '1', label: 'Início', href: '/', is_active: true, display_order: 0 },
  { id: '2', label: 'Sobre Nós', href: '/sobre-nos', is_active: true, display_order: 1 },
  { id: '3', label: 'O Que Fazemos', href: '/o-que-fazemos', is_active: true, display_order: 2 },
  { id: '4', label: 'A Profissão', href: '/a-profissao', is_active: true, display_order: 3 },
  { id: '5', label: 'Serviços', href: '/servicos', is_active: true, display_order: 4 },
  { id: '6', label: 'Parceiros', href: '/parceiros', is_active: true, display_order: 5 },
  { id: '7', label: 'Notícias', href: '/noticias', is_active: true, display_order: 6 },
  { id: '8', label: 'Contacto', href: '/contacto', is_active: true, display_order: 7 },
]

const DEFAULT_CONTACT_INFO: ContactInfoType[] = [
  { id: '1', label: 'Telefone', value: '+244 923 436 908', icon: 'phone', is_active: true, display_order: 0 },
  { id: '2', label: 'Email', value: 'sinpropnc@gmail.com', icon: 'mail', is_active: true, display_order: 1 },
  { id: '3', label: 'Localização', value: 'Luanda, Angola', icon: 'mapPin', is_active: true, display_order: 2 },
]

function HeaderClient({ menuItems, contactInfo }: HeaderClientProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menu = menuItems.length > 0 ? menuItems : DEFAULT_MENU_ITEMS
  const contacts = contactInfo.length > 0 ? contactInfo : DEFAULT_CONTACT_INFO

  const getContactValue = (label: string) => {
    const item = contacts.find(c => c.label === label)
    return item?.value
  }

  const phone = getContactValue('Telefone') || DEFAULT_CONTACT_INFO[0].value
  const email = getContactValue('Email') || DEFAULT_CONTACT_INFO[1].value
  const location = getContactValue('Localização') || DEFAULT_CONTACT_INFO[2].value

  return (
    <>
      {/* Top Contact Bar */}
      <div className={`bg-blue-700 text-white text-xs py-2 md:py-3.5 border-b border-blue-600 transition-all duration-300 ${isScrolled ? 'opacity-0 h-0' : 'opacity-100'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center overflow-hidden">
          <div className="flex gap-4 md:gap-8 items-center">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1 md:gap-2 hover:opacity-90 transition animate-fade-in">
              <Phone className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-xs">{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="hidden sm:flex items-center gap-2 hover:opacity-90 transition animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
            <span className="hidden sm:flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </span>
            <Link href="/area-associado" className="font-semibold hover:opacity-90 transition border-l border-blue-500 pl-4 md:pl-8 animate-fade-in text-[10px] md:text-xs" style={{ animationDelay: '0.3s' }}>
              ÁREA DO ASSOCIADO
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation - sticky */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 transition-all duration-300">
        <div className={`max-w-6xl mx-auto px-6 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group animate-slide-down">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg group-hover:from-blue-600 group-hover:to-blue-700 transition">
              <Plane className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="text-sm sm:text-base font-bold text-blue-700 leading-tight">SINPROPNC</h1>
                <img 
                  src="/BANDEIRA-ANGOLA.png" 
                  alt="Angola" 
                  className="h-3.5 sm:h-5 w-auto opacity-80" 
                />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-600 font-medium hidden sm:block">Pessoal Navegante de Cabine</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {menu.map((item, idx) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded relative group animate-slide-down ${
                  pathname === item.href 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-neutral-700 hover:text-blue-700 hover:bg-neutral-50'
                }`}
                style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
              >
                {item.label}
                {pathname !== item.href && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                )}
                {pathname === item.href && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-700 transform scale-x-100 transition-transform" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded transition animate-slide-down"
            style={{ animationDelay: '0.5s' }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-neutral-200 bg-white py-4 px-6 space-y-1 animate-slide-down">
            {menu.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition stagger-item ${
                  pathname === item.href 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/juntar"
              className="block w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-800 transition text-center text-sm mt-4 stagger-item"
            >
              JUNTE-SE A NÓS
            </Link>
          </nav>
        )}
      </header>
    </>
  )
}

export { HeaderClient }
export { DEFAULT_MENU_ITEMS, DEFAULT_CONTACT_INFO }