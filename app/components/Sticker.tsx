'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// ═══════════════════════════════════════════════════════════════
// UNIC Sticker Catalog - Contextual Mix
//
// SOURCES:
// - /stickers/gifts/ (55) - Gift boxes for packages & prizes
// - /stickers/ducks/ (120) - Daks_2024 fun ducks for UI & cards
// - /stickers/mascot/ (120) - Utya ONLY for support & onboarding
// - /stickers/ui/ (60) - UI elements for states
// - /stickers/locket/ (60) - Hearts for special decorations
//
// RULES:
// 1. NO DUPLICATES - each sticker used only once across app
// 2. Utya (mascot) ONLY for: support, empty states, onboarding
// 3. Gifts ONLY for: packages (unique per plan) & prizes
// 4. Ducks for: fun UI elements, tab bar, feature cards
// 5. Mix types by CONTEXT, not by folder
// ═══════════════════════════════════════════════════════════════

export const STICKERS = {
  // ════════════════════════════════════════════════════════════
  // TAB BAR (5 tabs) - Fun ducks for navigation
  // ════════════════════════════════════════════════════════════
  tabHome: '/stickers/ducks/0.json',        // Home duck
  tabEvents: '/stickers/ducks/10.json',     // Party duck
  tabChannels: '/stickers/ducks/20.json',   // Broadcast duck
  tabPlans: '/stickers/ducks/30.json',      // Star duck
  tabProfile: '/stickers/ducks/40.json',    // Profile duck

  // ════════════════════════════════════════════════════════════
  // FEATURE CARDS - Mixed by context
  // ════════════════════════════════════════════════════════════
  cardNewEvent: '/stickers/ducks/50.json',   // Excited duck - launch new event
  cardMyEvents: '/stickers/ducks/60.json',   // Calendar duck - my events
  cardChannels: '/stickers/ducks/70.json',   // Megaphone duck - channels
  cardPlans: '/stickers/gifts/5.json',       // Gift - upgrade plan
  cardProfile: '/stickers/ducks/80.json',    // Waving duck - profile

  // ════════════════════════════════════════════════════════════
  // PACKAGES - 5 UNIQUE GIFTS (one per plan, NO DUPLICATES!)
  // ════════════════════════════════════════════════════════════
  giftFree: '/stickers/gifts/0.json',        // Simple small gift
  giftTrial: '/stickers/gifts/10.json',      // Trial gift box
  giftBasic: '/stickers/gifts/20.json',      // Nice wrapped gift
  giftAdvanced: '/stickers/gifts/30.json',   // Premium gift
  giftPremium: '/stickers/gifts/40.json',    // Luxury gold gift

  // ════════════════════════════════════════════════════════════
  // ONBOARDING - Utya mascot poses (4 unique)
  // ════════════════════════════════════════════════════════════
  onboard1: '/stickers/mascot/0.json',       // Welcome pose
  onboard2: '/stickers/mascot/20.json',      // Explaining pose
  onboard3: '/stickers/mascot/40.json',      // Excited pose
  onboard4: '/stickers/mascot/60.json',      // Thumbs up pose

  // ════════════════════════════════════════════════════════════
  // SUPPORT & EMPTY STATES - Utya mascot ONLY HERE
  // ════════════════════════════════════════════════════════════
  support: '/stickers/mascot/80.json',       // Helpful Utya
  noEvents: '/stickers/mascot/100.json',     // Sad/waiting Utya
  noChannels: '/stickers/mascot/110.json',   // Looking Utya

  // ════════════════════════════════════════════════════════════
  // UI STATES - Mix of UI elements and ducks
  // ════════════════════════════════════════════════════════════
  loading: '/stickers/ducks/90.json',        // Loading duck
  success: '/stickers/ducks/100.json',       // Happy duck
  error: '/stickers/ducks/105.json',         // Sad duck
  warning: '/stickers/ui/0.json',            // Warning icon

  // ════════════════════════════════════════════════════════════
  // BANNERS & DECORATIONS - Hearts for special moments
  // ════════════════════════════════════════════════════════════
  banner: '/stickers/locket/0.json',         // Banner heart
  info: '/stickers/ui/10.json',              // Info icon
  profileDecor: '/stickers/locket/10.json',  // Profile decoration
  welcome: '/stickers/locket/20.json',       // Welcome heart

  // ════════════════════════════════════════════════════════════
  // LEADERBOARD & PRIZES - Gifts for prizes
  // ════════════════════════════════════════════════════════════
  trophy: '/stickers/gifts/45.json',         // Trophy gift
  medal: '/stickers/gifts/50.json',          // Medal gift
  crown: '/stickers/locket/30.json',         // Crown heart

  // ════════════════════════════════════════════════════════════
  // CHANNELS HINT - Unique duck
  // ════════════════════════════════════════════════════════════
  channelHint: '/stickers/ducks/110.json',   // Helpful duck for hint
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
