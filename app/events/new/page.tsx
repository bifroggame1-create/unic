'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api, Channel } from '../../lib/api'
import { useHaptic } from '../../contexts/TelegramContext'
import { t } from '../../lib/translations'
import Sticker from '../../components/Sticker'

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const winnerCounts = [3, 5, 10, 20]

export default function NewEvent() {
  const router = useRouter()
  const haptic = useHaptic()
  const [step, setStep] = useState(1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [newChannelUsername, setNewChannelUsername] = useState('')
  const [duration, setDuration] = useState<'24h' | '48h' | '72h' | '7d'>('48h')
  const [activityType, setActivityType] = useState<'reactions' | 'comments' | 'all'>('all')
  const [winners, setWinners] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addingChannel, setAddingChannel] = useState(false)

  const durations = [
    { value: '24h', label: t('newEvent.24h') },
    { value: '48h', label: t('newEvent.48h') },
    { value: '72h', label: t('newEvent.72h') },
    { value: '7d', label: t('newEvent.7d') },
  ]

  const activityTypes = [
    { value: 'reactions', label: t('newEvent.reactions'), icon: '❤️' },
    { value: 'comments', label: t('newEvent.comments'), icon: '💬' },
    { value: 'all', label: t('newEvent.allActivity'), icon: '⚡' },
  ]

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      const { channels: fetchedChannels } = await api.getChannels()
      setChannels(fetchedChannels)
      if (fetchedChannels.length > 0 && !selectedChannel) {
        setSelectedChannel(fetchedChannels[0])
      }
    } catch (err) {
      console.error('Failed to fetch channels:', err)
    }
  }

  const handleAddChannel = async () => {
    if (!newChannelUsername.trim()) return

    setAddingChannel(true)
    setError('')

    try {
      const { channel } = await api.addChannel(newChannelUsername.trim())
      setChannels([...channels, channel])
      setSelectedChannel(channel)
      setNewChannelUsername('')
      haptic.notification('success')
    } catch (err: any) {
      setError(err.message || 'Failed to add channel')
      haptic.notification('error')
    } finally {
      setAddingChannel(false)
    }
  }

  const handleCreate = async () => {
    if (!selectedChannel) return

    setLoading(true)
    setError('')

    try {
      const { event } = await api.createEvent({
        channelId: selectedChannel.chatId,
        duration,
        activityType,
        winnersCount: winners,
      })

      haptic.notification('success')

      // Activate event (in real app, this would be after payment)
      await api.activateEvent(event._id)

      router.push(`/event/${event._id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create event')
      haptic.notification('error')
    } finally {
      setLoading(false)
    }
  }

  const handleStepChange = (newStep: number) => {
    haptic.impact('light')
    setStep(newStep)
  }

  return (
    <div className="fade-in">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-colors ${
              s <= step ? 'bg-[var(--primary)]' : 'bg-[var(--bg-start)]'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t('newEvent.selectChannel')}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t('newEvent.selectChannelDesc')}</p>
          </div>

          {/* Add New Channel */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--bg-start)] rounded-full flex items-center justify-center overflow-hidden">
                <Sticker name="banner" size={40} />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="@channel_username"
                  value={newChannelUsername}
                  onChange={(e) => setNewChannelUsername(e.target.value)}
                  className="input"
                />
              </div>
              <button
                onClick={handleAddChannel}
                disabled={!newChannelUsername.trim() || addingChannel}
                className="btn-primary py-2 px-4 disabled:opacity-50"
              >
                {addingChannel ? '...' : t('common.add')}
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {t('newEvent.ensureAdmin')}
            </p>
          </div>

          {/* Connected Channels */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">{t('newEvent.connectedChannels')}</h3>
            {channels.length === 0 ? (
              <div className="card p-4 text-center text-[var(--text-muted)] text-sm">
                {t('newEvent.noChannelsConnected')}
              </div>
            ) : (
              <div className="space-y-2">
                {channels.map((channel) => (
                  <div
                    key={channel._id}
                    onClick={() => {
                      setSelectedChannel(channel)
                      haptic.selection()
                    }}
                    className={`card p-4 cursor-pointer transition-all ${
                      selectedChannel?._id === channel._id
                        ? 'border-[var(--primary)] border-2'
                        : 'hover:border-[var(--card-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                        <Sticker name="banner" size={36} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--text-primary)]">{channel.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          @{channel.username} • {channel.subscribersCount?.toLocaleString() || 0} {t('channels.subscribers')}
                        </p>
                      </div>
                      {selectedChannel?._id === channel._id && (
                        <CheckIcon />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleStepChange(2)}
            disabled={!selectedChannel}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.continue')}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t('newEvent.eventSettings')}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t('newEvent.configureEvent')}</p>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">{t('newEvent.duration')}</label>
            <div className="grid grid-cols-4 gap-2">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setDuration(d.value as any)
                    haptic.selection()
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                    duration === d.value
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--primary)]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">{t('newEvent.activityType')}</label>
            <div className="grid grid-cols-3 gap-2">
              {activityTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setActivityType(type.value as any)
                    haptic.selection()
                  }}
                  className={`p-4 rounded-xl text-center transition-colors ${
                    activityType === type.value
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--primary)]'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Winners Count */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">{t('newEvent.winners')}</label>
            <div className="grid grid-cols-4 gap-2">
              {winnerCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setWinners(count)
                    haptic.selection()
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                    winners === count
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--primary)]'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleStepChange(1)} className="btn-secondary flex-1">
              {t('newEvent.back')}
            </button>
            <button onClick={() => handleStepChange(3)} className="btn-primary flex-1">
              {t('common.continue')}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t('newEvent.confirmLaunch')}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t('newEvent.reviewSettings')}</p>
          </div>

          {/* Event Summary */}
          <div className="card p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-3">{t('newEvent.eventSummary')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('newEvent.channel')}</span>
                <span className="text-[var(--text-primary)]">{selectedChannel?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('newEvent.duration')}</span>
                <span className="text-[var(--text-primary)]">
                  {durations.find((d) => d.value === duration)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('newEvent.activity')}</span>
                <span className="text-[var(--text-primary)]">
                  {activityTypes.find((a) => a.value === activityType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('newEvent.winners')}</span>
                <span className="text-[var(--text-primary)]">{winners}</span>
              </div>
            </div>
          </div>

          {/* Points Info */}
          <div className="card p-4 bg-[var(--primary)]/10 border-[var(--primary)]/20">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">{t('newEvent.pointsSystem')}</h4>
            <div className="text-sm text-[var(--text-secondary)] space-y-1">
              <p>{t('newEvent.reactionPts')}</p>
              <p>{t('newEvent.commentPts')}</p>
              <p>{t('newEvent.replyPts')}</p>
            </div>
          </div>

          {/* Price */}
          <div className="card p-4 bg-[var(--bg-start)]">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">{t('newEvent.total')}</span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{t('packages.free')}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">{t('newEvent.firstFree')}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleStepChange(2)} className="btn-secondary flex-1">
              {t('newEvent.back')}
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? t('newEvent.launching') : t('newEvent.launch')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
