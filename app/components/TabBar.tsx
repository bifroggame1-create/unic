'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Sticker, { StickerName } from './Sticker'
import { t } from '../lib/translations'
import { api } from '../lib/api'

interface Tab {
  href: string
  sticker: StickerName
  labelKey: string
  id: string
  requiresAdmin?: boolean // Tab only visible to admins
}

const allTabs: Tab[] = [
  { href: '/', sticker: 'tabHome', labelKey: 'nav.home', id: 'tab-home' },
  { href: '/discover', sticker: 'trophy', labelKey: 'nav.discover', id: 'tab-discover' },
  { href: '/events', sticker: 'tabEvents', labelKey: 'nav.events', id: 'tab-events', requiresAdmin: true },
  { href: '/channels', sticker: 'tabChannels', labelKey: 'nav.channels', id: 'tab-channels', requiresAdmin: true },
  { href: '/packages', sticker: 'tabPlans', labelKey: 'nav.plans', id: 'tab-plans' },
  { href: '/profile', sticker: 'tabProfile', labelKey: 'nav.profile', id: 'tab-profile' },
]

export default function TabBar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')

  useEffect(() => {
    // Fetch user role
    api.getMe().then(({ user }) => {
      setUserRole(user.userRole)
    }).catch(console.error)
  }, [])

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => {
    if (tab.requiresAdmin) {
      return userRole === 'admin'
    }
    return true
  })

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40
                 bg-[var(--tg-theme-bg-color)]/95 backdrop-blur-xl
                 border-t border-[var(--tg-theme-hint-color)]/20"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-[480px] mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href ||
            (tab.href !== '/' && pathname.startsWith(tab.href))

          return (
            <Link
              key={tab.href}
              id={tab.id}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center gap-1
                flex-1 touch-target rounded-xl
                active:scale-90 transition-transform
                ${isActive ? 'text-[var(--tab-active)]' : 'text-[var(--tab-inactive)]'}
              `}
              style={{ minWidth: '60px' }}
            >
              <div className={`transition-transform ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}>
                <Sticker name={tab.sticker} size={28} loop={isActive} />
              </div>
              <span className="text-xs font-medium">{t(tab.labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
