'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, UserStats } from '../lib/api'
import { useTelegram, useHaptic } from '../contexts/TelegramContext'
import { t } from '../lib/translations'
import { getUserFriendlyError } from '../lib/constants'
import Sticker from '../components/Sticker'
import Loading from '../components/Loading'
import Container from '../components/layout/Container'
import { ErrorState } from '../components/ErrorState'

export default function Profile() {
  const router = useRouter()
  const { user: telegramUser } = useTelegram()
  const haptic = useHaptic()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
    loadAvatar()
  }, [])

  const loadAvatar = async () => {
    if (!telegramUser?.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/${telegramUser.id}/avatar`)
      if (response.ok) {
        const data = await response.json()
        setAvatarUrl(data.avatarUrl)
      }
    } catch (err) {
      console.error('Failed to load avatar:', err)
      // Ignore errors - just use fallback
    }
  }

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await api.getMyStats()
      setStats(data)
    } catch (err) {
      setError(getUserFriendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleCopyReferral = async () => {
    if (!stats?.referralCode) return
    haptic.impact('light')
    const link = `https://t.me/rtyrtrebot?start=ref_${stats.referralCode}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPlanDisplay = (plan: string) => {
    const plans: Record<string, { label: string; gradient: string }> = {
      free: { label: t('packages.free'), gradient: 'from-gray-500 to-gray-600' },
      trial: { label: t('packages.trial'), gradient: 'from-blue-500 to-blue-600' },
      basic: { label: t('packages.basic'), gradient: 'from-green-500 to-emerald-600' },
      advanced: { label: t('packages.advanced'), gradient: 'from-purple-500 to-purple-600' },
      premium: { label: t('packages.premium'), gradient: 'from-yellow-500 to-orange-600' },
    }
    return plans[plan] || plans.free
  }

  if (loading) {
    return (
      <Container>
        <Loading text={t('profile.loadingProfile')} />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState
          title={t('profile.errorLoading')}
          message={error}
          onRetry={loadStats}
          emoji="😢"
        />
      </Container>
    )
  }

  const planInfo = stats ? getPlanDisplay(stats.plan) : getPlanDisplay('free')

  return (
    <div className="px-4 pt-6 pb-nav-safe max-w-2xl mx-auto">
      {/* Avatar Section - centered, 80px */}
      <div className="flex flex-col items-center mb-10 fade-in">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-3 shadow-lg object-cover"
          />
        ) : (
          <div className={`w-20 h-20 bg-gradient-to-br ${planInfo.gradient} rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg`}>
            {telegramUser?.first_name?.charAt(0) || telegramUser?.username?.charAt(0) || String(telegramUser?.id).charAt(0) || '?'}
          </div>
        )}
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">
          {telegramUser?.first_name || telegramUser?.username || `User ${telegramUser?.id}` || 'User'}
          {telegramUser?.last_name && ` ${telegramUser.last_name}`}
        </h1>
        {telegramUser?.username && (
          <p className="text-sm text-[var(--text-secondary)] mb-2">@{telegramUser.username}</p>
        )}
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${planInfo.gradient} text-white text-xs font-semibold whitespace-nowrap max-w-[140px] truncate`}>
          {planInfo.label}
        </div>
      </div>

      {/* 3-Column Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-10 fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent mb-1">
            {stats?.eventsCreated || 0}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">{t('profile.totalEvents')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent mb-1">
            {stats?.referralsCount || 0}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">{t('profile.referral')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent mb-1">
            {stats?.eventsThisMonth || 0}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">Этот месяц</div>
        </div>
      </div>

      {/* Badges Grid 2x3 */}
      <div className="mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-5">
          Достижения
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Badge 1 - Active User */}
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Sticker name="ducks/45" size={48} />
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-primary)]">Активный</div>
          </div>

          {/* Badge 2 - Event Creator */}
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Sticker name="ducks/85" size={48} />
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-primary)]">Создатель</div>
          </div>

          {/* Badge 3 - Referral Master */}
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Sticker name="crown" size={48} />
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-primary)]">Реферер</div>
          </div>

          {/* Badge 4 - Premium */}
          <div className={`card p-4 flex flex-col items-center justify-center text-center ${stats?.plan === 'free' ? 'opacity-30' : ''}`}>
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Sticker name="medal" size={48} />
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-primary)]">Premium</div>
          </div>

          {/* Badge 5 - Early Adopter */}
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Sticker name="success" size={48} />
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-primary)]">Первый</div>
          </div>

          {/* Badge 6 - Community */}
          <div className="card p-4 flex flex-col items-center justify-center text-center opacity-30">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Sticker name="welcome" size={48} />
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-primary)]">Сообщество</div>
          </div>
        </div>
      </div>

      {/* Monthly Usage Card */}
      <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">{t('profile.monthlyUsage')}</h3>
        <div className="space-y-4">
          {/* Events Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[var(--text-secondary)]">{t('profile.eventsThisMonth')}</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {stats?.eventsThisMonth || 0} / {stats?.limits.events || 1}
              </span>
            </div>
            <div className="w-full bg-[var(--bg-start)] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(((stats?.eventsThisMonth || 0) / (stats?.limits.events || 1)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--card-border)]">
            <div>
              <div className="text-xs text-[var(--text-secondary)] mb-1">{t('profile.channelsLimit')}</div>
              <div className="font-bold text-lg text-[var(--text-primary)]">{stats?.limits.channels || 1}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)] mb-1">{t('profile.maxParticipants')}</div>
              <div className="font-bold text-lg text-[var(--text-primary)]">
                {stats?.limits.participants === 999999 ? '∞' : stats?.limits.participants || 100}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Card */}
      <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 flex-shrink-0">
            <Sticker name="info" size={48} />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[var(--text-primary)] mb-1">
              {t('profile.referralProgram')}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {t('profile.inviteAndEarn')}
            </p>
          </div>
        </div>
        {stats?.referralCode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={`t.me/rtyrtrebot?start=ref_${stats.referralCode}`}
              readOnly
              className="input text-sm flex-1"
            />
            <button
              onClick={handleCopyReferral}
              className="btn-primary text-sm px-6 active-scale"
            >
              {copied ? '✓' : t('profile.copy')}
            </button>
          </div>
        )}
      </div>

      {/* Plan Expiry Warning */}
      {stats?.planExpiresAt && stats.plan !== 'free' && (
        <div className="card p-4 mb-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              <Sticker name="warning" size={40} />
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--text-primary)]">{t('profile.planExpires')}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {new Date(stats.planExpiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      <button
        onClick={() => {
          haptic.impact('medium')
          router.push('/packages')
        }}
        className="btn-primary w-full text-base mb-6 active-scale fade-in"
        style={{ animationDelay: '0.7s' }}
      >
        {stats?.plan === 'free' ? (
          <>
            <span>🚀</span>
            <span>{t('profile.upgradePlan')}</span>
          </>
        ) : (
          <>
            <span>⚙️</span>
            <span>{t('profile.managePlan')}</span>
          </>
        )}
      </button>

      {/* Footer Links */}
      <div className="flex justify-center gap-4 text-xs text-[var(--text-muted)]">
        <a href="https://t.me/unicsupport" className="hover:text-[var(--text-secondary)] transition-colors">
          {t('profile.support')}
        </a>
        <span>•</span>
        <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">
          {t('profile.privacy')}
        </a>
        <span>•</span>
        <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">
          {t('profile.terms')}
        </a>
      </div>
    </div>
  )
}
