import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getIcon } from '@/lib/icons'
import { Shield, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Section {
  id: string
  page_id: string
  section_type: string
  display_order: number
  content: {
    title?: string
    subtitle?: string
    content?: string
    items?: Array<{
      title: string
      description: string
      icon: string
    }>
    image_placeholder?: string
  }
}

interface PageData {
  id: string
  title: string
  description: string
  slug: string
  sections: Section[]
}

interface Principle {
  id: string
  title: string
  description: string
  icon_name: string
  is_active: boolean
}

interface Competency {
  id: string
  title: string
  description: string
  icon_name: string
  category: string
  is_active: boolean
}

async function getPage(slug: string): Promise<PageData | null> {
  const supabase = await createClient()
  
  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (pageError || !pageData) {
    return null
  }

  const { data: sectionsData } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', pageData.id)
    .order('display_order', { ascending: true })

  return {
    ...pageData,
    sections: sectionsData || [],
  }
}

async function getPrinciples(): Promise<Principle[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('principles')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

async function getCompetencies(): Promise<Competency[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('competencies')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [page, principles, competencies] = await Promise.all([
    getPage(slug),
    getPrinciples(),
    getCompetencies()
  ])

  if (!page) {
    notFound()
  }

  // Helper to get items for cards/competencies sections from database
  const getSectionItems = (section: Section) => {
    if (section.content?.items && section.content.items.length > 0) {
      return section.content.items
    }
    
    // If section type is 'principles' or 'competencies_main', fetch from DB
    if (section.section_type === 'principles') {
      return principles.map(p => ({
        title: p.title,
        description: p.description,
        icon: p.icon_name
      }))
    }
    
    if (section.section_type === 'competencies_main') {
      return competencies
        .filter(c => c.category === 'main')
        .map(c => ({
          title: c.title,
          description: c.description,
          icon: c.icon_name
        }))
    }
    
    if (section.section_type === 'competencies_secondary') {
      return competencies
        .filter(c => c.category === 'secondary')
        .map(c => ({
          title: c.title,
          description: c.description,
          icon: c.icon_name
        }))
    }
    
    return []
  }

  return (
    <div className="bg-white">
      {/* Page Header - Corporate Style */}
      <section className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -left-20 bottom-0 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{page.title}</h1>
            {page.description && (
              <p className="text-xl text-blue-100 leading-relaxed font-light">{page.description}</p>
            )}
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-24 bg-green-500 rounded-full" />
            <div className="h-1 w-16 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Page Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {page.sections.map((section) => {
            const items = getSectionItems(section)
            
            return (
              <div key={section.id} className="mb-16 last:mb-0">
                {section.section_type === 'text' && (
                  <div className="bg-white rounded-2xl p-10 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    {section.content.title && (
                      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 relative">
                        <span className="relative z-10">{section.content.title}</span>
                        <span className="absolute -bottom-2 left-0 w-16 h-1 bg-green-500 rounded-full" />
                      </h2>
                    )}
                    {section.content.subtitle && (
                      <p className="text-xl text-neutral-600 font-medium mb-6 italic">{section.content.subtitle}</p>
                    )}
                    {section.content.content && (
                      <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
                        <p>{section.content.content}</p>
                      </div>
                    )}
                  </div>
                )}

                {(section.section_type === 'cards' || section.section_type === 'principles') && items.length > 0 && (
                  <div className="py-8">
                    {section.content.title && (
                      <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{section.content.title}</h2>
                        <div className="h-1 w-24 bg-green-500 rounded-full" />
                      </div>
                    )}
                    <div className={`grid grid-cols-1 ${
                      items.length === 3 ? 'md:grid-cols-3' : 
                      items.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                      items.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
                    } gap-8`}>
                      {items.map((item, itemIdx) => {
                        const IconComponent = getIcon(item.icon)
                        return (
                          <div 
                            key={itemIdx} 
                            className="group bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                          >
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <IconComponent className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                            <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {(section.section_type === 'competencies' || section.section_type === 'competencies_main' || section.section_type === 'competencies_secondary') && items.length > 0 && (
                  <div className="py-8">
                    {section.content.title && (
                      <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{section.content.title}</h2>
                        <div className="h-1 w-24 bg-green-500 rounded-full" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {items.map((item, itemIdx) => {
                        const IconComponent = getIcon(item.icon) || CheckCircle
                        return (
                          <div 
                            key={itemIdx}
                            className="flex items-start gap-6 bg-neutral-50 rounded-xl p-6 border border-neutral-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h4>
                              <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {section.section_type === 'image_text' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl blur-lg opacity-20" />
                      <div className="relative bg-neutral-100 rounded-2xl aspect-video flex items-center justify-center">
                        <span className="text-6xl">{section.content.image_placeholder || '🖼️'}</span>
                      </div>
                    </div>
                    <div>
                      {section.content.title && (
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">{section.content.title}</h2>
                      )}
                      {section.content.content && (
                        <p className="text-neutral-600 leading-relaxed text-lg">{section.content.content}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Precisa de mais informações?</h2>
          <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">Entre em contacto connosco para saber mais sobre os nossos serviços e como podemos ajudá-lo.</p>
          <Link 
            href="/contacto"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:gap-4"
          >
            Contacte-nos
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}