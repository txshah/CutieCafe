import type { NoiseLevel } from '@/types'

const signalWords = {
  wifi: ['wifi', 'wi-fi', 'internet', 'fast', 'zoom', 'call'],
  outlets: ['outlet', 'plug', 'charging', 'charger', 'power'],
  quiet: ['quiet', 'calm', 'peaceful', 'silent', 'focus'],
  lively: ['busy', 'loud', 'crowded', 'packed', 'line'],
  aesthetic: ['beautiful', 'cute', 'vibe', 'aesthetic', 'sunny', 'design'],
}

function scoreSignal(text: string, words: string[], fallback: number): number {
  const lower = text.toLowerCase()
  const hits = words.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0)
  return Math.min(5, Math.max(1, fallback + hits * 0.35))
}

export function extractSignals(text: string) {
  const wifi = scoreSignal(text, signalWords.wifi, 3)
  const outlets = scoreSignal(text, signalWords.outlets, 2.8)
  const aesthetic = scoreSignal(text, signalWords.aesthetic, 3.5)
  const quietHits = signalWords.quiet.filter((word) => text.toLowerCase().includes(word)).length
  const livelyHits = signalWords.lively.filter((word) => text.toLowerCase().includes(word)).length
  const noise: NoiseLevel = quietHits > livelyHits ? 'quiet' : livelyHits > quietHits ? 'lively' : 'moderate'
  const overall = Number(((wifi * 0.35 + outlets * 0.25 + aesthetic * 0.25 + (noise === 'quiet' ? 4.4 : noise === 'moderate' ? 3.8 : 3.2) * 0.15)).toFixed(1))

  return {
    wifi: Number(wifi.toFixed(1)),
    outlets: Number(outlets.toFixed(1)),
    noise,
    aesthetic: Number(aesthetic.toFixed(1)),
    overall,
  }
}
