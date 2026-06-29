'use client'

import { getAllIcons, getIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const icons = getAllIcons()
  const SelectedIcon = getIcon(value)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--cms-primary)] text-white">
          <SelectedIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Ícone selecionado</p>
          <p className="text-xs text-slate-500">{value}</p>
        </div>
      </div>
      <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 sm:grid-cols-6 md:grid-cols-8">
        {icons.map((iconName) => {
          const Icon = getIcon(iconName)
          const selected = iconName === value
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              title={iconName}
              className={cn(
                'flex h-12 w-full items-center justify-center rounded-md border transition',
                selected
                  ? 'border-[var(--cms-primary)] bg-[var(--cms-primary)] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-[var(--cms-primary)] hover:bg-slate-50 hover:text-[var(--cms-primary)]',
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
