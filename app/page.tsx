'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Banner from './components/Banner'
import FeatureCard from './components/FeatureCard'
import SupportBanner from './components/SupportBanner'
import Sticker from './components/Sticker'
import Loading from './components/Loading'
import { useTelegram, useHaptic } from './contexts/TelegramContext'
import { useTranslation } from './contexts/LanguageContext'
import { api, Event } from './lib/api'

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useTelegram()
  const haptic = useHaptic()
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  // Banner slides with translations
  const bannerSlides = [
    {
      sticker: 'banner' as const,
      title: t('banner.stayUpdated'),
      subtitle: t('banner.getNews'),
    },
    {
      sticker: 'giftFree' as const,
      title: t('banner.firstFree'),
      subtitle: t('banner.tryUnic'),
    },
  ]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { events: fetchedEvents } = await api.getEvents()
        setEvents(fetchedEvents)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    if (!isLoading) {
      fetchEvents()
    }
  }, [isLoading])

  const activeEvents = events.filter(e => e.status === 'active')

  const handleNavigate = (path: string) => {
    haptic.impact('light')
    router.push(path)
  }

  const formatTimeLeft = (endsAt?: string) => {
    if (!endsAt) return ''
    const end = new Date(endsAt)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return 'Ending...'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-4 fade-in">
      {/* Main Banner */}
      <Banner slides={bannerSlides} />

      {/* Support Banner */}
      <SupportBanner
        sticker="support"
        title={t('banner.gotQuestions')}
        subtitle={t('banner.reachOut') + ' — @unicsupport'}
        href="https://t.me/unicsupport"
      />

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3">
        <FeatureCard
          sticker="cardNewEvent"
          title={t('home.newEvent')}
          subtitle={t('home.launchNow')}
          onClick={() => handleNavigate('/events/new')}
        />
        <FeatureCard
          sticker="cardMyEvents"
          title={t('home.myEvents')}
          subtitle={t('home.viewAll')}
          onClick={() => handleNavigate('/events')}
        />
        <FeatureCard
          sticker="cardChannels"
          title={t('home.myChannels')}
          subtitle={t('home.manage')}
          onClick={() => handleNavigate('/channels')}
        />
        <FeatureCard
          sticker="cardPlans"
          title={t('home.plans')}
          subtitle={t('home.upgrade')}
          onClick={() => handleNavigate('/packages')}
        />
        <FeatureCard
          sticker="cardProfile"
          title={t('home.profile')}
          subtitle={t('home.yourStats')}
          onClick={() => handleNavigate('/profile')}
        />
      </div>

      {/* Active Events Section */}
      <div className="mt-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">{t('home.activeEvents')}</h3>

        {loadingEvents ? (
          <Loading text="" size={80} />
        ) : activeEvents.length === 0 ? (
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-3">
              <Sticker name="noEvents" size={80} />
            </div>
            <p className="text-[var(--text-secondary)] text-sm">{t('home.noActiveEvents')}</p>
            <button
              onClick={() => handleNavigate('/events/new')}
              className="btn-primary w-full mt-4"
            >
              {t('home.createFirst')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => handleNavigate(`/event/${event._id}`)}
                className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                      <Sticker name="success" size={40} />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        Event #{event._id.slice(-6)}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {event.participantsCount} {t('home.participants')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[var(--primary)]">
                      {formatTimeLeft(event.endsAt)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {event.winnersCount} {t('home.winners')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
