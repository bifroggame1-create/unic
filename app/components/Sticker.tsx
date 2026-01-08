'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// ═══════════════════════════════════════════════════════════════
// UNIC Sticker Catalog
// MIX разных типов, БЕЗ ДУБЛЕЙ
// ═══════════════════════════════════════════════════════════════

export const STICKERS = {
  // PACKAGES - 5 УНИКАЛЬНЫХ стикеров (разные папки + разные индексы)
  giftFree: '/stickers/ducks/2.json',        // Free - утка
  giftTrial: '/stickers/locket/8.json',      // Trial - сердечко
  giftBasic: '/stickers/gifts/3.json',       // Basic - подарок
  giftAdvanced: '/stickers/ui/12.json',      // Advanced - ui элемент
  giftPremium: '/stickers/gifts/45.json',    // Premium - премиум подарок

  // TAB BAR - разные
  tabHome: '/stickers/ducks/0.json',
  tabEvents: '/stickers/gifts/10.json',
  tabChannels: '/stickers/ducks/15.json',
  tabPlans: '/stickers/gifts/15.json',
  tabProfile: '/stickers/ducks/25.json',

  // FEATURE CARDS - все разные
  cardNewEvent: '/stickers/gifts/20.json',
  cardMyEvents: '/stickers/ducks/30.json',
  cardChannels: '/stickers/ducks/35.json',
  cardPlans: '/stickers/locket/10.json',
  cardProfile: '/stickers/locket/15.json',

  // ONBOARDING - Utya
  onboard1: '/stickers/mascot/0.json',
  onboard2: '/stickers/mascot/20.json',
  onboard3: '/stickers/mascot/40.json',
  onboard4: '/stickers/mascot/60.json',

  // SUPPORT & EMPTY - Utya
  support: '/stickers/mascot/80.json',
  noEvents: '/stickers/mascot/100.json',
  noChannels: '/stickers/mascot/110.json',

  // UI
  loading: '/stickers/ducks/40.json',
  success: '/stickers/ducks/45.json',
  error: '/stickers/ducks/50.json',
  warning: '/stickers/ui/10.json',

  // DECORATIONS
  banner: '/stickers/locket/20.json',
  info: '/stickers/ui/15.json',
  profileDecor: '/stickers/locket/25.json',
  welcome: '/stickers/gifts/30.json',

  // LEADERBOARD
  trophy: '/stickers/gifts/35.json',
  medal: '/stickers/gifts/40.json',
  crown: '/stickers/locket/30.json',

  // HINTS
  channelHint: '/stickers/ducks/55.json',
} as const

export type StickerName = keyof typeof STICKERS

interface StickerProps {
  name: StickerName
  size?: number | string
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export default function Sticker({
  name,
  size = 120,
  className = '',
  loop = true,
  autoplay = true,
}: StickerProps) {
  const [animationData, setAnimationData] = useState<any>(null)
  const [error, setError] = useState(false)
  const src = STICKERS[name]

  useEffect(() => {
    setError(false)
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(setAnimationData)
      .catch(() => setError(true))
  }, [src])

  const sizeStyle = { width: size, height: size }

  if (!animationData && !error) {
    return (
      <div
        style={sizeStyle}
        className={`animate-pulse bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 rounded-2xl ${className}`}
      />
    )
  }

  if (error) {
    return (
      <div
        style={sizeStyle}
        className={`flex items-center justify-center text-2xl ${className}`}
      >
        🎁
      </div>
    )
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={sizeStyle}
      className={className}
    />
  )
}
