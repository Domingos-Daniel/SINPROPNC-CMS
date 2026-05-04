'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Plane, Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  
  // Don't show footer on admin/auth routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null
  }
  
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                <Plane className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg">SINPROPNC</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Sindicato Provincial do Pessoal Navegante de Cabine da Aviação Civil de Angola
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide uppercase">Menu</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-neutral-400 hover:text-white transition">Início</Link></li>
              <li><Link href="/sobre-nos" className="text-neutral-400 hover:text-white transition">Sobre Nós</Link></li>
              <li><Link href="/o-que-fazemos" className="text-neutral-400 hover:text-white transition">O Que Fazemos</Link></li>
              <li><Link href="/noticias" className="text-neutral-400 hover:text-white transition">Notícias</Link></li>
              <li><Link href="/contacto" className="text-neutral-400 hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide uppercase">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+244923436908" className="text-neutral-400 hover:text-white transition">+244 923 436 908</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:sinpropnc@gmail.com" className="text-neutral-400 hover:text-white transition">sinpropnc@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-400">Luanda, Angola</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-sm tracking-wide uppercase">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 rounded-lg bg-neutral-800 hover:bg-blue-700 transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-lg bg-neutral-800 hover:bg-blue-700 transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-lg bg-neutral-800 hover:bg-blue-700 transition" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © {currentYear} SINPROPNC. Todos os direitos reservados.
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
