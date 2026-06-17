'use client'

import dynamic from 'next/dynamic'
import { Coffee, NotebookTabs } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import cafes from '../../data/cafes.json'
import type { Cafe, FilterState } from '@/types'
import { CafeCard } from '@/components/CafeCard'
import { CafeDrawer } from '@/components/CafeDrawer'
import { FilterBar } from '@/components/FilterBar'
import { UserPill } from '@/components/UserPill'
import { filterCafes } from '@/lib/cafes'
import { loadUser } from '@/lib/user'

const CafeMap = dynamic(() => import('@/components/Map').then((module) => module.CafeMap), { ssr: false })

const initialFilters: FilterState = {
  neighborhood: 'all',
  minWifi: 1,
  noise: 'all',
}

export default function Home() {
  const [filters, setFilters] = useState(initialFilters)
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [user] = useState(() => loadUser())
  const filtered = useMemo(() => filterCafes(cafes as Cafe[], filters), [filters])

  return (
    <main className="min-h-screen pb-28">
      <header className="border-b border-line bg-paper/86 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-coral">
              <Coffee className="h-4 w-4" />
              lockin.cafe
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-normal text-ink md:text-4xl">SF Cafe Passport</h1>
          </div>
          <Link className="flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 font-bold text-paper" href="/passport">
            <NotebookTabs className="h-4 w-4" />
            Passport
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-4">
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="h-[58vh] min-h-[460px]">
            <CafeMap cafes={filtered} selectedCafe={selectedCafe} onSelect={setSelectedCafe} />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">{filtered.length} cafes</h2>
            <span className="text-sm font-semibold text-ink/55">Mission + SoMa track</span>
          </div>
          <div className="grid gap-3">
            {filtered.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} onSelect={setSelectedCafe} />
            ))}
          </div>
        </section>
      </div>

      <CafeDrawer cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />
      <UserPill user={user} />
    </main>
  )
}

