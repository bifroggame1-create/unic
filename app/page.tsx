'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from './contexts/LanguageContext'
import { useHaptic } from './contexts/TelegramContext'
import Sticker from './components/Sticker'

// ═══════════════════════════════════════════════════════════════
// NARRATIVE UI CONFIG - Each icon is a unique story scene
// NO repetitive assets (no same caps in different colors!)
// ═══════════════════════════════════════════════════════════════

const ASSETS = {
  // Header - User actively working
  headerWorking: 'mascot/10' as const,

  // Grid Menu - Unique contextual scenes
  newEvent: 'mascot/20' as const,
  myEvents: 'mascot/30' as const,
  channels: 'mascot/40' as const,
  plans: 'gifts/5' as const,

  // Additional cards
  profile: 'mascot/50' as const,
  stats: 'mascot/60' as const,

  // Tiers - Evolution of status
  tierNewbie: 'ducks/5' as const,
  tierPro: 'ducks/45' as const,
  tierLegend: 'ducks/85' as const,

  // Empty states
  noEvents: 'mascot/70' as const,
}

const MotionButton = motion.button
const MotionCard = motion.div

export default function Home() {
  const router = useRouter()
  const { t } = useTranslation()
  const haptic = useHaptic()

  const handlePress = (path: string) => {
    haptic.impact('light')
    router.push(path)
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-[var(--bg-start)] to-[var(--bg-end)]">
      {/* Premium Header - Story Scene */}
      <MotionCard
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white p-6 rounded-b-[36px] mb-6 shadow-2xl shadow-blue-500/20"
      >
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            className="w-24 h-24 flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Sticker name={ASSETS.headerWorking} size={96} />
          </motion.div>
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black tracking-tight mb-1"
            >
              {t('home.welcome')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-white/80 font-medium"
            >
              {t('home.subtitle')}
            </motion.p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>{t('home.level')} 5 • Pro</span>
            <span>600 / 1000 XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/30">
            <motion.div
              className="bg-gradient-to-r from-white to-blue-100 h-full rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </div>
      </MotionCard>

      <div className="px-4 space-y-6">
        {/* Grid Menu - 2x2 Unique Narrative Scenes */}
        <section>
          <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">
            {t('home.quickActions')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <MotionButton
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePress('/events/new')}
              className="card p-5 flex flex-col items-center gap-3 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500/30"
            >
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Sticker name={ASSETS.newEvent} size={72} />
              </motion.div>
              <div className="text-center">
                <span className="font-black text-base text-[var(--text-primary)] block">
                  {t('home.newEvent')}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  {t('home.launchNow')}
                </span>
              </div>
            </MotionButton>

            <MotionButton
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePress('/events')}
              className="card p-5 flex flex-col items-center gap-3 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500/30"
            >
              <Sticker name={ASSETS.myEvents} size={72} />
              <div className="text-center">
                <span className="font-black text-base text-[var(--text-primary)] block">
                  {t('home.myEvents')}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  {t('home.viewAll')}
                </span>
              </div>
            </MotionButton>

            <MotionButton
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePress('/channels')}
              className="card p-5 flex flex-col items-center gap-3 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500/30"
            >
              <Sticker name={ASSETS.channels} size={72} />
              <div className="text-center">
                <span className="font-black text-base text-[var(--text-primary)] block">
                  {t('home.myChannels')}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  {t('home.manage')}
                </span>
              </div>
            </MotionButton>

            <MotionButton
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePress('/packages')}
              className="card p-5 flex flex-col items-center gap-3 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-800"
            >
              <Sticker name={ASSETS.plans} size={72} />
              <div className="text-center">
                <span className="font-black text-base text-emerald-600 dark:text-emerald-400 block">
                  {t('home.plans')}
                </span>
                <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                  {t('home.upgrade')}
                </span>
              </div>
            </MotionButton>
          </div>
        </section>

        {/* Tiers Roadmap - Visual Evolution */}
        <section>
          <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">
            {t('home.yourJourney')}
          </h2>
          <div className="space-y-3">
            {/* Tier 1 - Newbie (Completed) */}
            <MotionCard
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Sticker name={ASSETS.tierNewbie} size={48} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[var(--text-primary)]">{t('tiers.newbie')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  0 - 100 {t('tiers.events')}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </MotionCard>

            {/* Tier 2 - Pro (Current) */}
            <MotionCard
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-4 flex items-center gap-4 border-2 border-[var(--primary)] shadow-xl shadow-blue-500/20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Sticker name={ASSETS.tierPro} size={48} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-[var(--text-primary)]">{t('tiers.pro')}</h3>
                  <span className="text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded-full font-bold">
                    {t('tiers.current')}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium mb-2">
                  100 - 500 {t('tiers.events')}
                </p>
                <div className="bg-[var(--bg-start)] rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </MotionCard>

            {/* Tier 3 - Legend (Locked) */}
            <MotionCard
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-4 flex items-center gap-4 opacity-60"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl relative">
                <Sticker name={ASSETS.tierLegend} size={48} />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[var(--text-primary)]">{t('tiers.legend')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  500+ {t('tiers.events')}
                </p>
              </div>
            </MotionCard>
          </div>
        </section>

        {/* Quick Stats - Premium Card */}
        <section>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10"
          >
            <h3 className="font-black text-[var(--text-primary)] mb-4 text-lg">
              {t('home.stats')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-3xl font-black bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"
                >
                  12
                </motion.div>
                <div className="text-xs text-[var(--text-secondary)] font-semibold mt-1">
                  {t('home.events')}
                </div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent"
                >
                  3.2K
                </motion.div>
                <div className="text-xs text-[var(--text-secondary)] font-semibold mt-1">
                  {t('home.participants')}
                </div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent"
                >
                  89%
                </motion.div>
                <div className="text-xs text-[var(--text-secondary)] font-semibold mt-1">
                  {t('home.engagement')}
                </div>
              </div>
            </div>
          </MotionCard>
        </section>
      </div>
    </div>
  )
}
