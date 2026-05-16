export type CardTier = 'silver' | 'gold' | 'platinum'

export const TIERS: Record<CardTier, { label: string; minSpend: number; discountPct: number; color: string; next?: CardTier }> = {
  silver: {
    label:       'Silver',
    minSpend:    0,
    discountPct: 5,
    color:       'card-silver',
    next:        'gold',
  },
  gold: {
    label:       'Gold',
    minSpend:    10000,
    discountPct: 10,
    color:       'card-gold',
    next:        'platinum',
  },
  platinum: {
    label:       'Platinum',
    minSpend:    50000,
    discountPct: 15,
    color:       'card-platinum',
  },
}

/** Return tier based on lifetime spend */
export function getTier(totalSpend: number): CardTier {
  if (totalSpend >= 50000) return 'platinum'
  if (totalSpend >= 10000) return 'gold'
  return 'silver'
}

/** Calculate card discount amount */
export function calcCardDiscount(subtotal: number, tier: CardTier): number {
  const pct = TIERS[tier].discountPct
  return Math.round(subtotal * pct / 100)
}

/** Generate unique card number */
export function generateCardNumber(): string {
  const prefix = 'FT'
  const rand = Math.random().toString().slice(2, 14)
  return `${prefix}-${rand.slice(0,4)}-${rand.slice(4,8)}-${rand.slice(8,12)}`
}

/** How much more spend needed to hit next tier */
export function spendToNextTier(totalSpend: number): { tier: CardTier | null; remaining: number } {
  const current = getTier(totalSpend)
  const next = TIERS[current].next
  if (!next) return { tier: null, remaining: 0 }
  return { tier: next, remaining: TIERS[next].minSpend - totalSpend }
}
