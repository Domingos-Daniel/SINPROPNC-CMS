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
    <div className="bg-white rounded-xl p-8 border border-neutral-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-7 h-7 text-blue-700" />
      </div>
      <h3 className="font-semibold text-neutral-900 mb-3 text-base">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
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
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 p-6 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
    >
      <div className="p-3 rounded-lg bg-neutral-100 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-6 h-6 text-neutral-700 group-hover:text-blue-700 transition-colors" />
      </div>
      <span className="font-medium text-neutral-900 group-hover:text-blue-700 transition text-sm">{label}</span>
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
    <div className="bg-gradient-to-br from-blue-700 to-blue-800 text-white rounded-xl p-10 flex gap-8 items-start">
      <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm flex-shrink-0">
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-blue-50 text-base leading-relaxed font-light">{description}</p>
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
    <div className="bg-white rounded-lg p-6 flex gap-4 border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <div className="p-3 rounded-lg bg-blue-50 flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
        <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
