'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, UserStats } from '../lib/api'
import { useTelegram } from '../contexts/TelegramContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage, useTranslation, Language } from '../contexts/LanguageContext'
import Sticker from '../components/Sticker'
import Loading from '../components/Loading'

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

const THEMES = [
  { value: 'light', label: '☀️ Light', labelRu: '☀️ Светлая', labelZh: '☀️ 浅色' },
  { value: 'dark', label: '🌙 Dark', labelRu: '🌙 Тёмная', labelZh: '🌙 深色' },
  { value: 'system', label: '⚙️ System', labelRu: '⚙️ Система', labelZh: '⚙️ 系统' },
] as const

export default function Profile() {
  const router = useRouter()
  const { user: telegramUser } = useTelegram()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const getThemeLabel = (themeItem: typeof THEMES[number]) => {
    if (language === 'ru') return themeItem.labelRu
    if (language === 'zh') return themeItem.labelZh
    return themeItem.label
  }

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await api.getMyStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyReferral = async () => {
    if (!stats?.referralCode) return
    const link = `https://t.me/UnicBot?start=ref_${stats.referralCode}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPlanDisplay = (plan: string) => {
    const plans: Record<string, { label: string; color: string }> = {
      free: { label: t('packages.free'), color: 'bg-[var(--bg-start)] text-[var(--text-secondary)]' },
      trial: { label: t('packages.trial'), color: 'bg-[var(--primary)]/10 text-[var(--primary)]' },
      basic: { label: t('packages.basic'), color: 'bg-[var(--success)]/10 text-[var(--success)]' },
      advanced: { label: t('packages.advanced'), color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      premium: { label: t('packages.premium'), color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    }
    return plans[plan] || plans.free
  }

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t('profile.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{t('profile.manageAccount')}</p>
        <Loading text={t('profile.loadingProfile')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sticker name="error" size={80} />
          </div>
          <h3 className="font-medium text-[var(--text-primary)] mb-2">{t('profile.errorLoading')}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">{error}</p>
          <button onClick={loadStats} className="btn-primary">
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  const planInfo = stats ? getPlanDisplay(stats.plan) : getPlanDisplay('free')

  return (
    <div className="fade-in">
      <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t('profile.title')}</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">{t('profile.manageAccount')}</p>

      {/* User Card */}
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {telegramUser?.first_name?.charAt(0) || '?'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[var(--text-primary)]">
                {telegramUser?.first_name || 'User'}
                {telegramUser?.last_name && ` ${telegramUser.last_name}`}
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planInfo.color}`}>
                {planInfo.label}
              </span>
            </div>
            {telegramUser?.username && (
              <p className="text-sm text-[var(--text-secondary)]">@{telegramUser.username}</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Usage Card */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-[var(--primary)] mb-3">{t('profile.monthlyUsage')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">{t('profile.eventsThisMonth')}</span>
            <span className="font-medium text-[var(--text-primary)]">
              {stats?.eventsThisMonth || 0} / {stats?.limits.events || 1}
            </span>
          </div>
          <div className="w-full bg-[var(--bg-start)] rounded-full h-2">
            <div
              className="bg-[var(--primary)] h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(((stats?.eventsThisMonth || 0) / (stats?.limits.events || 1)) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">{t('profile.channelsLimit')}</span>
            <span className="text-[var(--text-primary)]">{stats?.limits.channels || 1}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">{t('profile.maxParticipants')}</span>
            <span className="text-[var(--text-primary)]">
              {stats?.limits.participants === 999999 ? t('profile.unlimited') : stats?.limits.participants || 100}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-[var(--primary)] mb-3">{t('profile.stats')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-start)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.eventsCreated || 0}</p>
            <p className="text-xs text-[var(--text-secondary)]">{t('profile.totalEvents')}</p>
          </div>
          <div className="bg-[var(--bg-start)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.referralsCount || 0}</p>
            <p className="text-xs text-[var(--text-secondary)]">{t('profile.referral')}</p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-[var(--primary)] mb-3">{t('profile.settings')}</h3>

        {/* Theme Selector */}
        <div className="mb-4">
          <p className="text-sm text-[var(--text-secondary)] mb-2">{t('profile.theme')}</p>
          <div className="flex gap-2">
            {THEMES.map((themeItem) => (
              <button
                key={themeItem.value}
                onClick={() => setTheme(themeItem.value)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  theme === themeItem.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--bg-start)] text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                }`}
              >
                {getThemeLabel(themeItem)}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{t('profile.language')}</p>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  language === lang.code
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--bg-start)] text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Card */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-[var(--primary)] mb-2">{t('profile.referralProgram')}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          {t('profile.inviteAndEarn')}
        </p>
        {stats?.referralCode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={`t.me/UnicBot?start=ref_${stats.referralCode}`}
              readOnly
              className="input text-sm flex-1"
            />
            <button
              onClick={handleCopyReferral}
              className="btn-primary text-sm py-2 px-4"
            >
              {copied ? t('common.copied') : t('profile.copy')}
            </button>
          </div>
        )}
      </div>

      {/* Decorative Sticker */}
      <div className="flex justify-center mb-6 opacity-60">
        <Sticker name="profileDecor" size={100} />
      </div>

      {/* Plan Expiry */}
      {stats?.planExpiresAt && stats.plan !== 'free' && (
        <div className="card p-4 mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              <Sticker name="warning" size={40} />
            </div>
            <div>
              <p className="font-medium text-[var(--text-primary)]">{t('profile.planExpires')}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {new Date(stats.planExpiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      <button
        onClick={() => router.push('/packages')}
        className="btn-primary w-full"
      >
        {stats?.plan === 'free' ? t('profile.upgradePlan') : t('profile.managePlan')}
      </button>

      {/* Footer Links */}
      <div className="flex justify-center gap-4 mt-8 text-sm text-[var(--text-muted)]">
        <a href="https://t.me/unicsupport" className="hover:text-[var(--text-secondary)]">{t('profile.support')}</a>
        <span>•</span>
        <a href="#" className="hover:text-[var(--text-secondary)]">{t('profile.privacy')}</a>
        <span>•</span>
        <a href="#" className="hover:text-[var(--text-secondary)]">{t('profile.terms')}</a>
      </div>
    </div>
  )
}
