'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sticker, { StickerName } from './Sticker'
import { t } from '../lib/translations'

interface Tab {
  href: string
  sticker: StickerName
  labelKey: string
  id: string
}

const tabs: Tab[] = [
  { href: '/', sticker: 'tabHome', labelKey: 'nav.home', id: 'tab-home' },
  { href: '/discover', sticker: 'trophy', labelKey: 'nav.discover', id: 'tab-discover' },
  { href: '/events', sticker: 'tabEvents', labelKey: 'nav.events', id: 'tab-events' },
  { href: '/channels', sticker: 'tabChannels', labelKey: 'nav.channels', id: 'tab-channels' },
  { href: '/packages', sticker: 'tabPlans', labelKey: 'nav.plans', id: 'tab-plans' },
  { href: '/profile', sticker: 'tabProfile', labelKey: 'nav.profile', id: 'tab-profile' },
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
            <span>{t(tab.labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
