export type Neighborhood = 'soma' | 'mission' | 'castro' | 'hayes-valley' | 'tenderloin'
export type NoiseLevel = 'quiet' | 'moderate' | 'lively'

export interface RedditMention {
  subreddit: string
  postTitle: string
  snippet: string
  score: number
  url: string
}

export interface InstagramMention {
  hashtag: string
  caption: string
  likes: number
}

export interface Cafe {
  id: string
  name: string
  neighborhood: Neighborhood
  address: string
  lat: number
  lng: number
  scores: {
    wifi: number
    outlets: number
    noise: NoiseLevel
    aesthetic: number
    overall: number
  }
  tags: string[]
  hours: string
  sources: {
    reddit: RedditMention[]
    instagram?: InstagramMention[]
  }
  lastUpdated: string
}

export interface Stamp {
  cafeId: string
  cafeName: string
  checkedInAt: string
  pointsEarned: number
}

export interface User {
  id: string
  name: string
  handle: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  points: number
  stamps: Stamp[]
  joinedAt: string
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  stampsCost: number
  icon: string
  category: 'drink' | 'charger' | 'merch' | 'experience'
}

export interface FilterState {
  neighborhood: 'all' | Neighborhood
  minWifi: number
  noise: 'all' | NoiseLevel
}
