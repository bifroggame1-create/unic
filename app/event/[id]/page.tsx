'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, EventWithPositionResponse } from '../../lib/api'
import { useTelegram } from '../../contexts/TelegramContext'
import { t } from '../../lib/translations'
import Sticker from '../../components/Sticker'

export default function EventOverview() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const { webApp } = useTelegram()

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
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (!data?.event.timeRemaining) return

    const updateTimer = () => {
      const { hours, minutes, totalMs } = data.event.timeRemaining!

      if (totalMs <= 0) {
        setTimeLeft('Ended')
        return
      }

      const now = Date.now()
      const endTime = now + totalMs
      const diff = endTime - now

      if (diff <= 0) {
        setTimeLeft('Ended')
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
  }, [data?.event.timeRemaining])

  const handleBoostPurchase = async (boostType: 'x2_24h' | 'x1.5_forever') => {
    try {
      setShowBoostModal(false)

      const { invoiceLink, paymentId } = await api.createBoostInvoice(eventId, boostType)

      webApp?.openInvoice?.(invoiceLink, async (status: string) => {
        if (status === 'paid') {
          try {
            await api.applyBoost(eventId, paymentId)
            fetchData()
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
      setShowBoostModal(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Sticker name="loading" size={120} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <p className="text-[var(--text-secondary)] text-lg">Event not found</p>
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
    <div className="fade-in pb-12 -mx-4">
      {/* Hero Header */}
      <div className={`relative overflow-hidden ${isActive ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-600 to-gray-800'} text-white px-6 pt-8 pb-12 shadow-2xl`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative text-center space-y-4">
          <div className="text-7xl animate-bounce-slow">{isActive ? '🎁' : '🏁'}</div>
          <h1 className="text-3xl font-black tracking-tight">
            {event.title || 'Event Leaderboard'}
          </h1>
          <div className="flex items-center justify-center gap-3 text-base font-medium opacity-95">
            <span className="text-2xl">{getActivityTypeIcon(event.activityType)}</span>
            <span>{event.participantsCount} Participants</span>
          </div>
        </div>

        {/* Timer Card */}
        {isActive && event.timeRemaining && (
          <div className="relative mt-8 bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl">
            <p className="text-white/90 text-sm font-semibold mb-3 tracking-wide uppercase">Time Remaining</p>
            <p className="text-4xl font-black font-mono tracking-wider">{timeLeft}</p>
          </div>
        )}
      </div>

      {/* Your Position - Elevated Card */}
      {userPosition && (
        <div className="px-6 -mt-8 mb-8">
          <div className={`card p-6 shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${
            isWinning
              ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 border-2 border-yellow-400 shadow-yellow-200/50'
              : 'border-2 border-[var(--primary)] shadow-[var(--primary)]/20'
          }`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${
                  isWinning
                    ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white'
                    : 'bg-gradient-to-br from-[var(--primary)] to-purple-600 text-white'
                }`}>
                  #{userPosition.rank}
                </div>
                <div>
                  <p className="font-bold text-lg text-[var(--text-primary)]">Your Position</p>
                  <p className="text-base text-[var(--text-secondary)] font-semibold">
                    {userPosition.points.toLocaleString()} pts
                  </p>
                </div>
              </div>
              {isWinning && (
                <div className="animate-bounce-slow">
                  <Sticker name="trophy" size={60} />
                </div>
              )}
            </div>

            {isWinning && (
              <div className="bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-2xl p-4 mb-5 border border-yellow-400/50">
                <p className="text-base font-bold text-yellow-800 dark:text-yellow-200 text-center">
                  🏆 You're in winning position!
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push(`/event/${eventId}/leaderboard`)}
                className="btn-secondary py-4 font-semibold hover:scale-105 transition-transform"
              >
                View Full Board
              </button>
              <button
                onClick={() => router.push(`/event/${eventId}/me`)}
                className="btn-primary py-4 font-semibold hover:scale-105 transition-transform"
              >
                My Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Prompt */}
      {!userPosition && isActive && (
        <div className="px-6 -mt-8 mb-8">
          <div className="card p-8 bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-2 border-[var(--primary)]/30 text-center space-y-5 shadow-xl">
            <Sticker name="mascot/20" size={100} className="mx-auto" />
            <p className="text-base text-[var(--text-secondary)] font-medium">
              React and comment in the channel to join the competition!
            </p>
            <button onClick={() => webApp?.close()} className="btn-primary w-full py-4 text-lg font-bold">
              Back to Channel
            </button>
          </div>
        </div>
      )}

      {/* Prizes Section */}
      <div className="px-6 mb-8">
        <h3 className="font-black text-2xl text-[var(--text-primary)] mb-5">Prizes</h3>
        <div className="space-y-4">
          {event.prizes.map((prize) => (
            <div
              key={prize.position}
              className="card p-5 flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${
                  prize.position === 1
                    ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-white'
                    : prize.position === 2
                      ? 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 text-white'
                      : prize.position === 3
                        ? 'bg-gradient-to-br from-orange-400 via-orange-600 to-orange-700 text-white'
                        : 'bg-gradient-to-br from-[var(--bg-start)] to-[var(--bg-end)] text-[var(--text-secondary)] border-2 border-[var(--border-color)]'
                }`}>
                  #{prize.position}
                </div>
                <div>
                  <p className="font-bold text-base text-[var(--text-primary)]">{prize.name}</p>
                  {prize.value && (
                    <p className="text-sm text-[var(--text-secondary)] font-semibold flex items-center gap-1">
                      {prize.value} <span className="text-yellow-500">⭐</span>
                    </p>
                  )}
                </div>
              </div>
              <Sticker name="gifts/5" size={48} />
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Leaderboard */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-2xl text-[var(--text-primary)]">Top Participants</h3>
          <button
            onClick={() => router.push(`/event/${eventId}/leaderboard`)}
            className="text-base text-[var(--primary)] font-bold hover:scale-110 transition-transform"
          >
            View All →
          </button>
        </div>

        {topTen.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <Sticker name="noEvents" size={120} className="mx-auto" />
            <p className="text-base text-[var(--text-muted)] font-medium">No participants yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topTen.map((user) => {
              const isTop3 = user.rank <= 3
              return (
                <div
                  key={user.rank}
                  className={`card p-5 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] shadow-lg ${
                    isTop3 ? 'bg-gradient-to-r from-yellow-50/80 via-orange-50/80 to-red-50/80 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-yellow-300' : 'border-2 border-transparent hover:border-[var(--primary)]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-md ${
                      user.rank === 1
                        ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-white'
                        : user.rank === 2
                          ? 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 text-white'
                          : user.rank === 3
                            ? 'bg-gradient-to-br from-orange-400 via-orange-600 to-orange-700 text-white'
                            : 'bg-[var(--bg-start)] text-[var(--text-secondary)] border-2 border-[var(--border-color)]'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-bold text-base text-[var(--text-primary)]">
                        {user.firstName || user.username || 'Anonymous'}
                      </p>
                      {user.username && (
                        <p className="text-sm text-[var(--text-muted)] font-medium">@{user.username}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg text-[var(--text-primary)]">
                      {user.points.toLocaleString()}
                    </span>
                    {isTop3 && <Sticker name="medal" size={28} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Boost CTA */}
      {isActive && event.boostsEnabled && (
        <div className="px-6 mb-8">
          <button
            onClick={() => setShowBoostModal(true)}
            className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white rounded-3xl p-6 flex items-center justify-between shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98] transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm shadow-lg">
                ⚡
              </div>
              <div className="text-left">
                <div className="font-black text-xl">Boost Your Points</div>
                <div className="text-base opacity-90 font-medium">Get ahead of the competition</div>
              </div>
            </div>
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-fadeIn" onClick={() => setShowBoostModal(false)}>
          <div className="bg-[var(--card-bg)] w-full max-w-[480px] rounded-t-3xl p-8 animate-slideUp shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-8 space-y-3">
              <div className="text-6xl animate-bounce-slow">⚡</div>
              <h3 className="text-2xl font-black text-[var(--text-primary)]">Choose Your Boost</h3>
              <p className="text-base text-[var(--text-secondary)] font-medium">Multiply your points and climb faster!</p>
            </div>

            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleBoostPurchase('x2_24h')}
                className="w-full card p-6 text-left hover:scale-[1.02] transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)] shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-black text-2xl text-[var(--text-primary)]">2x Boost</div>
                  <div className="bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-md">
                    24 HOURS
                  </div>
                </div>
                <p className="text-base text-[var(--text-secondary)] mb-4 font-medium">
                  Double your points for the next 24 hours
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-black text-2xl">100</span>
                  <span className="text-yellow-500 text-2xl">⭐</span>
                </div>
              </button>

              <button
                onClick={() => handleBoostPurchase('x1.5_forever')}
                className="w-full card p-6 text-left hover:scale-[1.02] transition-all duration-300 border-2 border-[var(--primary)] shadow-2xl bg-gradient-to-br from-[var(--primary)]/5 to-purple-500/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-black text-2xl text-[var(--text-primary)]">1.5x Boost</div>
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-md">
                    FOREVER
                  </div>
                </div>
                <p className="text-base text-[var(--text-secondary)] mb-4 font-medium">
                  Permanent 1.5x multiplier until event ends
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-black text-2xl">200</span>
                  <span className="text-yellow-500 text-2xl">⭐</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowBoostModal(false)}
              className="btn-secondary w-full py-4 font-bold text-lg"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Scoring Rules */}
      {isActive && (
        <div className="px-6">
          <div className="card p-6 bg-gradient-to-br from-[var(--bg-start)] to-[var(--bg-end)] shadow-lg">
            <p className="text-sm text-[var(--text-secondary)] text-center mb-3 font-bold uppercase tracking-wide">
              Scoring Rules
            </p>
            <div className="flex justify-center gap-8 text-sm font-bold">
              <span className="flex items-center gap-2">
                <span className="text-2xl">👍</span>
                <span className="text-[var(--text-primary)]">1pt</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <span className="text-[var(--text-primary)]">3pts</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-2xl">↩️</span>
                <span className="text-[var(--text-primary)]">2pts</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
