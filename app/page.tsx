'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { t } from './lib/translations'
import { useHaptic } from './contexts/TelegramContext'
import { api, DashboardStats } from './lib/api'
import Sticker from './components/Sticker'
import Container from './components/layout/Container'
import { ErrorState } from './components/ErrorState'

export default function Home() {
  const router = useRouter()
  const haptic = useHaptic()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await api.getDashboard()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handlePress = (path: string) => {
    haptic.impact('light')
    router.push(path)
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Sticker name="loading" size={120} />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState
          title="Connection Error"
          message="Unable to load dashboard. Please check your connection and try again."
          onRetry={fetchStats}
          emoji="🔌"
        />
      </Container>
    )
  }

  return (
    <Container>
      {/* Hero Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 flex items-center justify-center">
          <Sticker name="mascot/20" size={60} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back!
          </h1>
          <p className="text-[var(--text-secondary)]">
            {stats?.plan && `${stats.plan} plan`}
          </p>
        </div>
      </div>

      {/* Section: Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
          {t('home.quickActions')}
        </h2>

        <div className="space-y-3">
          {/* New Event - Primary Action */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePress('/events/new')}
            className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-2xl p-6 flex items-center justify-between shadow-lg active:shadow-sm touch-target"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sticker name="mascot/20" size={48} />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">{t('home.newEvent')}</div>
                <div className="text-sm opacity-90">{t('home.launchNow')}</div>
              </div>
            </div>
            <svg className="w-6 h-6 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* My Events */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePress('/events')}
            className="w-full card rounded-2xl p-5 flex items-center justify-between touch-target"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sticker name="mascot/30" size={42} />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-[var(--text-primary)]">{t('home.myEvents')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.viewAll')}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Channels */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePress('/channels')}
            className="w-full card rounded-2xl p-5 flex items-center justify-between touch-target"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sticker name="mascot/40" size={42} />
              </div>
              <div className="text-left">
                <div className="font-bold text-base text-[var(--text-primary)]">{t('home.myChannels')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.manage')}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="grid grid-cols-3 gap-3">
          <div className="card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-1">
              {stats?.eventsCreated || 0}
            </div>
            <div className="text-xs text-[var(--text-secondary)] leading-tight">{t('home.events')}</div>
          </div>
          <div className="card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-1">
              {stats?.totalParticipants ? (stats.totalParticipants >= 1000 ? `${(stats.totalParticipants / 1000).toFixed(1)}K` : stats.totalParticipants) : 0}
            </div>
            <div className="text-xs text-[var(--text-secondary)] leading-tight">{t('home.participants')}</div>
          </div>
          <div className="card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-1">
              {stats?.engagementRate || 0}%
            </div>
            <div className="text-xs text-[var(--text-secondary)] leading-tight">{t('home.engagement')}</div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {stats && stats.plan === 'free' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePress('/packages')}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg touch-target"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sticker name="gifts/5" size={48} />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">{t('home.upgradePlan')}</div>
              <div className="text-sm opacity-90">{t('home.upgrade')}</div>
            </div>
          </div>
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}
    </Container>
  )
}
