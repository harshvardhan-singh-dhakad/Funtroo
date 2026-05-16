'use client'
import { TIERS, spendToNextTier } from '@/lib/loyalty'
import type { CardTier } from '@/lib/loyalty'
import { Zap, Star, Crown } from 'lucide-react'

interface Props {
  card: { tier: CardTier; number: string; totalSpend: number; discountPct: number; joinedAt: string }
  name: string
  compact?: boolean
}

const ICONS: Record<CardTier, React.ReactNode> = {
  silver:   <Star  size={20} className="text-white/80" />,
  gold:     <Star  size={20} className="text-yellow-200" fill="currentColor" />,
  platinum: <Crown size={20} className="text-f-accent" />,
}

export default function FuntrooCard({ card, name, compact = false }: Props) {
  const tier    = card.tier as CardTier
  const meta    = TIERS[tier]
  const next    = spendToNextTier(card.totalSpend)
  const prog    = next.tier ? Math.min(100, ((card.totalSpend - meta.minSpend) / (TIERS[next.tier].minSpend - meta.minSpend)) * 100) : 100

  return (
    <div className={`${compact ? 'p-4 rounded-xl' : 'p-6 rounded-2xl'} ${meta.color} card-shine relative overflow-hidden text-white shadow-xl`}>
      {/* BG pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] tracking-[3px] uppercase opacity-70 mb-0.5">Funtroo</p>
            <p className={`font-display ${compact ? 'text-xl' : 'text-2xl'} tracking-widest`}>{meta.label} Card</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            {ICONS[tier]}
            <span className="text-xs tracking-wider">{meta.label}</span>
          </div>
        </div>

        {!compact && (
          <p className="text-lg tracking-[4px] mb-4 font-mono opacity-80">{card.number || 'FT-XXXX-XXXX-XXXX'}</p>
        )}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Card Holder</p>
            <p className={`${compact ? 'text-sm' : 'text-base'} font-medium`}>{name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Discount</p>
            <div className="flex items-center gap-1">
              <Zap size={14} className="fill-white" />
              <p className={`${compact ? 'text-lg' : 'text-2xl'} font-bold`}>{meta.discountPct}%</p>
            </div>
          </div>
        </div>

        {/* Progress to next tier */}
        {!compact && next.tier && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex justify-between text-[10px] opacity-70 mb-1.5">
              <span>Progress to {TIERS[next.tier].label}</span>
              <span>₹{next.remaining.toLocaleString()} more</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/70 rounded-full transition-all" style={{ width: `${prog}%` }} />
            </div>
          </div>
        )}

        {!compact && !next.tier && (
          <div className="mt-4 pt-4 border-t border-white/20 text-center">
            <p className="text-xs opacity-70">🏆 Maximum tier achieved! Enjoy 15% on every order.</p>
          </div>
        )}
      </div>
    </div>
  )
}
