'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, LeaderboardResponse } from '../../../lib/api'
import { useTelegram } from '../../../contexts/TelegramContext'
import { useTranslation } from '../../../contexts/LanguageContext'
import Sticker from '../../../components/Sticker'

export default function FullLeaderboard() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const { webApp } = useTelegram()
  const { t } = useTranslation()

  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const limit = 50

  const fetchLeaderboard = useCallback(async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset

      if (reset) {
        setLoading(true)
        setOffset(0)
      } else {
        setLoadingMore(true)
      }

      const response = await api.getLeaderboard(eventId, limit, currentOffset)

      if (reset) {
        setData(response)
      } else if (data) {
        setData({
          ...response,
          leaderboard: [...data.leaderboard, ...response.leaderboard],
        })
      }

      setHasMore(response.pagination?.hasMore || false)
      setOffset(currentOffset + response.leaderboard.length)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [eventId, offset, data])

  // Initial load
  useEffect(() => {
    fetchLeaderboard(true)
  }, [eventId])

  // Infinite scroll observer
  useEffect(() => {
    if (loadMoreRef.current && hasMore && !loading && !loadingMore) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchLeaderboard(false)
          }
        },
        { threshold: 0.1 }
      )

      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, loadingMore, fetchLeaderboard])

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

  const { event, leaderboard, totalParticipants } = data
  const isActive = event.status === 'active'

  return (
    <div className="fade-in pb-8 -mx-4">
      {/* Header */}
      <div className={`bg-gradient-to-b ${isActive ? 'from-[var(--primary)] to-[var(--primary-dark)]' : 'from-gray-600 to-gray-500'} text-white px-4 pt-4 pb-6 rounded-b-3xl sticky top-0 z-10`}>
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
          <h1 className="text-2xl font-bold mb-1">
            {t('leaderboard.fullLeaderboard')}
          </h1>
          <p className="text-white/80 text-sm">
            {totalParticipants} {t('leaderboard.participants')}
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 mt-6">
        {leaderboard.length === 0 ? (
          <div className="card p-8 text-center">
            <Sticker name="noEvents" size={100} className="mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">{t('leaderboard.noParticipants')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((user) => {
              const isTop3 = user.rank <= 3
              const isWinner = user.rank <= (event.winnersCount || 0)

              return (
                <div
                  key={user.telegramId}
                  className={`card p-4 flex items-center justify-between ${
                    isTop3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200'
                      : isWinner
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-200'
                        : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
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

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                        {user.firstName || user.username || t('leaderboard.anonymous')}
                      </p>
                      {user.username && (
                        <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
                      )}
                      <div className="flex gap-3 text-xs text-[var(--text-secondary)] mt-1">
                        <span>👍 {user.reactionsCount}</span>
                        <span>💬 {user.commentsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-[var(--text-primary)]">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {t('leaderboard.pts')}
                      </div>
                    </div>
                    {isTop3 && <Sticker name="medal" size={24} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load more trigger */}
        {hasMore && leaderboard.length > 0 && (
          <div ref={loadMoreRef} className="py-8 text-center">
            {loadingMore && <Sticker name="loading" size={60} className="mx-auto" />}
          </div>
        )}

        {/* End of list */}
        {!hasMore && leaderboard.length > 0 && (
          <div className="py-8 text-center text-sm text-[var(--text-muted)]">
            {t('leaderboard.endOfList')}
          </div>
        )}
      </div>

      {/* Scoring rules */}
      {isActive && (
        <div className="px-4 mt-6">
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
