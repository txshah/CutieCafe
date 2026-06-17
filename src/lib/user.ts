'use client'

import { CHECK_IN_POINTS, getTier } from '@/lib/points'
import type { Cafe, Stamp, User } from '@/types'

const STORAGE_KEY = 'lockin-cafe-user'

export function createDefaultUser(): User {
  return {
    id: 'local-user',
    name: 'Cafe Regular',
    handle: '@lockin.cafe',
    tier: 'Bronze',
    points: 0,
    stamps: [],
    joinedAt: new Date().toISOString(),
  }
}

export function loadUser(): User {
  if (typeof window === 'undefined') return createDefaultUser()

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const user = createDefaultUser()
    saveUser(user)
    return user
  }

  try {
    return JSON.parse(raw) as User
  } catch {
    const user = createDefaultUser()
    saveUser(user)
    return user
  }
}

export function saveUser(user: User) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function checkIn(user: User, cafe: Cafe): User {
  const stamp: Stamp = {
    cafeId: cafe.id,
    cafeName: cafe.name,
    checkedInAt: new Date().toISOString(),
    pointsEarned: CHECK_IN_POINTS,
  }
  const nextPoints = user.points + CHECK_IN_POINTS

  return {
    ...user,
    points: nextPoints,
    tier: getTier(nextPoints),
    stamps: [stamp, ...user.stamps],
  }
}
