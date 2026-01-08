'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { api, Event, LeaderboardEntry, UserPosition } from '../../lib/api'
import { useTelegram } from '../../contexts/TelegramContext'
import { useTranslation } from '../../contexts/LanguageContext'
import Sticker from '../../components/Sticker'

export default function EventLeaderboard() {
  const params = useParams()
  const eventId = params.id as string
  const { webApp } = useTelegram()
  const { t } = useTranslation()

  const [event, setEvent] = useState<Event | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myPosition, setMyPosition] = useState<UserPosition | null>(null)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [leaderboardRes, positionRes] = await Promise.all([
        api.getLeaderboard(eventId, 50),
        api.getMyPosition(eventId),
      ])

      setEvent(leaderboardRes.event)
      setLeaderboard(leaderboardRes.leaderboard)
      setTotalParticipants(leaderboardRes.totalParticipants)
      setMyPosition(positionRes.position)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
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
    if (!event?.endsAt) return

    const updateTimer = () => {
      const end = new Date(event.endsAt!).getTime()
      const now = Date.now()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft(t('leaderboard.ended'))
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`${days}d ${hours % 24}h ${minutes}m`)
      } else {
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [event?.endsAt, t])

  const handleBackToChannel = () => {
    // In Telegram, this would open the channel
    webApp?.close()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[var(--text-muted)]">{t('common.loading')}</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-[var(--text-secondary)]">{t('leaderboard.eventNotFound')}</p>
        </div>
      </div>
    )
  }

  const isCompleted = event.status === 'completed'

  return (
    <div className="fade-in -mx-4">
      {/* Header */}
      <div className={`bg-gradient-to-b ${isCompleted ? 'from-gray-600 to-gray-500' : 'from-[var(--primary)] to-[var(--primary-dark)]'} text-white px-4 pt-4 pb-8 rounded-b-3xl`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{isCompleted ? '🏁' : '🏆'}</div>
          <h1 className="text-xl font-bold mb-1">
            {isCompleted ? t('leaderboard.eventCompleted') : t('leaderboard.eventLeaderboard')}
          </h1>
          <p className="text-white/70 text-sm">
            {totalParticipants} {t('leaderboard.participants')}
          </p>
        </div>

        {/* Timer */}
        {!isCompleted && (
          <div className="mt-4 bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-white/70 text-sm mb-1">{t('leaderboard.timeRemaining')}</p>
            <p className="text-3xl font-bold font-mono">{timeLeft}</p>
          </div>
        )}
      </div>

      {/* Your Position */}
      {myPosition && (
        <div className="px-4 -mt-4">
          <div className="card p-4 border-2 border-[var(--primary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center font-bold text-[var(--primary)]">
                  #{myPosition.rank}
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{t('leaderboard.yourPosition')}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{myPosition.points} {t('leaderboard.pts')}</p>
                </div>
              </div>
              <div className="text-right text-sm text-[var(--text-secondary)]">
                <p>{myPosition.reactionsCount} {t('leaderboard.reactions')}</p>
                <p>{myPosition.commentsCount} {t('leaderboard.comments')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!myPosition && !isCompleted && (
        <div className="px-4 -mt-4">
          <div className="card p-4 bg-[var(--primary)]/10 border-[var(--primary)]/20 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {t('leaderboard.joinPrompt')}
            </p>
          </div>
        </div>
      )}

      {/* Scoring Rules */}
      {!isCompleted && (
        <div className="px-4 mt-4">
          <div className="card p-3 bg-[var(--bg-start)]">
            <p className="text-xs text-[var(--text-secondary)] text-center">
              {t('leaderboard.scoringRules')}
            </p>
          </div>
        </div>
      )}

      {/* Winners (if completed) */}
      {isCompleted && event.winners && event.winners.length > 0 && (
        <div className="px-4 mt-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">{t('leaderboard.winners')}</h3>
          <div className="space-y-2">
            {event.winners.map((winner, idx) => (
              <div key={winner.telegramId} className="card p-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {winner.username ? `@${winner.username}` : `User #${winner.telegramId}`}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">{winner.points.toLocaleString()} {t('leaderboard.pts')}</p>
                    </div>
                  </div>
                  <Sticker name="trophy" size={36} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="px-4 mt-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">
          {isCompleted ? t('leaderboard.finalStandings') : t('leaderboard.topParticipants')}
        </h3>
        {leaderboard.length === 0 ? (
          <div className="card p-6 text-center text-[var(--text-muted)] text-sm">
            {t('leaderboard.noParticipants')}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((user) => {
              const isWinner = user.rank <= (event.winnersCount || 0)
              return (
                <div
                  key={user.telegramId}
                  className={`card p-3 flex items-center justify-between ${
                    isWinner ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1
                          ? 'bg-yellow-400 text-white'
                          : user.rank === 2
                            ? 'bg-gray-300 text-white dark:bg-gray-500'
                            : user.rank === 3
                              ? 'bg-amber-600 text-white'
                              : 'bg-[var(--bg-start)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-sm">
                        {user.firstName || user.username || t('leaderboard.anonymous')}
                      </p>
                      {user.username && (
                        <p className="text-xs text-[var(--text-muted)]">@{user.username}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {user.points.toLocaleString()}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{t('leaderboard.pts')}</span>
                    {isWinner && <Sticker name="medal" size={24} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Prizes */}
      <div className="px-4 mt-6 mb-8">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">{t('leaderboard.prizes')}</h3>
        <div className="card p-4">
          <div className="flex items-center gap-4">
            <Sticker name="crown" size={60} />
            <div>
              <p className="font-medium text-[var(--text-primary)]">{t('leaderboard.telegramGifts')}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Top {event.winnersCount} {t('leaderboard.topWillReceive')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Channel */}
      <div className="px-4 pb-8">
        <button onClick={handleBackToChannel} className="btn-primary w-full">
          {t('leaderboard.backToChannel')}
        </button>
      </div>
    </div>
  )
}
