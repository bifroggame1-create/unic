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

      {/* Section: Your Progress */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
          {t('home.yourJourney')}
        </h2>

        <div className="card p-6">
          {/* Current Tier */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sticker name="ducks/45" size={40} />
              </div>
              <div>
                <div className="font-bold text-base text-[var(--text-primary)]">{t('tiers.pro')}</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('home.level')} 5</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[var(--primary)]">600/1000</div>
              <div className="text-xs text-[var(--text-secondary)]">XP</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-[var(--bg-start)] rounded-full h-3 overflow-hidden mb-5">
            <motion.div
              className="bg-[var(--primary)] h-full"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Next Tier */}
          <div className="flex items-center justify-between pt-5 border-t border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center opacity-40 flex-shrink-0">
                <Sticker name="ducks/85" size={36} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-secondary)]">{t('tiers.legend')}</div>
                <div className="text-xs text-[var(--text-muted)]">500+ {t('tiers.events')}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Section: Stats */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
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
    </div>
  )
}
