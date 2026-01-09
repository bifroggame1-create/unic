'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, TimelineResponse } from '../../../lib/api'
import { useTelegram } from '../../../contexts/TelegramContext'
import { useTranslation } from '../../../contexts/LanguageContext'
import Sticker from '../../../components/Sticker'

export default function MyProgress() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const { webApp } = useTelegram()
  const { t } = useTranslation()

  const [data, setData] = useState<TimelineResponse | null>(null)
  const [position, setPosition] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [timeline, pos] = await Promise.all([
        api.getActivityTimeline(eventId),
        api.getMyPosition(eventId),
      ])

      setData(timeline)
      setPosition(pos.position)
    } catch (error) {
      console.error('Failed to fetch progress:', error)
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

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      reactions: '👍',
      comments: '💬',
      replies: '↩️',
    }
    return icons[type] || '🎯'
  }

  const getActivityName = (type: string) => {
    const names: Record<string, string> = {
      reactions: 'Reactions',
      comments: 'Comments',
      replies: 'Replies',
    }
    return names[type] || type
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
          <p className="text-[var(--text-secondary)]">{t('leaderboard.noParticipants')}</p>
        </div>
      </div>
    )
  }

  const hasBoost = data.boostMultiplier > 1
  const boostExpired = data.boostExpiresAt && new Date(data.boostExpiresAt) < new Date()

  return (
    <div className="fade-in pb-8 -mx-4">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--primary)] to-[var(--primary-dark)] text-white px-4 pt-4 pb-6 rounded-b-3xl">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-2xl font-bold mb-1">
            {t('leaderboard.myProgress')}
          </h1>
          <p className="text-white/80 text-sm">
            {t('leaderboard.yourActivity')}
          </p>
        </div>
      </div>

      {/* Position Summary */}
      {position && (
        <div className="px-4 -mt-4 mb-6">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-[var(--primary)] mb-2">
                #{position.rank}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {t('leaderboard.yourPosition')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-[var(--bg-start)]">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {data.totalPoints}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {t('leaderboard.pts')}
                </div>
              </div>

              <div className="text-center p-4 rounded-xl bg-[var(--bg-start)]">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {hasBoost ? `${data.boostMultiplier}x` : '1x'}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Multiplier
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Boost Status */}
      {hasBoost && !boostExpired && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-600/10 border border-purple-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚡</div>
              <div className="flex-1">
                <div className="font-bold text-[var(--text-primary)] mb-1">
                  {data.boostMultiplier}x Boost Active
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {data.boostExpiresAt
                    ? `Expires ${new Date(data.boostExpiresAt).toLocaleString()}`
                    : 'Active until event ends'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Breakdown */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">
          {t('leaderboard.activityBreakdown')}
        </h3>

        {data.timeline.length === 0 ? (
          <div className="card p-8 text-center">
            <Sticker name="noEvents" size={100} className="mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">{t('leaderboard.noActivity')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.timeline.map((activity) => (
              <div key={activity.type} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {getActivityName(activity.type)}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {activity.count} actions
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xl text-[var(--primary)]">
                      {activity.points}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {t('leaderboard.pts')}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-[var(--bg-start)] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[var(--primary)] h-full transition-all duration-500"
                    style={{
                      width: `${(activity.points / data.totalPoints) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="px-4 mb-6">
        <div className="card p-6 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sticker name="trophy" size={50} />
              <div>
                <div className="font-bold text-[var(--text-primary)] mb-1">
                  Total Points Earned
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Last activity: {new Date(data.lastActivityAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-4xl font-bold text-[var(--primary)]">
              {data.totalPoints}
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn More */}
      <div className="px-4">
        <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">
          How to Earn More Points
        </h3>

        <div className="space-y-3">
          <div className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-xl">
              👍
            </div>
            <div className="flex-1">
              <div className="font-medium text-[var(--text-primary)]">React to posts</div>
              <div className="text-sm text-[var(--text-secondary)]">1 point per reaction</div>
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-xl">
              💬
            </div>
            <div className="flex-1">
              <div className="font-medium text-[var(--text-primary)]">Write comments</div>
              <div className="text-sm text-[var(--text-secondary)]">3 points per comment</div>
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-xl">
              ↩️
            </div>
            <div className="flex-1">
              <div className="font-medium text-[var(--text-primary)]">Reply to comments</div>
              <div className="text-sm text-[var(--text-secondary)]">2 points per reply</div>
            </div>
          </div>

          {!hasBoost && (
            <div className="card p-4 flex items-center gap-4 border-2 border-purple-500">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-xl">
                ⚡
              </div>
              <div className="flex-1">
                <div className="font-medium text-[var(--text-primary)]">Get a boost</div>
                <div className="text-sm text-[var(--text-secondary)]">Multiply your points!</div>
              </div>
              <button
                onClick={() => router.push(`/event/${eventId}`)}
                className="btn-primary text-sm px-4 py-2"
              >
                Boost
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back to Event */}
      <div className="px-4 mt-8">
        <button
          onClick={() => router.push(`/event/${eventId}`)}
          className="btn-secondary w-full"
        >
          {t('leaderboard.backToEvent')}
        </button>
      </div>
    </div>
  )
}
