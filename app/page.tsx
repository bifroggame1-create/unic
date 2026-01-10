'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { t } from './lib/translations'
import { useHaptic } from './contexts/TelegramContext'
import { api, DashboardStats } from './lib/api'
import Sticker from './components/Sticker'

export default function Home() {
  const router = useRouter()
  const haptic = useHaptic()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboard()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handlePress = (path: string) => {
    haptic.impact('light')
    router.push(path)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Sticker name="loading" size={120} />
      </div>
    )
  }

  return (
    <div className="pb-8">
      {/* Section: Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
          {t('home.quickActions')}
        </h2>

        <div className="space-y-4">
          {/* New Event - Primary Action */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePress('/events/new')}
            className="w-full bg-[var(--primary)] text-white rounded-2xl p-5 flex items-center justify-between shadow-md active:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sticker name="mascot/20" size={36} />
              </div>
              <div className="text-left">
                <div className="font-bold text-base">{t('home.newEvent')}</div>
                <div className="text-sm opacity-80">{t('home.launchNow')}</div>
              </div>
            </div>
            <svg className="w-6 h-6 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* My Events */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePress('/events')}
            className="w-full card p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sticker name="mascot/30" size={36} />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-[var(--text-primary)]">{t('home.myEvents')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.viewAll')}</div>
              </div>
            </div>
            <svg className="w-6 h-6 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Channels */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePress('/channels')}
            className="w-full card p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sticker name="mascot/40" size={36} />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-[var(--text-primary)]">{t('home.myChannels')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.manage')}</div>
              </div>
            </div>
            <svg className="w-6 h-6 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Section: Stats */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
          {t('home.stats')}
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-2">
              {stats?.eventsCreated || 0}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">{t('home.events')}</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-2">
              {stats?.totalParticipants ? (stats.totalParticipants >= 1000 ? `${(stats.totalParticipants / 1000).toFixed(1)}K` : stats.totalParticipants) : 0}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">{t('home.participants')}</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-2">
              {stats?.engagementRate || 0}%
            </div>
            <div className="text-xs text-[var(--text-secondary)]">{t('home.engagement')}</div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {stats && stats.plan === 'free' && (
        <div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePress('/packages')}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sticker name="gifts/5" size={36} />
              </div>
              <div className="text-left">
                <div className="font-bold text-base">{t('home.upgradePlan')}</div>
                <div className="text-sm opacity-80">{t('home.upgrade')}</div>
              </div>
            </div>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      )}
    </div>
  )
}
