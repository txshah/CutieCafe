'use client'

import { BatteryCharging, MapPin, Wifi } from 'lucide-react'
import Link from 'next/link'
import type { Cafe } from '@/types'
import { formatNeighborhood } from '@/lib/cafes'
import { VibeBar } from '@/components/VibeBar'

interface CafeCardProps {
  cafe: Cafe
  onSelect?: (cafe: Cafe) => void
}

export function CafeCard({ cafe, onSelect }: CafeCardProps) {
  return (
    <article className="rounded-lg border border-line bg-white/86 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <button className="min-w-0 text-left" onClick={() => onSelect?.(cafe)}>
          <h2 className="truncate text-lg font-bold text-ink">{cafe.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink/65">
            <MapPin className="h-3.5 w-3.5" />
            {formatNeighborhood(cafe.neighborhood)}
          </p>
        </button>
        <div className="rounded-md bg-matcha px-2 py-1 text-sm font-bold text-white">
          {cafe.scores.overall.toFixed(1)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <VibeBar label="WiFi" value={cafe.scores.wifi} tone="sky" />
        <VibeBar label="Outlets" value={cafe.scores.outlets} tone="coral" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {cafe.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink/70">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
        <span className="flex items-center gap-2 text-ink/65">
          <Wifi className="h-4 w-4 text-sky" />
          {cafe.scores.noise}
        </span>
        <Link className="flex items-center gap-2 font-bold text-coral" href={`/cafe/${cafe.id}`}>
          <BatteryCharging className="h-4 w-4" />
          Details
        </Link>
      </div>
    </article>
  )
}

