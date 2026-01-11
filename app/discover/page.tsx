'use client'

import { useState, useEffect } from 'react'
import { api, PublicEvent } from '../lib/api'
import { getUserFriendlyError } from '../lib/constants'
import Link from 'next/link'
import Sticker from '../components/Sticker'

export default function DiscoverPage() {
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await api.getPublicEvents()
      setEvents(data.events)
    } catch (err: any) {
      setError(getUserFriendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const formatTimeRemaining = (timeRemaining: { hours: number; minutes: number } | undefined) => {
    if (!timeRemaining) return 'Завершено'
    const hours = timeRemaining.hours
    const minutes = timeRemaining.minutes
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}д ${hours % 24}ч`
    }
    return `${hours}ч ${minutes}м`
  }

  const getDurationLabel = (duration: string) => {
    const labels: Record<string, string> = {
      '24h': '24 часа',
      '48h': '48 часов',
      '72h': '72 часа',
      '7d': '7 дней',
    }
    return labels[duration] || duration
  }

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      reactions: 'Реакции',
      comments: 'Комментарии',
      all: 'Все действия',
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pb-40">
        <Sticker name="loading" size={100} />
        <p className="text-[var(--text-secondary)]">Загружаем события...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pb-40">
        <Sticker name="error" size={100} />
        <p className="text-[var(--text-secondary)]">{error}</p>
        <button onClick={loadEvents} className="btn-primary">
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-40">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          🔥 Активные конкурсы
        </h1>
        <button onClick={loadEvents} className="text-sm text-[var(--accent)]">
          Обновить
        </button>
      </div>

      <p className="text-sm text-[var(--text-secondary)]">
        Участвуйте в конкурсах, зарабатывайте баллы и выигрывайте подарки!
      </p>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Sticker name="noEvents" size={120} />
          <p className="text-[var(--text-secondary)] text-center">
            Пока нет активных конкурсов
            <br />
            Проверьте позже
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Link
              key={event._id}
              href={`/event/${event._id}`}
              className="card p-4 hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                    {event.title || 'Конкурс активности'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {getDurationLabel(event.duration)} • {getActivityTypeLabel(event.activityType)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)]">Осталось</div>
                  <div className="text-sm font-semibold text-[var(--accent)]">
                    {formatTimeRemaining(event.timeRemaining)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="text-lg font-bold text-[var(--text-primary)]">
                    {event.winnersCount}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Победителей</div>
                </div>
                <div className="text-center p-2 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="text-lg font-bold text-[var(--text-primary)]">
                    {event.participantsCount}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Участников</div>
                </div>
                <div className="text-center p-2 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="text-lg font-bold text-[var(--text-primary)]">
                    {event.totalReactions + event.totalComments}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Действий</div>
                </div>
              </div>

              {event.prizes && event.prizes.length > 0 && (
                <div className="border-t border-[var(--border)] pt-3">
                  <div className="text-xs text-[var(--text-secondary)] mb-2">Призы:</div>
                  <div className="flex gap-2 flex-wrap">
                    {event.prizes.slice(0, 3).map((prize, idx) => (
                      <div
                        key={idx}
                        className="text-xs px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full"
                      >
                        🎁 {prize.name}
                      </div>
                    ))}
                    {event.prizes.length > 3 && (
                      <div className="text-xs px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full">
                        +{event.prizes.length - 3} ещё
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {event.boostsEnabled && (
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded">
                      ⚡ Бусты доступны
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-[var(--accent)]">
                  Участвовать →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
