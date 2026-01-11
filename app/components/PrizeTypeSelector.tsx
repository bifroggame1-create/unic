'use client'

interface PrizeTypeSelectorProps {
  selectedType?: 'telegram_gift' | 'ton' | 'custom'
  onChange: (type: 'telegram_gift' | 'ton' | 'custom') => void
}

const PRIZE_TYPES = [
  {
    value: 'telegram_gift' as const,
    label: 'Telegram Gift',
    icon: '🎁',
    description: 'Animated Telegram gift with stars',
    color: 'from-blue-500 to-blue-600'
  },
  {
    value: 'ton' as const,
    label: 'TON Transfer',
    icon: '💎',
    description: 'Direct TON cryptocurrency transfer',
    color: 'from-sky-500 to-blue-600'
  },
  {
    value: 'custom' as const,
    label: 'Custom Reward',
    icon: '🎯',
    description: 'Custom prize (manual fulfillment)',
    color: 'from-purple-500 to-purple-600'
  }
]

export default function PrizeTypeSelector({ selectedType, onChange }: PrizeTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Prize Type
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRIZE_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`
              card p-4 flex flex-col items-center gap-2 transition-all
              ${selectedType === type.value
                ? 'ring-2 ring-[var(--primary)] shadow-lg'
                : 'hover:shadow-md'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              w-16 h-16 rounded-full bg-gradient-to-br ${type.color}
              flex items-center justify-center text-3xl
              transition-transform
              ${selectedType === type.value ? 'scale-110' : 'scale-100'}
            `}>
              {type.icon}
            </div>

            {/* Label */}
            <h3 className="font-bold text-sm text-center">{type.label}</h3>

            {/* Description */}
            <p className="text-xs text-[var(--text-secondary)] text-center">
              {type.description}
            </p>

            {/* Selected Indicator */}
            {selectedType === type.value && (
              <div className="w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
