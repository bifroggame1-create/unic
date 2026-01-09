'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from './contexts/LanguageContext'
import { useHaptic } from './contexts/TelegramContext'
import Sticker from './components/Sticker'

// ═══════════════════════════════════════════════════════════════
// Telegram Mini Apps Native Design
// Based on official TMA UI Kit patterns
// ═══════════════════════════════════════════════════════════════

export default function Home() {
  const router = useRouter()
  const { t } = useTranslation()
  const haptic = useHaptic()

  const handlePress = (path: string) => {
    haptic.impact('light')
    router.push(path)
  }

  return (
    <div className="pb-24">
      {/* Header Card - Compact */}
      <div className="bg-[var(--primary)] text-white px-4 py-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">UNIC</h1>
            <p className="text-sm opacity-80">{t('nav.home')}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Sticker name="mascot/10" size={40} />
          </div>
        </div>
      </div>

      {/* Section: Quick Actions */}
      <div className="px-4 mb-10">
        <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4 px-1">
          {t('home.quickActions')}
        </h2>

        <div className="space-y-3">
          {/* New Event - Primary Action */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePress('/events/new')}
            className="w-full bg-[var(--primary)] text-white rounded-xl p-5 flex items-center justify-between shadow-sm active:shadow-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sticker name="mascot/20" size={32} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-base">{t('home.newEvent')}</div>
                <div className="text-xs opacity-80">{t('home.launchNow')}</div>
              </div>
            </div>
            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                <Sticker name="mascot/30" size={32} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[var(--text-primary)]">{t('home.myEvents')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.viewAll')}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                <Sticker name="mascot/40" size={32} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[var(--text-primary)]">{t('home.myChannels')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.manage')}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Section: Your Progress */}
      <div className="px-4 mb-10">
        <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4 px-1">
          {t('home.yourJourney')}
        </h2>

        <div className="card p-5">
          {/* Current Tier */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Sticker name="ducks/45" size={36} />
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">{t('tiers.pro')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.level')} 5</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--primary)]">600 / 1000</div>
              <div className="text-xs text-[var(--text-secondary)]">XP</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-[var(--bg-start)] rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-[var(--primary)] h-full"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Next Tier */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center opacity-40">
                <Sticker name="ducks/85" size={32} />
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">{t('tiers.legend')}</div>
                <div className="text-xs text-[var(--text-muted)]">500+ {t('tiers.events')}</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Section: Stats */}
      <div className="px-4 mb-10">
        <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4 px-1">
          {t('home.stats')}
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-2">12</div>
            <div className="text-xs text-[var(--text-secondary)]">{t('home.events')}</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-2">3.2K</div>
            <div className="text-xs text-[var(--text-secondary)]">{t('home.participants')}</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)] mb-2">89%</div>
            <div className="text-xs text-[var(--text-secondary)]">{t('home.engagement')}</div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="px-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handlePress('/packages')}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-5 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sticker name="gifts/5" size={32} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-base">{t('home.upgradePlan')}</div>
              <div className="text-xs opacity-80">{t('home.upgrade')}</div>
            </div>
          </div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
