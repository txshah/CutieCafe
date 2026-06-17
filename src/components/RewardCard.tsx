import { Badge, BatteryCharging, Coffee, Route } from 'lucide-react'
import type { Reward, User } from '@/types'

const icons = {
  coffee: Coffee,
  'battery-charging': BatteryCharging,
  badge: Badge,
  route: Route,
}

export function RewardCard({ reward, user }: { reward: Reward; user: User }) {
  const Icon = icons[reward.icon as keyof typeof icons] ?? Coffee
  const unlocked = user.points >= reward.pointsCost || user.stamps.length >= reward.stampsCost

  return (
    <article className={`rounded-lg border p-4 ${unlocked ? 'border-matcha bg-white' : 'border-line bg-white/65'}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-md p-2 ${unlocked ? 'bg-matcha text-white' : 'bg-paper text-ink/45'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black">{reward.name}</h3>
          <p className="mt-1 text-sm text-ink/65">{reward.description}</p>
          <p className="mt-3 text-xs font-bold uppercase text-ink/50">
            {reward.pointsCost} points or {reward.stampsCost} stamps
          </p>
        </div>
      </div>
    </article>
  )
}

