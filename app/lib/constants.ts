// Telegram Mini App Spacing System
// All spacing must use these constants only

export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
} as const

// User-friendly error messages (NO dev text)
export const USER_ERRORS = {
  NETWORK: 'Проблема с подключением. Проверьте интернет',
  PERMISSION: 'Недостаточно прав для этого действия',
  NOT_FOUND: 'Не найдено',
  UNKNOWN: 'Что-то пошло не так. Попробуйте позже',
  CHANNEL_NOT_FOUND: 'Канал не найден. Убедитесь, что бот добавлен как администратор',
  NOT_ADMIN: 'Вы должны быть администратором канала',
  EVENT_COMPLETE: 'Событие завершено',
  PAYMENT_FAILED: 'Не удалось обработать платёж',
} as const

// Convert technical errors to user-friendly messages
export function getUserFriendlyError(error: unknown): string {
  if (!error) return USER_ERRORS.UNKNOWN

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  // Network errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
    return USER_ERRORS.NETWORK
  }

  // Permission errors
  if (errorMessage.includes('permission') || errorMessage.includes('forbidden') || errorMessage.includes('unauthorized')) {
    return USER_ERRORS.PERMISSION
  }

  // Not found errors
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return USER_ERRORS.NOT_FOUND
  }

  // Channel-specific errors
  if (errorMessage.includes('channel') && errorMessage.includes('not found')) {
    return USER_ERRORS.CHANNEL_NOT_FOUND
  }

  if (errorMessage.includes('admin') || errorMessage.includes('administrator')) {
    return USER_ERRORS.NOT_ADMIN
  }

  // Payment errors
  if (errorMessage.includes('payment') || errorMessage.includes('invoice')) {
    return USER_ERRORS.PAYMENT_FAILED
  }

  // Default fallback
  return USER_ERRORS.UNKNOWN
}

// Hide internal IDs from users
export function formatChannelName(channel: { title?: string; username?: string; chatId?: number }): string {
  return channel.title || channel.username || 'Канал'
}

export function formatEventTitle(event: { title?: string; _id?: string }): string {
  return event.title || 'Событие'
}
