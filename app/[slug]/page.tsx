import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import type { SectionContent, SectionItem } from '@/lib/section-layouts'

export const dynamic = 'force-dynamic'

interface Section {
  id: string
  page_id: string
  section_type: string
  display_order: number
  content: SectionContent | null
}

interface PageData {
  id: string
  title: string
  description: string
  slug: string
  sections: Section[]
}

interface Principle {
  title: string
  description: string
  icon_name: string
}

interface Competency {
  title: string
  description: string
  icon_name: string
  category: string
}

async function getPage(slug: string): Promise<PageData | null> {
  const supabase = await createClient()

  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (pageError || !pageData) return null

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

async function getSyncedContent() {
  const supabase = await createClient()
  const [principlesRes, competenciesRes] = await Promise.all([
    supabase.from('principles').select('title, description, icon_name').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('competencies').select('title, description, icon_name, category').eq('is_active', true).order('display_order', { ascending: true }),
  ])

  return {
    principles: (principlesRes.data || []) as Principle[],
    competencies: (competenciesRes.data || []) as Competency[],
  }
}

function getSectionItems(section: Section, principles: Principle[], competencies: Competency[]): SectionItem[] | undefined {
  if (section.content?.items && section.content.items.length > 0) {
    return section.content.items
  }

  if (section.section_type === 'principles') {
    return principles.map((item) => ({
      title: item.title,
      description: item.description,
      icon: item.icon_name,
    }))
  }

  if (section.section_type === 'competencies_main') {
    return competencies
      .filter((item) => item.category === 'main')
      .map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon_name,
      }))
  }

  if (section.section_type === 'competencies_secondary') {
    return competencies
      .filter((item) => item.category === 'secondary')
      .map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon_name,
      }))
  }

  return undefined
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [page, synced] = await Promise.all([getPage(slug), getSyncedContent()])

  if (!page) notFound()

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] py-20 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/70">SINPROPNC</p>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">{page.title}</h1>
            {page.description && (
              <p className="mt-6 text-xl font-light leading-relaxed text-white/75">{page.description}</p>
            )}
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-24 rounded-full bg-[var(--cms-secondary)]" />
            <div className="h-1 w-16 rounded-full bg-white/30" />
          </div>
        </div>
      </section>

      <main className="py-16">
        <div className="mx-auto max-w-6xl space-y-16 px-6">
          {page.sections.length > 0 ? (
            page.sections.map((section) => (
              <SectionRenderer
                key={section.id}
                type={section.section_type}
                content={section.content}
                items={getSectionItems(section, synced.principles, synced.competencies)}
              />
            ))
          ) : (
            <SectionRenderer
              type="editorial_text"
              content={{
                title: page.title,
                content: page.description || 'Conteúdo em preparação.',
              }}
            />
          )}
        </div>
      </main>

      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--cms-secondary)]">Contacto</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Precisa de mais informações?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/65">
            Entre em contacto connosco para saber mais sobre os nossos serviços e como podemos ajudá-lo.
          </p>
          <Link
            href="/contacto"
            className="mt-8 inline-flex items-center rounded-lg bg-[var(--cms-secondary)] px-8 py-4 font-semibold text-white transition hover:brightness-95"
          >
            Contacte-nos
          </Link>
        </div>
      </section>
    </div>
  )
}
