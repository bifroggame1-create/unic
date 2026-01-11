'use client'

import { useState } from 'react'
import PrizeTypeSelector from './PrizeTypeSelector'
import PrizeSourceSelector from './PrizeSourceSelector'
import GiftCatalog, { type GiftOption } from './GiftCatalog'

export interface Prize {
  position: number
  type: 'telegram_gift' | 'ton' | 'custom'
  // Telegram Gift fields
  giftId?: string
  name?: string
  source?: 'pool' | 'on_demand'
  poolReserved?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  limited?: boolean
  remainingCount?: number
  // TON fields
  tonAmount?: number
  // Custom fields
  customReward?: {
    name: string
    description: string
  }
  value?: number
}

interface PrizeDistributionBuilderProps {
  winnersCount: number
  prizes: Prize[]
  onChange: (prizes: Prize[]) => void
  availableGifts: GiftOption[]
}

const getPositionLabel = (position: number): string => {
  const labels: Record<number, string> = {
    1: '1st Place Winner',
    2: '2nd Place Winner',
    3: '3rd Place Winner'
  }
  return labels[position] || `${position}th Place Winner`
}

const getPositionMedal = (position: number): string => {
  const medals: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  }
  return medals[position] || '🏅'
}

export default function PrizeDistributionBuilder({
  winnersCount,
  prizes,
  onChange,
  availableGifts
}: PrizeDistributionBuilderProps) {
  const [expandedPrize, setExpandedPrize] = useState<number>(1)

  const updatePrize = (position: number, updates: Partial<Prize>) => {
    const newPrizes = [...prizes]
    const index = prizes.findIndex(p => p.position === position)

    if (index >= 0) {
      newPrizes[index] = { ...newPrizes[index], ...updates }
    } else {
      newPrizes.push({
        position,
        type: updates.type || 'telegram_gift',
        ...updates
      })
    }

    // Sort by position
    newPrizes.sort((a, b) => a.position - b.position)
    onChange(newPrizes)
  }

  const getPrizeForPosition = (position: number): Prize | undefined => {
    return prizes.find(p => p.position === position)
  }

  const isComplete = (prize?: Prize): boolean => {
    if (!prize) return false

    if (prize.type === 'telegram_gift') {
      return !!prize.giftId && !!prize.source
    }

    if (prize.type === 'ton') {
      return !!prize.tonAmount && prize.tonAmount > 0
    }

    if (prize.type === 'custom') {
      return !!prize.customReward?.name
    }

    return false
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: winnersCount }, (_, i) => {
        const position = i + 1
        const prize = getPrizeForPosition(position)
        const isExpanded = expandedPrize === position
        const complete = isComplete(prize)

        return (
          <div key={position} className="card p-0 overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setExpandedPrize(isExpanded ? 0 : position)}
              className="w-full p-4 flex items-center gap-4 hover:bg-[var(--bg-end)] transition-colors"
            >
              {/* Position Badge */}
              <div className={`position-badge position-${position} text-2xl`}>
                {getPositionMedal(position)}
              </div>

              {/* Title */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg">{getPositionLabel(position)}</h3>
                {prize && (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {prize.type === 'telegram_gift' && prize.name}
                    {prize.type === 'ton' && `${prize.tonAmount} TON`}
                    {prize.type === 'custom' && prize.customReward?.name}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {complete ? (
                  <span className="text-green-500 text-sm font-semibold">✓ Configured</span>
                ) : (
                  <span className="text-orange-500 text-sm font-semibold">⚠️ Required</span>
                )}
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Content */}
            {isExpanded && (
              <div className="p-4 border-t border-[var(--border-color)] space-y-6 fade-in">
                {/* Prize Type Selector */}
                <PrizeTypeSelector
                  selectedType={prize?.type}
                  onChange={(type) => updatePrize(position, { type })}
                />

                {/* Conditional Prize Configuration */}
                {prize?.type === 'telegram_gift' && (
                  <div className="space-y-6">
                    {/* Source Selector */}
                    <PrizeSourceSelector
                      source={prize.source}
                      onChange={(source) => updatePrize(position, { source })}
                      poolQuantity={
                        prize.giftId
                          ? availableGifts.find(g => g.id === prize.giftId)?.poolQuantity || 0
                          : 0
                      }
                    />

                    {/* Gift Catalog */}
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                        Select Gift
                      </label>
                      <GiftCatalog
                        gifts={availableGifts}
                        selectedGiftId={prize.giftId}
                        onSelect={(giftId) => {
                          const gift = availableGifts.find(g => g.id === giftId)
                          updatePrize(position, {
                            giftId,
                            name: gift?.name,
                            value: gift?.stars,
                            rarity: gift?.rarity,
                            limited: gift?.limited,
                            remainingCount: gift?.remainingCount
                          })
                        }}
                        showPoolInfo={prize.source === 'pool'}
                      />
                    </div>
                  </div>
                )}

                {prize?.type === 'ton' && (
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      TON Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter TON amount (e.g., 5.0)"
                      className="input w-full"
                      value={prize.tonAmount || ''}
                      onChange={(e) => updatePrize(position, {
                        tonAmount: Number(e.target.value),
                        value: Number(e.target.value)
                      })}
                    />
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      Winners must connect their TON wallet to receive this prize
                    </p>
                  </div>
                )}

                {prize?.type === 'custom' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Reward Name
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., VIP Discord Role"
                        className="input w-full"
                        value={prize.customReward?.name || ''}
                        onChange={(e) => updatePrize(position, {
                          customReward: {
                            ...prize.customReward,
                            name: e.target.value
                          } as any
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Description / Instructions
                      </label>
                      <textarea
                        placeholder="Describe what the winner will receive and how..."
                        className="input w-full min-h-[100px]"
                        value={prize.customReward?.description || ''}
                        onChange={(e) => updatePrize(position, {
                          customReward: {
                            ...prize.customReward,
                            description: e.target.value
                          } as any
                        })}
                      />
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-xs text-[var(--text-secondary)]">
                        <strong>Note:</strong> Custom rewards require manual fulfillment.
                        Make sure to follow up with winners after the event.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Summary */}
      <div className="card p-4 bg-blue-500/5 border-blue-500/20">
        <h4 className="font-bold mb-2">Prize Configuration Summary</h4>
        <div className="space-y-1 text-sm text-[var(--text-secondary)]">
          <p>Total prizes: {winnersCount}</p>
          <p>Configured: {prizes.filter(p => isComplete(p)).length}</p>
          <p>Remaining: {winnersCount - prizes.filter(p => isComplete(p)).length}</p>
        </div>
      </div>
    </div>
  )
}
