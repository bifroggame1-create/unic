'use client'

interface PrizeSourceSelectorProps {
  source?: 'pool' | 'on_demand'
  onChange: (source: 'pool' | 'on_demand') => void
  poolQuantity?: number
}

export default function PrizeSourceSelector({ source, onChange, poolQuantity = 0 }: PrizeSourceSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Gift Source
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* UNIC Gift Pool */}
        <button
          onClick={() => onChange('pool')}
          className={`
            card p-4 flex flex-col gap-3 transition-all text-left
            ${source === 'pool'
              ? 'ring-2 ring-[var(--primary)] shadow-lg'
              : 'hover:shadow-md'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-2xl flex-shrink-0">
              🎁
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">
                UNIC Gift Pool <span className="text-green-500">(Recommended)</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                Reserve from centralized gift pool
              </p>

              {/* Pool Stats */}
              {poolQuantity > 0 ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-500 font-semibold">✓ Available</span>
                  <span className="text-[var(--text-secondary)]">
                    {poolQuantity} in pool
                  </span>
                </div>
              ) : (
                <div className="text-xs text-orange-500 font-semibold">
                  ⚠️ Not available - will fallback to on-demand
                </div>
              )}
            </div>
          </div>

          {/* Selected Indicator */}
          {source === 'pool' && (
            <div className="w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full" />
          )}
        </button>

        {/* On-Demand Purchase */}
        <button
          onClick={() => onChange('on_demand')}
          className={`
            card p-4 flex flex-col gap-3 transition-all text-left
            ${source === 'on_demand'
              ? 'ring-2 ring-[var(--primary)] shadow-lg'
              : 'hover:shadow-md'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl flex-shrink-0">
              ⚡
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">
                On-Demand Purchase
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                Purchased when event ends
              </p>

              <div className="text-xs text-[var(--text-secondary)]">
                No pre-reservation needed
              </div>
            </div>
          </div>

          {/* Selected Indicator */}
          {source === 'on_demand' && (
            <div className="w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full" />
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-xs text-[var(--text-secondary)]">
          {source === 'pool' ? (
            <>
              <strong>Pool Mode:</strong> Gift will be reserved immediately from UNIC pool.
              If pool runs out, will automatically fallback to on-demand purchase.
            </>
          ) : (
            <>
              <strong>On-Demand Mode:</strong> UNIC will purchase the gift when event ends.
              10% service fee applies.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
