'use client'

import Sticker, { StickerName } from './Sticker'

interface SupportBannerProps {
  sticker?: StickerName
  title: string
  subtitle: string
  href?: string
}

export default function SupportBanner({ sticker = 'support', title, subtitle, href }: SupportBannerProps) {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#3b82f6] rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-[#2563eb] transition-colors"
    >
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
        <Sticker name={sticker} size={32} />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
    </button>
  )
}
