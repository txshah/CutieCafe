'use client'

import { CircleUserRound, Sparkles } from 'lucide-react'
import type { User } from '@/types'

export function UserPill({ user }: { user: User }) {
  return (
    <div className="fixed bottom-4 left-4 z-[900] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-paper shadow-soft">
      <CircleUserRound className="h-5 w-5 shrink-0 text-sky" />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{user.handle}</p>
        <p className="truncate text-xs text-paper/70">
          {user.points} points · {user.tier}
        </p>
      </div>
      <Sparkles className="h-4 w-4 shrink-0 text-coral" />
    </div>
  )
}

