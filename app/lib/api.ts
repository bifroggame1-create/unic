const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  telegramId?: number
}

// Dev mode user ID
const DEV_USER_ID = 123456789

class ApiClient {
  private telegramId: number | null = null
  private useMock = false

  setTelegramId(id: number) {
    this.telegramId = id
  }

  // Helper to safely encode URL parameters
  private encodeQueryParam(value: string | number): string {
    return encodeURIComponent(String(value))
  }

  // Helper to build safe URLs with query params
  private buildUrl(path: string, params?: Record<string, string | number>): string {
    if (!params) return path

    const queryString = Object.entries(params)
      .map(([key, value]) => `${this.encodeQueryParam(key)}=${this.encodeQueryParam(value)}`)
      .join('&')

    return `${path}?${queryString}`
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body } = options

    // Use dev ID if no telegram ID set (dev mode)
    const userId = this.telegramId || DEV_USER_ID

    // Validate userId is a positive integer
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Telegram-Id': String(userId),
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  // Users
  async getMe() {
    return this.request<{ user: User }>('/api/users/me')
  }

  async getMyStats() {
    return this.request<UserStats>('/api/users/me/stats')
  }

  async getDashboard() {
    return this.request<DashboardStats>('/api/users/me/dashboard')
  }

  async createPlanInvoice(planId: string) {
    if (!planId || typeof planId !== 'string') throw new Error('Invalid plan ID')

    return this.request<{ invoiceLink: string; paymentId: string; amount: number; planId: string }>(
      '/api/users/plan-invoice',
      {
        method: 'POST',
        body: { planId },
      }
    )
  }

  async upgradePlan(planId: string, paymentId: string) {
    if (!planId || typeof planId !== 'string') throw new Error('Invalid plan ID')
    if (!paymentId || typeof paymentId !== 'string') throw new Error('Invalid payment ID')

    return this.request<{ success: boolean; plan: string; planExpiresAt: string; message: string }>(
      '/api/users/upgrade',
      {
        method: 'POST',
        body: { planId, paymentId },
      }
    )
  }

  // Channels
  async getChannels() {
    return this.request<{ channels: Channel[] }>('/api/channels')
  }

