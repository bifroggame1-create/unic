'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api, Channel } from '../lib/api'
import { useTranslation } from '../contexts/LanguageContext'
import Sticker from '../components/Sticker'
import Loading from '../components/Loading'

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

export default function Channels() {
  const router = useRouter()
  const { t } = useTranslation()
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [username, setUsername] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      setLoading(true)
      const { channels } = await api.getChannels()
      setChannels(channels)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channels')
    } finally {
      setLoading(false)
    }
  }

  const handleAddChannel = async () => {
    if (!username.trim()) return

    try {
      setAdding(true)
      setAddError(null)
      const cleanUsername = username.trim().replace('@', '')
      await api.addChannel(cleanUsername)
      setShowAddModal(false)
      setUsername('')
      loadChannels()
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add channel')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteChannel = async (id: string) => {
    if (!confirm(t('channels.confirmDelete'))) return

    try {
      await api.deleteChannel(id)
      setChannels(channels.filter(c => c._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete channel')
    }
  }

  const formatSubscribers = (count?: number) => {
    if (!count) return '—'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  if (loading) {
    return (
      <div className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('channels.title')}</h1>
        </div>
        <Loading text={t('channels.loading')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sticker name="error" size={80} />
          </div>
          <h3 className="font-medium text-[var(--text-primary)] mb-2">{t('channels.errorLoading')}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">{error}</p>
          <button onClick={loadChannels} className="btn-primary">
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('channels.title')}</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-sm py-2 px-4"
        >
          {t('channels.addChannel')}
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex-shrink-0">
            <Sticker name="info" size={32} />
          </div>
          <div className="text-sm text-[var(--text-primary)]">
            <p className="font-medium mb-1">{t('channels.howToConnect')}</p>
            <ol className="list-decimal list-inside space-y-1 text-[var(--text-secondary)]">
              <li>{t('channels.step1')}</li>
              <li>{t('channels.step2')}</li>
              <li>{t('channels.step3')}</li>
            </ol>
          </div>
        </div>
      </div>

      {channels.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sticker name="noChannels" size={80} />
          </div>
          <h3 className="font-medium text-[var(--text-primary)] mb-2">{t('channels.noChannelsYet')}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {t('channels.connectFirstChannel')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            {t('channels.add')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {channel.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{channel.title}</h3>
                    <div className="flex items-center gap-2">
                      {channel.username && (
                        <span className="text-sm text-[var(--text-secondary)]">@{channel.username}</span>
                      )}
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatSubscribers(channel.subscribersCount)} {t('channels.subscribers')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {channel.isVerified ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] flex items-center gap-1">
                      <CheckIcon /> {t('channels.verified')}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {t('channels.pending')}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteChannel(channel._id)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Channel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">{t('channels.add')}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {t('channels.channelUsername')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@mychannel"
                className="w-full px-4 py-3 border border-[var(--card-border)] bg-[var(--bg-start)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              {addError && (
                <p className="text-sm text-[var(--error)] mt-2">{addError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setUsername('')
                  setAddError(null)
                }}
                className="flex-1 py-3 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAddChannel}
                disabled={adding || !username.trim()}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {adding ? t('common.adding') : t('common.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
