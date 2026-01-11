'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, TimelineResponse } from '../../../lib/api'
import { getUserFriendlyError } from '../../../lib/constants'
import { useTelegram } from '../../../contexts/TelegramContext'
import Sticker from '../../../components/Sticker'

export default function MyProgress() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const { webApp } = useTelegram()

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
      <div className="flex items-center justify-center min-h-[60vh] pb-40">
        <Sticker name="loading" size={120} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] pb-40">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <p className="text-[var(--text-secondary)] text-lg">No activity yet</p>
        </div>
      </div>
    )
  }

  const hasBoost = data.boostMultiplier > 1
  const boostExpired = data.boostExpiresAt && new Date(data.boostExpiresAt) < new Date()

  return (
    <div className="fade-in pb-40 -mx-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white px-6 pt-6 pb-10 shadow-2xl sticky top-0 z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <button
          onClick={() => router.back()}
          className="relative mb-4 flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="relative text-center space-y-3">
          <div className="text-7xl animate-bounce-slow">📊</div>
          <h1 className="text-3xl font-black tracking-tight">
            My Progress
          </h1>
          <p className="text-white/90 text-base font-semibold">
            Track your event activity
          </p>
        </div>
      </div>

      {/* Position Summary Card */}
      {position && (
        <div className="px-6 mt-6 mb-8">
          <div className="card p-8 shadow-2xl border-2 border-[var(--primary)]/20">
            <div className="text-center mb-6">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-3">
                #{position.rank}
              </div>
              <div className="text-base font-bold text-[var(--text-secondary)] uppercase tracking-wide">
                Your Position
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--bg-start)] to-[var(--bg-end)] shadow-lg border-2 border-[var(--border-color)]">
                <div className="text-3xl font-black text-[var(--text-primary)] mb-1">
                  {data.totalPoints}
                </div>
                <div className="text-sm font-bold text-[var(--text-secondary)]">
                  pts
                </div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-lg border-2 border-purple-300 dark:border-purple-700">
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                  {hasBoost ? `${data.boostMultiplier}x` : '1x'}
                </div>
                <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  Multiplier
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Boost Status Banner */}
      {hasBoost && !boostExpired && (
        <div className="px-6 mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-500 rounded-3xl p-6 shadow-2xl shadow-purple-500/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative flex items-center gap-5">
              <div className="text-5xl animate-bounce-slow">⚡</div>
              <div className="flex-1">
                <div className="text-xl font-black text-white mb-2">
                  {data.boostMultiplier}x Boost Active
                </div>
                <div className="text-sm font-semibold text-white/80">
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
      <div className="px-6 mb-8">
        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-5 tracking-tight">
          Activity Breakdown
        </h3>

        {data.timeline.length === 0 ? (
          <div className="card p-12 text-center space-y-4 shadow-lg">
            <Sticker name="noEvents" size={120} className="mx-auto" />
            <p className="text-base text-[var(--text-muted)] font-medium">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.timeline.map((activity) => (
              <div
                key={activity.type}
                className="card p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)]/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--bg-start)] to-[var(--bg-end)] flex items-center justify-center text-3xl shadow-md border-2 border-[var(--border-color)]">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--text-primary)]">
                        {getActivityName(activity.type)}
                      </div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">
                        {activity.count} actions
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-[var(--primary)]">
                      {activity.points}
                    </div>
                    <div className="text-sm font-bold text-[var(--text-muted)]">
                      pts
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-[var(--bg-start)] rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] h-full transition-all duration-500 rounded-full"
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
      <div className="px-6 mb-8">
        <div className="card p-8 bg-gradient-to-r from-[var(--primary)]/10 via-purple-500/10 to-pink-500/10 shadow-2xl border-2 border-[var(--primary)]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Sticker name="trophy" size={60} />
              <div>
                <div className="text-xl font-black text-[var(--text-primary)] mb-2">
                  Total Points Earned
                </div>
                <div className="text-sm font-semibold text-[var(--text-secondary)]">
                  Last activity: {new Date(data.lastActivityAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {data.totalPoints}
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn More */}
      <div className="px-6 mb-8">
        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-5 tracking-tight">
          How to Earn More Points
        </h3>

        <div className="space-y-4">
          <div className="card p-5 flex items-center gap-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center text-3xl shadow-md">
              👍
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-[var(--text-primary)]">React to posts</div>
              <div className="text-sm font-semibold text-[var(--text-secondary)]">1 point per reaction</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center text-3xl shadow-md">
              💬
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-[var(--text-primary)]">Write comments</div>
              <div className="text-sm font-semibold text-[var(--text-secondary)]">3 points per comment</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-2xl flex items-center justify-center text-3xl shadow-md">
              ↩️
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-[var(--text-primary)]">Reply to comments</div>
              <div className="text-sm font-semibold text-[var(--text-secondary)]">2 points per reply</div>
            </div>
          </div>

          {!hasBoost && (
            <div className="card p-5 flex items-center gap-5 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 border-2 border-purple-500">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                ⚡
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[var(--text-primary)]">Get a boost</div>
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">Multiply your points!</div>
              </div>
              <button
                onClick={() => router.push(`/event/${eventId}`)}
                className="btn-primary text-sm px-6 py-3 min-h-0 font-bold"
              >
                Boost
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back to Event Button */}
      <div className="px-6">
        <button
          onClick={() => router.push(`/event/${eventId}`)}
          className="btn-secondary w-full text-lg font-bold py-4"
        >
          Back to Event
        </button>
      </div>
    </div>
  )
}
