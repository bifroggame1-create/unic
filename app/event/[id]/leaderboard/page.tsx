'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, LeaderboardResponse } from '../../../lib/api'
import { useTelegram } from '../../../contexts/TelegramContext'
import Sticker from '../../../components/Sticker'

export default function FullLeaderboard() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const { webApp } = useTelegram()

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

  useEffect(() => {
    fetchLeaderboard(true)
  }, [eventId])

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

  const { event, leaderboard, totalParticipants } = data
  const isActive = event.status === 'active'

  return (
    <div className="fade-in pb-12 -mx-4">
      {/* Header */}
      <div className={`relative overflow-hidden ${isActive ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-600 to-gray-800'} text-white px-6 pt-6 pb-10 shadow-2xl sticky top-0 z-10`}>
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
          <div className="text-5xl animate-bounce-slow">🏆</div>
          <h1 className="text-3xl font-black tracking-tight">
            Full Leaderboard
          </h1>
          <p className="text-white/90 text-base font-semibold">
            {totalParticipants} Participants
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-6 mt-6">
        {leaderboard.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <Sticker name="noEvents" size={120} className="mx-auto" />
            <p className="text-base text-[var(--text-muted)] font-medium">No participants yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user) => {
              const isTop3 = user.rank <= 3
              const isWinner = user.rank <= (event.winnersCount || 0)

              return (
                <div
                  key={user.telegramId}
                  className={`card p-5 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] shadow-lg ${
                    isTop3
                      ? 'bg-gradient-to-r from-yellow-50/80 via-orange-50/80 to-red-50/80 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-yellow-300'
                      : isWinner
                        ? 'bg-green-50/80 dark:bg-green-900/10 border-2 border-green-300'
                        : 'border-2 border-transparent hover:border-[var(--primary)]/30'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-md flex-shrink-0 ${
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

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-base text-[var(--text-primary)] truncate">
                        {user.firstName || user.username || 'Anonymous'}
                      </p>
                      {user.username && (
                        <p className="text-sm text-[var(--text-muted)] truncate font-medium">@{user.username}</p>
                      )}
                      <div className="flex gap-3 text-sm text-[var(--text-secondary)] mt-1 font-semibold">
                        <span>👍 {user.reactionsCount}</span>
                        <span>💬 {user.commentsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-black text-lg text-[var(--text-primary)]">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] font-bold">
                        pts
                      </div>
                    </div>
                    {isTop3 && <Sticker name="medal" size={28} />}
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
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--text-muted)] font-semibold">
              You've reached the end 🎉
            </p>
          </div>
        )}
      </div>

      {/* Scoring rules */}
      {isActive && (
        <div className="px-6 mt-6">
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
