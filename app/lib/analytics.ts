// Conversion Analytics для B2C монетизации
// Трекинг событий для воронки Boost + Second Chance

export type AnalyticsEvent =
  | 'event_viewed'
  | 'action_performed'
  | 'boost_shown'
  | 'boost_clicked'
  | 'boost_purchased'
  | 'event_finished'
  | 'second_chance_shown'
  | 'second_chance_clicked'
  | 'second_chance_purchased'

export interface AnalyticsEventData {
  eventId: string
  userId: number
  timestamp: number
  metadata?: Record<string, any>
}

class Analytics {
  private events: Array<AnalyticsEventData & { event: AnalyticsEvent }> = []

  // Логирование события
  logEvent(event: AnalyticsEvent, data: AnalyticsEventData) {
    const entry = {
      event,
      ...data,
      timestamp: data.timestamp || Date.now(),
    }

    this.events.push(entry)

    // В продакшене отправляем на бэкенд
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.sendToBackend(entry)
    }

    // В девелопменте логируем в консоль
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, data)
    }
  }

  // Отправка на бэкенд
  private async sendToBackend(data: any) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  // Получить все события для анализа
  getEvents() {
    return this.events
  }

  // Очистить события (для тестирования)
  clear() {
    this.events = []
  }

  // Базовые метрики
  getMetrics(eventId: string) {
    const eventEvents = this.events.filter((e) => e.eventId === eventId)

    const participants = new Set(
      eventEvents.filter((e) => e.event === 'action_performed').map((e) => e.userId)
    ).size

    const boostShown = eventEvents.filter((e) => e.event === 'boost_shown').length
    const boostPurchased = eventEvents.filter((e) => e.event === 'boost_purchased').length

    const secondChanceShown = eventEvents.filter((e) => e.event === 'second_chance_shown')
      .length
    const secondChancePurchased = eventEvents.filter(
      (e) => e.event === 'second_chance_purchased'
    ).length

    return {
      participants,
      boostShown,
      boostPurchased,
      boostConversion: boostShown > 0 ? (boostPurchased / boostShown) * 100 : 0,
      secondChanceShown,
      secondChancePurchased,
      secondChanceConversion:
        secondChanceShown > 0 ? (secondChancePurchased / secondChanceShown) * 100 : 0,
      totalRevenue: boostPurchased * 100 + secondChancePurchased * 75, // в Stars
      payingUsers: new Set([
        ...eventEvents.filter((e) => e.event === 'boost_purchased').map((e) => e.userId),
        ...eventEvents
          .filter((e) => e.event === 'second_chance_purchased')
          .map((e) => e.userId),
      ]).size,
    }
  }
}

// Singleton instance
export const analytics = new Analytics()

// Хелпер функции для удобного использования
export function trackEvent(event: AnalyticsEvent, eventId: string, userId: number, metadata?: Record<string, any>) {
  analytics.logEvent(event, {
    eventId,
    userId,
    timestamp: Date.now(),
    metadata,
  })
}

// Экспорт метрик для отображения
export function getEventMetrics(eventId: string) {
  return analytics.getMetrics(eventId)
}
