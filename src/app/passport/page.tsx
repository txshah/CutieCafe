'use client'

import { ArrowLeft, Coffee, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import cafes from '../../../data/cafes.json'
import { PassportBook } from '@/components/PassportBook'
import { PunchCard } from '@/components/PunchCard'
import { RewardCard } from '@/components/RewardCard'
import { CafeCard } from '@/components/CafeCard'
import { rewards } from '@/lib/points'
import { checkIn, loadUser, saveUser } from '@/lib/user'
import type { Cafe } from '@/types'

export default function PassportPage() {
  const [user, setUser] = useState(() => loadUser())
  const [lastCheckin, setLastCheckin] = useState<string | null>(null)

  function handleCheckIn(cafe: Cafe) {
    const next = checkIn(user, cafe)
    saveUser(next)
    setUser(next)
    setLastCheckin(cafe.name)
  }

  return (
    <main className="min-h-screen px-4 py-5">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link className="mb-3 flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold" href="/">
              <ArrowLeft className="h-4 w-4" />
              Map
            </Link>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-coral">
              <Coffee className="h-4 w-4" />
              {user.handle}
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">Passport + Rewards</h1>
          </div>
          <div className="rounded-lg border border-line bg-ink p-4 text-paper">
            <p className="text-sm font-bold text-paper/65">Balance</p>
            <p className="text-3xl font-black">{user.points} points</p>
          </div>
        </header>

        {lastCheckin ? (
          <div className="rounded-lg border border-matcha bg-white p-4 font-bold text-matcha">
            Checked in at {lastCheckin}. Stamp added.
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <PassportBook user={user} />
          <div className="space-y-5">
            <PunchCard count={user.stamps.length} />
            <section className="grid gap-3">
              <h2 className="text-xl font-black">Rewards</h2>
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} user={user} />
              ))}
            </section>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-coral" />
            <h2 className="text-xl font-black">Check In</h2>
          </div>
          <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden pr-1">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(cafes as Cafe[]).map((cafe) => (
              <div key={cafe.id} className="space-y-2">
                <CafeCard cafe={cafe} />
                <button className="h-11 w-full rounded-md bg-coral font-black text-white" onClick={() => handleCheckIn(cafe)}>
                  Stamp {cafe.name}
                </button>
              </div>
            ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
