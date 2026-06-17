import type { User } from '@/types'
import { StampSlot } from '@/components/StampSlot'

export function PassportBook({ user }: { user: User }) {
  const slots = Array.from({ length: Math.max(12, user.stamps.length + 3) })

  return (
    <section className="rounded-lg border border-line bg-paper p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Passport 🐼</h2>
          <p className="mt-1 text-sm font-semibold text-ink/60">{user.stamps.length} stamps collected ✨</p>
        </div>
        <div className="rounded-md bg-ink px-3 py-2 text-right text-paper">
          <p className="text-xs font-bold uppercase text-paper/60">Tier</p>
          <p className="font-black">{user.tier} 🏅</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {slots.map((_, index) => (
          <StampSlot key={index} filled={Boolean(user.stamps[index])} label={user.stamps[index]?.cafeName} />
        ))}
      </div>
    </section>
  )
}
