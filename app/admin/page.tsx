'use client'

import { useEffect, useState } from 'react'
import { api, User } from '../lib/api'
import { useTelegram, useHaptic } from '../contexts/TelegramContext'
import { getUserFriendlyError } from '../lib/constants'
import Container from '../components/layout/Container'
import Sticker from '../components/Sticker'
import ErrorModal from '../components/ErrorModal'
import Loading from '../components/Loading'

export default function AdminPanel() {
  const { user: telegramUser } = useTelegram()
  const haptic = useHaptic()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Event completion
  const [eventId, setEventId] = useState('')
  const [completing, setCompleting] = useState(false)
  const [completeSuccess, setCompleteSuccess] = useState(false)

  // Grant subscription
  const [username, setUsername] = useState('')
  const [planId, setPlanId] = useState('trial')
  const [granting, setGranting] = useState(false)
  const [grantSuccess, setGrantSuccess] = useState(false)

  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorDetails, setErrorDetails] = useState('')

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      const { user: userData } = await api.getMe()
      setUser(userData)

      // Check if user is admin
      if (!userData.isAdmin) {
        setError('Access denied: Admin only')
      }
    } catch (err) {
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteEvent = async () => {
    if (!eventId.trim()) {
      setErrorMessage('Please enter event ID')
      setShowError(true)
      return
    }

    setCompleting(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/events/${eventId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Id': String(telegramUser?.id || ''),
        },
      })

      haptic.notification('success')
      setCompleteSuccess(true)
      setEventId('')
      setTimeout(() => setCompleteSuccess(false), 3000)
    } catch (err: any) {
      setErrorMessage(getUserFriendlyError(err))
      setErrorDetails(JSON.stringify(err, null, 2))
      setShowError(true)
      haptic.notification('error')
    } finally {
      setCompleting(false)
    }
  }

  const handleGrantSubscription = async () => {
    if (!username.trim()) {
      setErrorMessage('Please enter username')
      setShowError(true)
      return
    }

    setGranting(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users/grant-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Id': String(telegramUser?.id || ''),
        },
        body: JSON.stringify({
          username: username.replace('@', ''),
          planId,
        }),
      })

      haptic.notification('success')
      setGrantSuccess(true)
      setUsername('')
      setTimeout(() => setGrantSuccess(false), 3000)
    } catch (err: any) {
      setErrorMessage(getUserFriendlyError(err))
      setErrorDetails(JSON.stringify(err, null, 2))
      setShowError(true)
      haptic.notification('error')
    } finally {
      setGranting(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <Loading text="Loading admin panel..." />
      </Container>
    )
  }

  if (error || !user?.isAdmin) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <Sticker name="error" size={100} />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--text-secondary)]">
            This page is only accessible to administrators
          </p>
        </div>
      </Container>
    )
  }

  return (
    <div className="px-4 pt-6 pb-nav-safe max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 fade-in">
        <div className="w-16 h-16">
          <Sticker name="crown" size={64} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage events and subscriptions</p>
        </div>
      </div>

      {/* Complete Event */}
      <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-4">
          <Sticker name="success" size={40} />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Complete Event</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Manually complete an event and send gifts to winners
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="input w-full"
          />
          <button
            onClick={handleCompleteEvent}
            disabled={completing || !eventId.trim()}
            className="btn-primary w-full disabled:opacity-50 active-scale"
          >
            {completing ? 'Completing...' : completeSuccess ? '✓ Completed!' : 'Complete Event'}
          </button>
        </div>
      </div>

      {/* Grant Subscription */}
      <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-4">
          <Sticker name="gifts/5" size={40} />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Grant Subscription</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Give a user premium access by their username
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
          />
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="input w-full"
          >
            <option value="trial">Trial (3 events)</option>
            <option value="basic">Basic (10 events)</option>
            <option value="advanced">Advanced (Unlimited)</option>
            <option value="premium">Premium (Unlimited)</option>
          </select>
          <button
            onClick={handleGrantSubscription}
            disabled={granting || !username.trim()}
            className="btn-primary w-full disabled:opacity-50 active-scale"
          >
            {granting ? 'Granting...' : grantSuccess ? '✓ Granted!' : 'Grant Subscription'}
          </button>
        </div>
      </div>

      {/* Admin Info */}
      <div className="card p-4 bg-[var(--primary)]/10 border-[var(--primary)]/20 fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3">
          <Sticker name="info" size={32} />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Admin User</p>
            <p className="text-xs text-[var(--text-secondary)]">
              @{telegramUser?.username || telegramUser?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="Error"
        message={errorMessage}
        details={errorDetails}
        showRetry={false}
      />
    </div>
  )
}
