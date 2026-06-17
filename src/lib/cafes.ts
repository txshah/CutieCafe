import cafes from '../../data/cafes.json'
import type { Cafe, FilterState } from '@/types'

export function getCafes(): Cafe[] {
  return cafes as Cafe[]
}

export function getCafeById(id: string): Cafe | undefined {
  return getCafes().find((cafe) => cafe.id === id)
}

export function filterCafes(items: Cafe[], filters: FilterState): Cafe[] {
  return items.filter((cafe) => {
    const neighborhoodMatch =
      filters.neighborhood === 'all' || cafe.neighborhood === filters.neighborhood
    const wifiMatch = cafe.scores.wifi >= filters.minWifi
    const noiseMatch = filters.noise === 'all' || cafe.scores.noise === filters.noise

    return neighborhoodMatch && wifiMatch && noiseMatch
  })
}

export function formatNeighborhood(neighborhood: Cafe['neighborhood']): string {
  return neighborhood
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

