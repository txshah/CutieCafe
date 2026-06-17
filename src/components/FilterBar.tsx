'use client'

import { SlidersHorizontal } from 'lucide-react'
import type { FilterState, Neighborhood, NoiseLevel } from '@/types'

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const neighborhoods: Array<'all' | Neighborhood> = ['all', 'mission', 'soma', 'hayes-valley']
const noises: Array<'all' | NoiseLevel> = ['all', 'quiet', 'moderate', 'lively']

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-white/88 p-3 shadow-sm md:flex-row md:items-center">
      <div className="flex items-center gap-2 font-bold text-ink">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      <label className="flex flex-1 items-center gap-2 text-sm font-semibold text-ink/70">
        Area
        <select
          className="h-10 min-w-0 flex-1 rounded-md border border-line bg-paper px-3"
          value={filters.neighborhood}
          onChange={(event) => onChange({ ...filters, neighborhood: event.target.value as FilterState['neighborhood'] })}
        >
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood === 'all' ? 'All' : neighborhood.replace('-', ' ')}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-1 items-center gap-2 text-sm font-semibold text-ink/70">
        Noise
        <select
          className="h-10 min-w-0 flex-1 rounded-md border border-line bg-paper px-3"
          value={filters.noise}
          onChange={(event) => onChange({ ...filters, noise: event.target.value as FilterState['noise'] })}
        >
          {noises.map((noise) => (
            <option key={noise} value={noise}>
              {noise[0].toUpperCase() + noise.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-1 items-center gap-3 text-sm font-semibold text-ink/70">
        WiFi {filters.minWifi.toFixed(1)}+
        <input
          className="min-w-0 flex-1 accent-matcha"
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={filters.minWifi}
          onChange={(event) => onChange({ ...filters, minWifi: Number(event.target.value) })}
        />
      </label>
    </div>
  )
}

