const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const IS_DEV = process.env.NODE_ENV === 'development'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  telegramId?: number
}

// Dev mode user ID
const DEV_USER_ID = 123456789

// Mock data for dev mode when backend is not running
const MOCK_DATA: Record<string, any> = {
  '/api/users/me': {
    user: {
      _id: 'dev_user',
      telegramId: DEV_USER_ID,
      username: 'devuser',
      firstName: 'Dev',
      lastName: 'User',
      plan: 'free',
      eventsCreated: 2,
      eventsThisMonth: 1,
      referralCode: 'DEV123',
      referralsCount: 5,
    },
  },
  '/api/users/me/stats': {
    plan: 'free',
    eventsThisMonth: 1,
    eventsCreated: 2,
    referralsCount: 5,
    referralCode: 'DEV123',
    limits: { events: 1, channels: 1, participants: 100 },
  },
  '/api/channels': { channels: [] },
  '/api/events': { events: [] },
}

class ApiClient {
  private telegramId: number | null = null
  private useMock = false

  setTelegramId(id: number) {
    this.telegramId = id
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body } = options

    // Use dev ID if no telegram ID set (dev mode)
    const userId = this.telegramId || DEV_USER_ID

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Telegram-Id': String(userId),
    }

    try {
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
    } catch (error) {
      // In dev mode, return mock data if backend is unavailable
      if (IS_DEV && method === 'GET') {
        const mockKey = endpoint.split('?')[0] // Remove query params
        if (MOCK_DATA[mockKey]) {
          console.log(`[DEV] Using mock data for ${endpoint}`)
          return MOCK_DATA[mockKey] as T
        }
      }
      throw error
    }
  }

  // Users
  async getMe() {
    return this.request<{ user: User }>('/api/users/me')
  }

  async getMyStats() {
    return this.request<UserStats>('/api/users/me/stats')
  }

  // Channels
  async getChannels() {
    return this.request<{ channels: Channel[] }>('/api/channels')
  }

  async addChannel(username: string) {
    return this.request<{ channel: Channel }>('/api/channels', {
      method: 'POST',
      body: { username },
    })
  }

  async deleteChannel(id: string) {
    return this.request<{ success: boolean }>(`/api/channels/${id}`, {
      method: 'DELETE',
    })
  }

  // Events
  async getEvents() {
    return this.request<{ events: Event[] }>('/api/events')
  }

  async getEvent(id: string) {
    return this.request<{ event: Event }>(`/api/events/${id}`)
  }

  async createEvent(data: CreateEventData) {
    return this.request<{ event: Event }>('/api/events', {
      method: 'POST',
      body: data,
    })
  }

  async activateEvent(id: string) {
    return this.request<{ event: Event }>(`/api/events/${id}/activate`, {
      method: 'POST',
    })
  }

  async completeEvent(id: string) {
    return this.request<{ event: Event }>(`/api/events/${id}/complete`, {
      method: 'POST',
    })
  }

  async getLeaderboard(id: string, limit = 50, offset = 0) {
    return this.request<LeaderboardResponse>(
      `/api/events/${id}/leaderboard?limit=${limit}&offset=${offset}`
    )
  }

  async getMyPosition(eventId: string) {
    const userId = this.telegramId || DEV_USER_ID
    return this.request<{ position: UserPosition | null }>(`/api/events/${eventId}/position?userId=${userId}`)
  }

  async getEventWithPosition(id: string) {
    const userId = this.telegramId || DEV_USER_ID
    return this.request<EventWithPositionResponse>(`/api/events/${id}?userId=${userId}`)
  }

  async purchaseBoost(eventId: string, boostType: 'x2_24h' | 'x1.5_forever', starsPaid: number) {
    const userId = this.telegramId || DEV_USER_ID
    return this.request<BoostResponse>(`/api/events/${eventId}/boost`, {
      method: 'POST',
      body: { userId, boostType, starsPaid },
    })
  }

  async getActivityTimeline(eventId: string) {
    const userId = this.telegramId || DEV_USER_ID
    return this.request<TimelineResponse>(`/api/events/${eventId}/timeline?userId=${userId}`)
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

export const api = new ApiClient()
