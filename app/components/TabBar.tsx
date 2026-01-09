'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sticker, { StickerName } from './Sticker'

interface Tab {
  href: string
  sticker: StickerName
  label: string
  id: string
}

const tabs: Tab[] = [
  { href: '/', sticker: 'tabHome', label: 'Home', id: 'tab-home' },
  { href: '/events', sticker: 'tabEvents', label: 'Events', id: 'tab-events' },
  { href: '/channels', sticker: 'tabChannels', label: 'Channels', id: 'tab-channels' },
  { href: '/packages', sticker: 'tabPlans', label: 'Plans', id: 'tab-plans' },
  { href: '/profile', sticker: 'tabProfile', label: 'Profile', id: 'tab-profile' },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href ||
          (tab.href !== '/' && pathname.startsWith(tab.href))

        return (
          <Link
            key={tab.href}
            id={tab.id}
            href={tab.href}
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            <div className={`transition-transform ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}>
              <Sticker name={tab.sticker} size={28} loop={isActive} />
            </div>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
