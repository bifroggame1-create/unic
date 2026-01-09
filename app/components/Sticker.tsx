'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// ═══════════════════════════════════════════════════════════════
// UNIC Sticker Catalog
// MIX разных типов, БЕЗ ДУБЛЕЙ
// ═══════════════════════════════════════════════════════════════

export const STICKERS = {
  // ═══════════════════════════════════════════════════════════════
  // NARRATIVE UI - Unique story scenes
  // ═══════════════════════════════════════════════════════════════

  // Home Screen Assets
  'mascot/10': '/stickers/mascot/10.json',   // Header working
  'mascot/20': '/stickers/mascot/20.json',   // New event
  'mascot/30': '/stickers/mascot/30.json',   // My events
  'mascot/40': '/stickers/mascot/40.json',   // Channels
  'gifts/5': '/stickers/gifts/5.json',        // Plans
  'mascot/50': '/stickers/mascot/50.json',   // Profile
  'mascot/60': '/stickers/mascot/60.json',   // Stats
  'mascot/70': '/stickers/mascot/70.json',   // No events
  'ducks/5': '/stickers/ducks/5.json',        // Tier newbie
  'ducks/45': '/stickers/ducks/45.json',      // Tier pro
  'ducks/85': '/stickers/ducks/85.json',      // Tier legend

  // PACKAGES - 5 РАЗНЫХ ТИПОВ ОБЪЕКТОВ (не кепки разных цветов!)
  giftFree: '/stickers/ducks/4.json',        // Простая утка
  giftTrial: '/stickers/gifts/8.json',       // Подарочная коробка
  giftBasic: '/stickers/locket/5.json',      // Сердечко
  giftAdvanced: '/stickers/gifts/28.json',   // Другой подарок
  giftPremium: '/stickers/ducks/77.json',    // Премиум утка

  // TAB BAR - Unique contextual scenes
  tabHome: '/stickers/mascot/0.json',         // Home duck
  tabEvents: '/stickers/ducks/1.json',        // Events duck
  tabChannels: '/stickers/gifts/1.json',      // Channels gift
  tabPlans: '/stickers/locket/1.json',        // Plans heart
  tabProfile: '/stickers/ducks/2.json',       // Profile duck

  // FEATURE CARDS
  cardNewEvent: '/stickers/gifts/20.json',
  cardMyEvents: '/stickers/ducks/30.json',
  cardChannels: '/stickers/ducks/35.json',
  cardPlans: '/stickers/locket/10.json',
  cardProfile: '/stickers/locket/15.json',

  // ONBOARDING
  onboard1: '/stickers/mascot/1.json',
  onboard2: '/stickers/mascot/21.json',
  onboard3: '/stickers/mascot/41.json',
  onboard4: '/stickers/mascot/61.json',

  // SUPPORT & EMPTY
  support: '/stickers/mascot/80.json',
  noEvents: '/stickers/mascot/100.json',
  noChannels: '/stickers/mascot/110.json',

  // UI STATES
  loading: '/stickers/ducks/40.json',
  success: '/stickers/ducks/46.json',
  error: '/stickers/ducks/51.json',
  warning: '/stickers/ui/10.json',

  // DECORATIONS
  banner: '/stickers/locket/20.json',
  info: '/stickers/ui/15.json',
  profileDecor: '/stickers/locket/25.json',
  welcome: '/stickers/gifts/30.json',

  // LEADERBOARD
  trophy: '/stickers/gifts/35.json',
  medal: '/stickers/gifts/41.json',
  crown: '/stickers/locket/31.json',

  // HINTS
  channelHint: '/stickers/ducks/56.json',
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
    <div
      style={sizeStyle}
      className={`flex items-center justify-center overflow-hidden ${className}`}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