  async addChannel(username: string) {
    // Validate and sanitize username
    if (!username || typeof username !== 'string') throw new Error('Invalid username')

    // Remove any potentially malicious characters
    const sanitized = username.trim().replace(/[<>'"]/g, '').slice(0, 100)
    if (!sanitized) throw new Error('Invalid username format')

    return this.request<{ channel: Channel }>('/api/channels', {
      method: 'POST',
      body: { username: sanitized },
    })
  }

  async deleteChannel(id: string) {
    if (!id || typeof id !== 'string') throw new Error('Invalid channel ID')

    return this.request<{ success: boolean }>(`/api/channels/${this.encodeQueryParam(id)}`, {
      method: 'DELETE',
    })
  }

  // Events
  async getEvents() {
    return this.request<{ events: Event[] }>('/api/events')
  }

  async getEvent(id: string) {
    if (!id || typeof id !== 'string') throw new Error('Invalid event ID')
    return this.request<{ event: Event }>(`/api/events/${this.encodeQueryParam(id)}`)
  }

  async createEvent(data: CreateEventData) {
    // Validate required fields
    if (!data.channelId || !Number.isInteger(data.channelId)) throw new Error('Invalid channel ID')
    if (!['24h', '48h', '72h', '7d'].includes(data.duration)) throw new Error('Invalid duration')
    if (!['reactions', 'comments', 'all'].includes(data.activityType)) throw new Error('Invalid activity type')
    if (!Number.isInteger(data.winnersCount) || data.winnersCount < 1 || data.winnersCount > 100) {
      throw new Error('Invalid winners count')
    }

    // Sanitize optional title
    if (data.title) {
      data.title = data.title.trim().replace(/[<>]/g, '').slice(0, 200)
    }

    return this.request<{ event: Event }>('/api/events', {
      method: 'POST',
      body: data,
    })
  }

  async activateEvent(id: string) {
    if (!id || typeof id !== 'string') throw new Error('Invalid event ID')
    return this.request<{ event: Event }>(`/api/events/${this.encodeQueryParam(id)}/activate`, {
      method: 'POST',
    })
  }

  async completeEvent(id: string) {
    if (!id || typeof id !== 'string') throw new Error('Invalid event ID')
    return this.request<{ event: Event }>(`/api/events/${this.encodeQueryParam(id)}/complete`, {
      method: 'POST',
    })
  }

  async getLeaderboard(id: string, limit = 50, offset = 0) {
    // Validate inputs
    if (!id || typeof id !== 'string') throw new Error('Invalid event ID')
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('Invalid limit')
    if (!Number.isInteger(offset) || offset < 0) throw new Error('Invalid offset')

    const url = this.buildUrl(`/api/events/${this.encodeQueryParam(id)}/leaderboard`, { limit, offset })
    return this.request<LeaderboardResponse>(url)
  }

  async getMyPosition(eventId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')

    const userId = this.telegramId || DEV_USER_ID
    const url = this.buildUrl(`/api/events/${this.encodeQueryParam(eventId)}/position`, { userId })
    return this.request<{ position: UserPosition | null }>(url)
  }

  async getEventWithPosition(id: string) {
    if (!id || typeof id !== 'string') throw new Error('Invalid event ID')

    const userId = this.telegramId || DEV_USER_ID
    const url = this.buildUrl(`/api/events/${this.encodeQueryParam(id)}`, { userId })
    return this.request<EventWithPositionResponse>(url)
  }

  // Boost monetization (MVP: x1.5 until event ends, 100 Stars)
  async createBoostInvoice(eventId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')

    return this.request<{ invoiceLink: string; paymentId: string; amount: number; multiplier: number }>(
      `/api/events/${this.encodeQueryParam(eventId)}/boost/invoice`,
      { method: 'POST' }
    )
  }

  async applyBoost(eventId: string, paymentId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')
    if (!paymentId || typeof paymentId !== 'string') throw new Error('Invalid payment ID')

    return this.request<{ success: boolean; multiplier: number; message: string }>(
      `/api/events/${this.encodeQueryParam(eventId)}/boost/apply`,
      {
        method: 'POST',
        body: { paymentId },
      }
    )
  }

  // Second Chance monetization (75 Stars)
  async createSecondChanceInvoice(eventId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')

    return this.request<{ invoiceLink: string; paymentId: string; amount: number }>(
      `/api/events/${this.encodeQueryParam(eventId)}/second-chance/invoice`,
      { method: 'POST' }
    )
  }

  async applySecondChance(eventId: string, paymentId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')
    if (!paymentId || typeof paymentId !== 'string') throw new Error('Invalid payment ID')

    return this.request<{ success: boolean; message: string }>(
      `/api/events/${this.encodeQueryParam(eventId)}/second-chance/apply`,
      {
        method: 'POST',
        body: { paymentId },
      }
    )
  }

  async getActivityTimeline(eventId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')

    const userId = this.telegramId || DEV_USER_ID
    const url = this.buildUrl(`/api/events/${this.encodeQueryParam(eventId)}/timeline`, { userId })
    return this.request<TimelineResponse>(url)
  }

  async getGifts() {
    return this.request<{ gifts: GiftOption[] }>('/api/gifts')
  }

  async createEventPayment(eventId: string) {
    if (!eventId || typeof eventId !== 'string') throw new Error('Invalid event ID')

    return this.request<{ invoiceLink: string; paymentId: string; amount: number; packageName: string }>(
      `/api/events/${this.encodeQueryParam(eventId)}/payment`,
      { method: 'POST' }
    )
  }
}

// Types
export interface User {
  _id: string
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
  plan: 'free' | 'trial' | 'basic' | 'advanced' | 'premium'
  planExpiresAt?: string
  eventsCreated: number
  eventsThisMonth: number
  referralCode: string
  referralsCount: number
}

export interface UserStats {
  plan: string
  planExpiresAt?: string
  eventsThisMonth: number
  eventsCreated: number
  referralsCount: number
  referralCode: string
  limits: {
    events: number
    channels: number
    participants: number
  }
}

export interface DashboardStats {
  eventsCreated: number
  activeEvents: number
  totalParticipants: number
  engagementRate: number
  totalReactions: number
  totalComments: number
  plan: string
  referralsCount: number
}

export interface Channel {
  _id: string
  chatId: number
  username?: string
  title: string
  isVerified: boolean
  subscribersCount?: number
}

export interface Event {
  _id: string
  channelId: number
  ownerId: number
  status: 'draft' | 'pending_payment' | 'active' | 'completed' | 'cancelled'
  duration: '24h' | '48h' | '72h' | '7d'
  activityType: 'reactions' | 'comments' | 'all'
  winnersCount: number
  startsAt?: string
  endsAt?: string
  participantsCount: number
  totalReactions: number
  totalComments: number
  winners?: {
    telegramId: number
    username?: string
    points: number
    position: number
  }[]
}

export interface CreateEventData {
  channelId: number
  duration: '24h' | '48h' | '72h' | '7d'
  activityType: 'reactions' | 'comments' | 'all'
  winnersCount: number
  prizes?: Array<{
    giftId: string
    name: string
    position: number
    value?: number
  }>
  packageId?: string
  title?: string
  boostsEnabled?: boolean
}

export interface LeaderboardEntry {
  rank: number
  telegramId: number
  username?: string
  firstName?: string
  points: number
  reactionsCount: number
  commentsCount: number
}

export interface LeaderboardResponse {
  event: Event
  leaderboard: LeaderboardEntry[]
  totalParticipants: number
  pagination?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface UserPosition {
  rank: number
  points: number
  reactionsCount: number
  commentsCount: number
}

export interface EventWithPositionResponse {
  event: {
    id: string
    title?: string
    status: string
    duration: string
    activityType: string
    winnersCount: number
    startsAt?: string
    endsAt?: string
    participantsCount: number
    totalReactions: number
    totalComments: number
    prizes: {
      giftId: string
      name: string
      position: number
      value?: number
    }[]
    boostsEnabled: boolean
    timeRemaining?: {
      hours: number
      minutes: number
      totalMs: number
    }
  }
  topTen: LeaderboardEntry[]
  userPosition: {
    rank: number
    points: number
    totalParticipants: number
  } | null
}

export interface BoostResponse {
  success: boolean
  message: string
  boost: {
    type: 'x2_24h' | 'x1.5_forever'
    multiplier: number
    expiresAt?: string
  }
  userPosition: {
    rank: number
    points: number
    totalParticipants: number
  }
}

export interface TimelineResponse {
  timeline: {
    type: 'reactions' | 'comments' | 'replies'
    count: number
    points: number
  }[]
  totalPoints: number
  boostMultiplier: number
  boostExpiresAt?: string
  lastActivityAt: string
}

export interface GiftOption {
  id: string
  name: string
  starValue: number
  available: boolean
  description: string
}

export const api = new ApiClient()
