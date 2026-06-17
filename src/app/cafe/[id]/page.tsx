import { ArrowLeft, Clock, MapPin, MessageSquareText } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { VibeBar } from '@/components/VibeBar'
import { formatNeighborhood, getCafeById } from '@/lib/cafes'

interface CafePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CafePage({ params }: CafePageProps) {
  const { id } = await params
  const cafe = getCafeById(id)
  if (!cafe) notFound()

  return (
    <main className="min-h-screen px-4 py-5">
      <article className="mx-auto max-w-4xl space-y-5">
        <Link className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold" href="/">
          <ArrowLeft className="h-4 w-4" />
          Map
        </Link>

        <header className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-coral">{formatNeighborhood(cafe.neighborhood)}</p>
          <h1 className="mt-2 text-4xl font-black">{cafe.name}</h1>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-ink/65 md:grid-cols-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-coral" />
              {cafe.address}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-matcha" />
              {cafe.hours}
            </p>
          </div>
        </header>

        <section className="grid gap-3 rounded-lg border border-line bg-paper p-5 md:grid-cols-3">
          <VibeBar label="WiFi" value={cafe.scores.wifi} tone="sky" />
          <VibeBar label="Outlets" value={cafe.scores.outlets} tone="coral" />
          <VibeBar label="Aesthetic" value={cafe.scores.aesthetic} tone="plum" />
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-sky" />
            <h2 className="text-xl font-black">Cached Reddit Mentions</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {cafe.sources.reddit.length > 0 ? (
              cafe.sources.reddit.map((mention) => (
                <a key={`${mention.url}-${mention.postTitle}`} className="rounded-lg border border-line bg-paper p-4" href={mention.url}>
                  <p className="text-sm font-black text-coral">r/{mention.subreddit}</p>
                  <h3 className="mt-1 font-bold">{mention.postTitle}</h3>
                  <p className="mt-2 text-sm text-ink/70">{mention.snippet}</p>
                </a>
              ))
            ) : (
              <p className="text-sm font-semibold text-ink/60">
                No cached Reddit mentions yet. Run the one-shot scraper, then process the CSV.
              </p>
            )}
          </div>
        </section>
      </article>
    </main>
  )
}
