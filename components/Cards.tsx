'use client'

import Link from 'next/link'
import { getIcon } from '@/lib/icons'

interface PrincipalCardProps {
  iconName: string
  title: string
  description: string
}

export function PrincipalCard({ iconName, title, description }: PrincipalCardProps) {
  const Icon = getIcon(iconName)
  return (
    <div className="group h-full rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cms-primary)] hover:shadow-xl">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--cms-primary)]/10 text-[var(--cms-primary)] transition-colors group-hover:bg-[var(--cms-primary)] group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-base font-bold text-slate-950">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  )
}

interface QuickAccessProps {
  iconName: string
  label: string
  href?: string
}

export function QuickAccessButton({ iconName, label, href = '#' }: QuickAccessProps) {
  const Icon = getIcon(iconName)
  const Component = href?.startsWith('http') || href?.startsWith('tel:') || href?.startsWith('mailto:') ? 'a' : Link

  const props = href?.startsWith('http') || href?.startsWith('tel:') || href?.startsWith('mailto:') 
    ? { href } 
    : { href: href || '#' }

  return (
    <Component
      {...props}
      className="group flex min-h-36 flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cms-primary)] hover:bg-slate-50 hover:shadow-lg"
    >
      <div className="rounded-md bg-[var(--cms-primary)]/10 p-3 text-[var(--cms-primary)] transition-colors group-hover:bg-[var(--cms-primary)] group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-sm font-semibold text-slate-900 transition group-hover:text-[var(--cms-primary)]">{label}</span>
    </Component>
  )
}

interface MissionBoxProps {
  iconName: string
  title: string
  description: string
}

export function MissionBox({ iconName, title, description }: MissionBoxProps) {
  const Icon = getIcon(iconName)
  return (
    <div className="flex gap-8 rounded-lg bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] p-10 text-white shadow-xl">
      <div className="flex-shrink-0 rounded-md bg-white/10 p-4 backdrop-blur-sm">
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-white/80 text-base leading-relaxed font-light">{description}</p>
      </div>
    </div>
  )
}

interface CompetencyItemProps {
  iconName: string
  title: string
  description: string
}

export function CompetencyItem({ iconName, title, description }: CompetencyItemProps) {
  const Icon = getIcon(iconName)
  return (
    <div className="flex gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[var(--cms-primary)] hover:shadow-md">
      <div className="flex-shrink-0 rounded-md bg-[var(--cms-primary)]/10 p-3 text-[var(--cms-primary)]">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="mb-1 font-bold text-slate-950">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  )
}
