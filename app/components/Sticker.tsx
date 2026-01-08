'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// ═══════════════════════════════════════════════════════════════
// UNIC Sticker Catalog - Contextual & Unique
//
// RULES:
// 1. NO DUPLICATES - each sticker used only once
// 2. Utya (mascot) ONLY for: support, empty states, onboarding
// 3. Gifts for: packages (each plan = unique gift)
// 4. Locket hearts for: decorative elements, cards
// 5. UI stickers for: tabs, states
// ═══════════════════════════════════════════════════════════════

export const STICKERS = {
  // ════════════════════════════════════════════════════════════
  // TAB BAR (5 unique simple icons from UI pack)
  // ════════════════════════════════════════════════════════════
  tabHome: '/stickers/ui/0.json',
  tabEvents: '/stickers/ui/5.json',
  tabChannels: '/stickers/ui/10.json',
  tabPlans: '/stickers/ui/15.json',
  tabProfile: '/stickers/ui/20.json',

  // ════════════════════════════════════════════════════════════
  // FEATURE CARDS - contextual locket hearts
  // ════════════════════════════════════════════════════════════
  cardNewEvent: '/stickers/locket/0.json',     // Launch/rocket feel
  cardMyEvents: '/stickers/locket/5.json',     // Calendar/list
  cardChannels: '/stickers/locket/10.json',    // Broadcast
  cardPlans: '/stickers/locket/15.json',       // Star/premium
  cardProfile: '/stickers/locket/20.json',     // User

  // ════════════════════════════════════════════════════════════
  // PACKAGES - 5 UNIQUE GIFTS (one per plan, NO DUPLICATES!)
  // ════════════════════════════════════════════════════════════
  giftFree: '/stickers/gifts/0.json',          // Simple small gift
  giftTrial: '/stickers/gifts/8.json',         // Medium gift
  giftBasic: '/stickers/gifts/16.json',        // Nice wrapped gift
  giftAdvanced: '/stickers/gifts/24.json',     // Premium gift
  giftPremium: '/stickers/gifts/32.json',      // Luxury gold gift

  // ════════════════════════════════════════════════════════════
  // ONBOARDING - mascot poses (4 unique)
  // ════════════════════════════════════════════════════════════
  onboard1: '/stickers/mascot/0.json',
  onboard2: '/stickers/mascot/15.json',
  onboard3: '/stickers/mascot/30.json',
  onboard4: '/stickers/mascot/45.json',

  // ════════════════════════════════════════════════════════════
  // SUPPORT & EMPTY STATES - Utya mascot ONLY HERE
  // ════════════════════════════════════════════════════════════
  support: '/stickers/mascot/60.json',         // Helpful duck
  noEvents: '/stickers/mascot/75.json',        // Sad/waiting duck
  noChannels: '/stickers/mascot/90.json',      // Looking duck

  // ════════════════════════════════════════════════════════════
  // UI STATES - different stickers
  // ════════════════════════════════════════════════════════════
  loading: '/stickers/ui/25.json',
  success: '/stickers/locket/25.json',
  error: '/stickers/ui/30.json',
  warning: '/stickers/ui/35.json',

  // ════════════════════════════════════════════════════════════
  // BANNERS & DECORATIONS - all unique
  // ════════════════════════════════════════════════════════════
  banner: '/stickers/locket/30.json',
  info: '/stickers/ui/40.json',
  profileDecor: '/stickers/locket/35.json',
  welcome: '/stickers/locket/40.json',

  // ════════════════════════════════════════════════════════════
  // LEADERBOARD & PRIZES
  // ════════════════════════════════════════════════════════════
  trophy: '/stickers/gifts/40.json',
  medal: '/stickers/gifts/48.json',
  crown: '/stickers/locket/45.json',
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

  // Loading state
  if (!animationData && !error) {
    return (
      <div
        style={sizeStyle}
        className={`animate-pulse bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 rounded-2xl ${className}`}
      />
    )
  }

  // Error fallback - show emoji placeholder
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
