'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api, Event } from '../lib/api'
import { t } from '../lib/translations'
import Sticker from '../components/Sticker'
import { ErrorState } from '../components/ErrorState'

export default function Events() {
  const router = useRouter()
  // const { t, language } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const { events } = await api.getEvents()
      setEvents(events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const formatTimeLeft = (endsAt: string) => {
    const end = new Date(endsAt)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return t('leaderboard.ended')

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return t('events.today')
    if (days === 1) return t('events.yesterday')
    if (days < 7) return `${days} ${t('events.daysAgo')}`
    return d.toLocaleDateString('en-US')
  }

  if (loading) {
    return (
      <div className="fade-in pb-40">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('events.title')}</h1>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[var(--bg-start)] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[var(--bg-start)] rounded w-24 mb-2"></div>
                  <div className="h-3 bg-[var(--bg-start)] rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState
      title={t('events.errorLoading')}
      message={error}
      onRetry={loadEvents}
    />
  }

  return (
    <div className="fade-in px-3 pb-40">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">{t('events.title')}</h1>
        <button
          onClick={() => router.push('/events/new')}
          className="btn-primary text-xs py-2 px-4 min-h-0"
        >
          {t('events.newEvent')}
        </button>
      </div>

      {events.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sticker name="noEvents" size={80} />
          </div>
          <h3 className="font-medium text-[var(--text-primary)] mb-2">{t('events.noEvents')}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {t('events.createToEngage')}
          </p>
          <button
            onClick={() => router.push('/events/new')}
            className="btn-primary"
          >
            {t('events.create')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => router.push(`/event/${event._id}`)}
              className="card p-3.5 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Sticker name="banner" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">
                      {t('events.channel')} #{event.channelId}
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)]">{event.winnersCount} {t('events.winners')}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${
                    event.status === 'active'
                      ? 'bg-[var(--success)]/10 text-[var(--success)]'
                      : event.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : event.status === 'pending_payment'
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-[var(--bg-start)] text-[var(--text-muted)]'
                  }`}
                >
                  {event.status === 'active' && t('events.active')}
                  {event.status === 'draft' && t('events.draft')}
                  {event.status === 'pending_payment' && t('events.pending')}
                  {event.status === 'completed' && t('events.completed')}
                  {event.status === 'cancelled' && t('events.cancelled')}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <span className="text-[var(--text-secondary)]">{t('events.participants')}: </span>
                    <span className="font-semibold text-[var(--text-primary)]">{event.participantsCount}</span>
                  </div>
                  {event.activityType !== 'all' && (
                    <div className="text-[var(--text-muted)] text-[10px]">
                      {event.activityType === 'reactions' ? t('events.reactionsOnly') : t('events.commentsOnly')}
                    </div>
                  )}
                </div>
                {event.status === 'active' && event.endsAt ? (
                  <div className="text-[var(--primary)] font-semibold text-xs whitespace-nowrap">
                    {formatTimeLeft(event.endsAt)}
                  </div>
                ) : event.endsAt ? (
                  <div className="text-[var(--text-muted)] text-[10px] whitespace-nowrap">{formatDate(event.endsAt)}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
