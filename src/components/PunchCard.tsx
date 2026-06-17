import { Gift } from 'lucide-react'

export function PunchCard({ count }: { count: number }) {
  const progress = count % 5

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-coral" />
        <h2 className="text-lg font-black">Punch Card 🐰</h2>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex aspect-square items-center justify-center rounded-md border text-xs ${index < progress ? 'border-matcha bg-matcha text-white' : 'border-line bg-paper text-ink/30'}`}
          >
            {index < progress ? '🐾' : '○'}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink/65">{5 - progress === 5 ? 5 : 5 - progress} stamps to next reward 🎉</p>
    </div>
  )
}
