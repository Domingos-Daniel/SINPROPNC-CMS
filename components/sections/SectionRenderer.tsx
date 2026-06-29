import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { getSectionLayout, normalizeLayoutId, type SectionContent, type SectionItem } from '@/lib/section-layouts'

type SectionRendererProps = {
  type: string
  content?: SectionContent | null
  items?: SectionItem[]
  preview?: boolean
}

function HeadingBlock({ content, centered = false }: { content: SectionContent; centered?: boolean }) {
  return (
    <div className={cn('mb-10 max-w-3xl', centered && 'mx-auto text-center')}>
      {content.eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--cms-primary)]">
          {content.eyebrow}
        </p>
      )}
      {content.title && (
        <h2 className="text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
          {content.title}
        </h2>
      )}
      {content.subtitle && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          {content.subtitle}
        </p>
      )}
    </div>
  )
}

function ActionLink({ href, children, secondary = false }: { href?: string; children?: string; secondary?: boolean }) {
  if (!href || !children) return null

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition',
        secondary
          ? 'border border-slate-300 bg-white text-slate-800 hover:border-[var(--cms-primary)] hover:text-[var(--cms-primary)]'
          : 'bg-[var(--cms-primary)] text-white hover:brightness-95',
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

function getItems(content: SectionContent, providedItems?: SectionItem[]) {
  const items = providedItems && providedItems.length > 0 ? providedItems : content.items || []
  return items.filter((item) => item.title || item.value || item.description)
}

export function SectionRenderer({ type, content, items, preview = false }: SectionRendererProps) {
  const layout = getSectionLayout(type)
  const layoutId = normalizeLayoutId(type)
  const safeContent: SectionContent = { ...layout.defaultContent, ...(content || {}) }
  const sectionItems = getItems(safeContent, items)
  const shellClass = preview ? 'rounded-lg border border-slate-200 bg-white p-5' : ''

  if (layoutId === 'split_feature') {
    return (
      <section className={shellClass}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {safeContent.image_url ? (
              <img
                src={safeContent.image_url}
                alt={safeContent.image_alt || safeContent.title || ''}
                className="aspect-video h-full w-full object-cover lg:aspect-[4/3]"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] text-white lg:aspect-[4/3]">
                <span className="text-sm font-semibold uppercase tracking-wide">Imagem</span>
              </div>
            )}
          </div>
          <div>
            <HeadingBlock content={safeContent} />
            {safeContent.content && (
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
                {safeContent.content}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink href={safeContent.button_link}>{safeContent.button_text}</ActionLink>
              <ActionLink href={safeContent.secondary_button_link} secondary>{safeContent.secondary_button_text}</ActionLink>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (layoutId === 'card_grid' || layoutId === 'principles') {
    return (
      <section className={shellClass}>
        <HeadingBlock content={safeContent} centered={safeContent.alignment === 'center'} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sectionItems.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={`${item.title}-${index}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--cms-primary)] hover:shadow-lg">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--cms-primary)]/10 text-[var(--cms-primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  if (layoutId === 'stats_band') {
    return (
      <section className={cn(shellClass, !preview && 'rounded-lg bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] p-8 text-white md:p-10')}>
        <div className={preview ? 'rounded-lg bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] p-6 text-white' : ''}>
          {safeContent.eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">{safeContent.eyebrow}</p>}
          {safeContent.title && <h2 className="text-3xl font-bold">{safeContent.title}</h2>}
          {safeContent.subtitle && <p className="mt-3 max-w-2xl text-white/70">{safeContent.subtitle}</p>}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {sectionItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-lg border border-white/15 bg-white/10 p-5">
                <p className="text-3xl font-bold">{item.value || item.title}</p>
                <h3 className="mt-2 font-semibold">{item.value ? item.title : item.description}</h3>
                {item.value && item.description && <p className="mt-1 text-sm text-white/70">{item.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (layoutId === 'process_steps') {
    return (
      <section className={shellClass}>
        <HeadingBlock content={safeContent} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {sectionItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--cms-primary)] text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              {item.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (layoutId === 'cta_banner') {
    const dark = safeContent.variant !== 'light'
    return (
      <section className={shellClass}>
        <div className={cn('rounded-lg p-8 text-center md:p-10', dark ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-slate-50 text-slate-950')}>
          {safeContent.eyebrow && <p className={cn('mb-3 text-sm font-semibold uppercase tracking-wide', dark ? 'text-[var(--cms-secondary)]' : 'text-[var(--cms-primary)]')}>{safeContent.eyebrow}</p>}
          {safeContent.title && <h2 className="text-3xl font-bold md:text-4xl">{safeContent.title}</h2>}
          {safeContent.subtitle && <p className={cn('mx-auto mt-4 max-w-2xl text-lg', dark ? 'text-white/70' : 'text-slate-600')}>{safeContent.subtitle}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ActionLink href={safeContent.button_link}>{safeContent.button_text}</ActionLink>
            <ActionLink href={safeContent.secondary_button_link} secondary>{safeContent.secondary_button_text}</ActionLink>
          </div>
        </div>
      </section>
    )
  }

  if (layoutId === 'faq_list') {
    return (
      <section className={shellClass}>
        <HeadingBlock content={safeContent} />
        <div className="space-y-3">
          {sectionItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-950">{item.title}</h3>
              {item.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (layoutId === 'competencies_main' || layoutId === 'competencies_secondary') {
    return (
      <section className={shellClass}>
        <HeadingBlock content={safeContent} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sectionItems.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={`${item.title}-${index}`} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-[var(--cms-primary)] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  {item.description && <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section className={shellClass}>
      <div className={cn('rounded-lg border border-slate-200 bg-white p-8 shadow-sm', safeContent.alignment === 'center' && 'text-center')}>
        <HeadingBlock content={safeContent} centered={safeContent.alignment === 'center'} />
        {safeContent.content && (
          <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700">
            {safeContent.content}
          </div>
        )}
      </div>
    </section>
  )
}
