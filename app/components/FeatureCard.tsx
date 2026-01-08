'use client'

import Sticker, { StickerName } from './Sticker'

interface FeatureCardProps {
  icon?: string
  sticker?: StickerName
  title: string
  subtitle?: string
  onClick?: () => void
  disabled?: boolean
}

export default function FeatureCard({ icon, sticker, title, subtitle, onClick, disabled }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        card p-4 w-full text-left transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-[0.98]'}
      `}
    >
      <div className="flex items-center gap-3">
        {sticker ? (
          <Sticker name={sticker} size={40} />
        ) : (
          <span className="text-3xl">{icon}</span>
        )}
        <div>
          <h4 className="font-medium text-[15px] text-gray-800">{title}</h4>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </button>
  )
}
