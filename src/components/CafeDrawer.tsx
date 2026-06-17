'use client'

import { BatteryCharging, Clock, MapPinned, X } from 'lucide-react'
import type { Cafe } from '@/types'
import { VibeBar } from '@/components/VibeBar'

interface CafeDrawerProps {
  cafe: Cafe | null
  onClose: () => void
}

export function CafeDrawer({ cafe, onClose }: CafeDrawerProps) {
  if (!cafe) return null

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[1000] rounded-lg border border-line bg-paper p-4 shadow-soft md:left-auto md:w-[380px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">{cafe.name}</h2>
          <p className="mt-1 text-sm text-ink/65">{cafe.address}</p>
        </div>
        <button className="rounded-md border border-line p-2" onClick={onClose} aria-label="Close cafe details">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <VibeBar label="WiFi" value={cafe.scores.wifi} tone="sky" />
        <VibeBar label="Outlets" value={cafe.scores.outlets} tone="coral" />
        <VibeBar label="Aesthetic" value={cafe.scores.aesthetic} tone="plum" />
        <div className="rounded-md bg-white p-3 text-sm font-bold text-ink/70">
          Noise
          <div className="mt-1 text-lg text-ink">{cafe.scores.noise}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-ink/70">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-matcha" />
          {cafe.hours}
        </p>
        <p className="flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-coral" />
          {cafe.sources.reddit.length} Reddit mentions cached
        </p>
        <p className="flex items-center gap-2">
          <BatteryCharging className="h-4 w-4 text-sky" />
          Check in for 20 points
        </p>
      </div>
    </aside>
  )
}

