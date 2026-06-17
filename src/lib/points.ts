import type { Reward, User } from '@/types'

export const CHECK_IN_POINTS = 20

export const rewards: Reward[] = [
  {
    id: 'espresso-upgrade',
    name: 'Free Espresso Add-On',
    description: 'A small upgrade for a focused sprint.',
    pointsCost: 80,
    stampsCost: 4,
    icon: 'coffee',
    category: 'drink',
  },
  {
    id: 'charger-loaner',
    name: 'Charger Loaner',
    description: 'Borrow a USB-C charger during a work block.',
    pointsCost: 120,
    stampsCost: 5,
    icon: 'battery-charging',
    category: 'charger',
  },
  {
    id: 'lockin-sticker',
    name: 'lockin.cafe Sticker',
    description: 'A tiny badge for your laptop lid.',
    pointsCost: 160,
    stampsCost: 7,
    icon: 'badge',
    category: 'merch',
  },
  {
    id: 'coffee-flight',
    name: 'Tasting Flight',
    description: 'A weekend route through three passport stops.',
    pointsCost: 260,
    stampsCost: 10,
    icon: 'route',
    category: 'experience',
  },
]

export function getTier(points: number): User['tier'] {
  if (points >= 500) return 'Platinum'
  if (points >= 260) return 'Gold'
  if (points >= 120) return 'Silver'
  return 'Bronze'
}

export function availableRewards(user: User): Reward[] {
  return rewards.filter(
    (reward) => user.points >= reward.pointsCost || user.stamps.length >= reward.stampsCost,
  )
}

