'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, EventWithPositionResponse } from '../../lib/api'
import { useTelegram } from '../../contexts/TelegramContext'
import { useTranslation } from '../../contexts/LanguageContext'
import Sticker from '../../components/Sticker'

export default function EventOverview() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const { webApp } = useTelegram()
  const { t } = useTranslation()

  const [data, setData] = useState<EventWithPositionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')
  const [showBoostModal, setShowBoostModal] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const response = await api.getEventWithPosition(eventId)
      setData(response)
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Update timer
  useEffect(() => {
    if (!data?.event.timeRemaining) return

    const updateTimer = () => {
      const { hours, minutes, totalMs } = data.event.timeRemaining!

      if (totalMs <= 0) {
        setTimeLeft(t('leaderboard.ended'))
        return
      }

      const now = Date.now()
      const endTime = now + totalMs
      const diff = endTime - now

      if (diff <= 0) {
        setTimeLeft(t('leaderboard.ended'))
        return
      }

      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      if (h > 24) {
        const days = Math.floor(h / 24)
        setTimeLeft(`${days}d ${h % 24}h ${m}m`)
      } else {
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [data?.event.timeRemaining, t])

  const handleBoostPurchase = async (boostType: 'x2_24h' | 'x1.5_forever') => {
    try {
      setShowBoostModal(false)

      // Create invoice
      const { invoiceLink, paymentId } = await api.createBoostInvoice(eventId, boostType)

      // Open Telegram Stars payment
      webApp?.openInvoice(invoiceLink, async (status) => {
        if (status === 'paid') {
          // Payment successful, apply boost
          try {
            await api.applyBoost(eventId, paymentId)
            fetchData() // Refresh to show new boost status
            webApp?.showAlert('Boost activated successfully!')
          } catch (error: any) {
            webApp?.showAlert(error.message || 'Failed to activate boost')
          }
        } else if (status === 'cancelled') {
          webApp?.showAlert('Payment cancelled')
        } else if (status === 'failed') {
          webApp?.showAlert('Payment failed')
        }
      })
    } catch (error: any) {
      webApp?.showAlert(error.message || 'Failed to create invoice')
      setShowBoostModal(true) // Reopen modal on error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Sticker name="loading" size={120} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-[var(--text-secondary)]">{t('leaderboard.eventNotFound')}</p>
        </div>
      </div>
    )
  }

  const { event, topTen, userPosition } = data
  const isActive = event.status === 'active'
  const isWinning = userPosition && userPosition.rank <= event.winnersCount

  const getActivityTypeIcon = (type: string) => {
    const types: Record<string, string> = {
      reactions: '👍',
      comments: '💬',
      all: '👍💬'
    }
    return types[type] || '🎯'
  }

  return (
    <div className="fade-in pb-8 -mx-4">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-b ${isActive ? 'from-[var(--primary)] to-[var(--primary-dark)]' : 'from-gray-600 to-gray-500'} text-white px-4 pt-6 pb-8 rounded-b-3xl`}>
        <div className="text-center">
          <div className="text-5xl mb-3">{isActive ? '🎁' : '🏁'}</div>
          <h1 className="text-2xl font-bold mb-2">
            {event.title || t('leaderboard.eventLeaderboard')}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm opacity-90">
            <span>{getActivityTypeIcon(event.activityType)}</span>
            <span>{event.participantsCount} {t('leaderboard.participants')}</span>
          </div>
        </div>

        {/* Timer */}
        {isActive && event.timeRemaining && (
          <div className="mt-5 bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-white/80 text-sm mb-2">{t('leaderboard.timeRemaining')}</p>
            <p className="text-3xl font-bold font-mono">{timeLeft}</p>
          </div>
        )}
      </div>

      {/* Your Position Card */}
      {userPosition && (
        <div className="px-4 -mt-6 mb-6">
          <div className={`card p-5 ${isWinning ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400' : 'border-2 border-[var(--primary)]'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${isWinning ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                  #{userPosition.rank}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{t('leaderboard.yourPosition')}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {userPosition.points} {t('leaderboard.pts')}
                  </p>
                </div>
              </div>
              {isWinning && (
                <Sticker name="trophy" size={50} />
              )}
            </div>

            {isWinning && (
              <div className="bg-yellow-400/20 rounded-xl p-3 text-center">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  🏆 {t('leaderboard.youAreWinning')}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => router.push(`/event/${eventId}/leaderboard`)}
                className="btn-secondary text-sm py-3"
              >
                {t('leaderboard.viewFull')}
              </button>
              <button
                onClick={() => router.push(`/event/${eventId}/me`)}
                className="btn-secondary text-sm py-3"
              >
                {t('leaderboard.myProgress')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Prompt (if not participating) */}
      {!userPosition && isActive && (
        <div className="px-4 -mt-6 mb-6">
          <div className="card p-5 bg-[var(--primary)]/5 border-[var(--primary)]/20 text-center">
            <Sticker name="mascot/20" size={80} className="mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {t('leaderboard.joinPrompt')}
            </p>
            <button onClick={() => webApp?.close()} className="btn-primary w-full">
              {t('leaderboard.backToChannel')}
            </button>
          </div>
        </div>
      )}

      {/* Prizes */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">{t('leaderboard.prizes')}</h3>
        <div className="space-y-3">
          {event.prizes.map((prize) => (
            <div key={prize.position} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  prize.position <= 3
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                    : 'bg-[var(--bg-start)] text-[var(--text-secondary)]'
                }`}>
                  #{prize.position}
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{prize.name}</p>
                  {prize.value && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      {prize.value} ⭐
                    </p>
                  )}
                </div>
              </div>
              <Sticker name="gifts/5" size={40} />
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Leaderboard */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-[var(--text-primary)]">{t('leaderboard.topParticipants')}</h3>
          <button
            onClick={() => router.push(`/event/${eventId}/leaderboard`)}
            className="text-sm text-[var(--primary)] font-semibold"
          >
            {t('leaderboard.viewAll')}
          </button>
        </div>

        {topTen.length === 0 ? (
          <div className="card p-8 text-center">
            <Sticker name="noEvents" size={100} className="mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">{t('leaderboard.noParticipants')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topTen.map((user) => {
              const isTop3 = user.rank <= 3
              return (
                <div
                  key={user.rank}
                  className={`card p-4 flex items-center justify-between ${
                    isTop3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                        : user.rank === 2
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                          : user.rank === 3
                            ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                            : 'bg-[var(--bg-start)] text-[var(--text-secondary)]'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[var(--text-primary)]">
                        {user.firstName || user.username || t('leaderboard.anonymous')}
                      </p>
                      {user.username && (
                        <p className="text-xs text-[var(--text-muted)]">@{user.username}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">
                      {user.points.toLocaleString()}
                    </span>
                    {isTop3 && <Sticker name="medal" size={24} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Boost CTA */}
      {isActive && event.boostsEnabled && (
        <div className="px-4 mb-6">
          <button
            onClick={() => setShowBoostModal(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                ⚡
              </div>
              <div className="text-left">
                <div className="font-bold text-base">{t('event.boostPoints')}</div>
                <div className="text-sm opacity-80">{t('event.getMorePoints')}</div>
              </div>
            </div>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fadeIn" onClick={() => setShowBoostModal(false)}>
          <div className="bg-[var(--card-bg)] w-full max-w-[480px] rounded-t-3xl p-6 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('event.chooseBoost')}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{t('event.boostDescription')}</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleBoostPurchase('x2_24h')}
                className="w-full card p-5 text-left hover:bg-[var(--bg-start)] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg text-[var(--text-primary)]">2x Boost</div>
                  <div className="bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                    24h
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {t('event.doublePoints')}
                </p>
                <div className="text-[var(--primary)] font-bold">100 ⭐</div>
              </button>

              <button
                onClick={() => handleBoostPurchase('x1.5_forever')}
                className="w-full card p-5 text-left hover:bg-[var(--bg-start)] transition-colors border-2 border-[var(--primary)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg text-[var(--text-primary)]">1.5x Boost</div>
                  <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    FOREVER
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {t('event.foreverBoost')}
                </p>
                <div className="text-[var(--primary)] font-bold">200 ⭐</div>
              </button>
            </div>

            <button
              onClick={() => setShowBoostModal(false)}
              className="btn-secondary w-full"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Scoring Rules */}
      {isActive && (
        <div className="px-4">
          <div className="card p-4 bg-[var(--bg-start)]">
            <p className="text-xs text-[var(--text-secondary)] text-center mb-2">
              {t('leaderboard.scoringRules')}
            </p>
            <div className="flex justify-center gap-6 text-xs text-[var(--text-muted)]">
              <span>👍 = 1pt</span>
              <span>💬 = 3pts</span>
              <span>↩️ = 2pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
