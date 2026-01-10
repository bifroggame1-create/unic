'use client'

interface PlanCardProps {
  icon: string
  name: string
  price: string
  features: string[]
  isPopular?: boolean
  onSelect?: () => void
}

export default function PlanCard({
  icon,
  name,
  price,
  features,
  isPopular = false,
  onSelect
}: PlanCardProps) {
  return (
    <div
      className={`
        rounded-2xl p-6 border-2
        ${isPopular
          ? 'border-[var(--primary)] bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent'
          : 'border-[var(--card-border)] bg-[var(--card-bg)]'
        }
        relative
      `}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white text-xs font-bold">
          POPULAR
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{name}</h3>
          <p className="text-2xl font-bold text-[var(--primary)]">{price}</p>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Select button */}
      {onSelect && (
        <button
          onClick={onSelect}
          className={`
            w-full py-3 rounded-xl font-semibold
            active-scale touch-target
            transition-all duration-200
            ${isPopular
              ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white'
              : 'border-2 border-[var(--primary)] text-[var(--primary)]'
            }
          `}
        >
          Select Plan
        </button>
      )}
    </div>
  )
}
