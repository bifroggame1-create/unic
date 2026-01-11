'use client'

import { useState } from 'react'
import Sticker from './Sticker'

export interface GiftOption {
  id: string
  name: string
  stars: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  limited: boolean
  remainingCount?: number
  convertStars: number
  requirePremium: boolean
  poolQuantity: number
  available: boolean
  sticker?: any
}

interface GiftCatalogProps {
  gifts: GiftOption[]
  selectedGiftId?: string
  onSelect: (giftId: string) => void
  showPoolInfo?: boolean
}

export default function GiftCatalog({
  gifts,
  selectedGiftId,
  onSelect,
  showPoolInfo = false
}: GiftCatalogProps) {
  const [filter, setFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all')

  const filteredGifts = filter === 'all'
    ? gifts
    : gifts.filter(g => g.rarity === filter)

  return (
    <div className="space-y-4">
      {/* Rarity Filter */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
            filter === 'all'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--bg-start)] text-[var(--text-secondary)]'
          }`}
        >
          All
        </button>
        {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => (
          <button
            key={rarity}
            onClick={() => setFilter(rarity)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
              filter === rarity
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--bg-start)] text-[var(--text-secondary)]'
            }`}
          >
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </button>
        ))}
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGifts.map(gift => (
          <button
            key={gift.id}
            onClick={() => onSelect(gift.id)}
            className={`
              card relative p-4 flex flex-col items-center gap-3 transition-all
              ${selectedGiftId === gift.id
                ? 'ring-2 ring-[var(--primary)] shadow-lg'
                : 'hover:shadow-md'
              }
              ${!gift.available ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!gift.available}
          >
            {/* Rarity Badge */}
            <div className={`absolute top-2 right-2 badge badge-${gift.rarity} text-xs px-2 py-1 rounded-full`}>
              {gift.rarity}
            </div>

            {/* Limited Badge */}
            {gift.limited && gift.remainingCount !== undefined && (
              <div className="absolute top-2 left-2 badge badge-limited text-xs px-2 py-1 rounded-full animate-pulse">
                Limited · {gift.remainingCount.toLocaleString()} left
              </div>
            )}

            {/* Gift Preview */}
            <div className="flex justify-center mb-2">
              <Sticker name={gift.id} size={80} />
            </div>

            {/* Gift Info */}
            <div className="text-center w-full">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{gift.name}</h3>
              <p className="text-[var(--primary)] font-bold text-lg">{gift.stars} ⭐</p>

              {/* Pool Availability */}
              {showPoolInfo && gift.poolQuantity > 0 && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  🎁 Pool: {gift.poolQuantity} available
                </p>
              )}

              {/* Premium Required */}
              {gift.requirePremium && (
                <p className="text-xs text-orange-500 mt-1">
                  Premium Required
                </p>
              )}

              {/* Not Available */}
              {!gift.available && (
                <p className="text-xs text-red-500 mt-1">
                  Sold Out
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredGifts.length === 0 && (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <p className="text-lg">No gifts found</p>
          <p className="text-sm">Try selecting a different rarity</p>
        </div>
      )}
    </div>
  )
}
