import { Coffee } from 'lucide-react'

export function StampSlot({ label, filled }: { label?: string; filled: boolean }) {
  return (
    <div className={`aspect-square rounded-lg border p-2 ${filled ? 'border-coral bg-coral text-white' : 'border-dashed border-line bg-white/70 text-ink/25'}`}>
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <Coffee className="h-6 w-6" />
        <span className="line-clamp-2 text-xs font-bold">{label ?? 'Open slot'}</span>
      </div>
    </div>
  )
}

