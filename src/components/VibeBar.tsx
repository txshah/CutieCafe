interface VibeBarProps {
  label: string
  value: number
  tone?: 'matcha' | 'coral' | 'sky' | 'plum'
}

const toneClass = {
  matcha: 'bg-matcha',
  coral: 'bg-coral',
  sky: 'bg-sky',
  plum: 'bg-plum',
}

export function VibeBar({ label, value, tone = 'matcha' }: VibeBarProps) {
  const percent = Math.min(100, Math.max(0, (value / 5) * 100))

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-semibold text-ink/70">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-line">
        <div className={`h-2 rounded-full ${toneClass[tone]}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

