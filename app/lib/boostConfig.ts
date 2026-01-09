// Boost trigger configuration - единая точка правды
export const BOOST_TRIGGER_CONFIG = {
  TOP_PERCENT_THRESHOLD: 0.3, // топ-30% участников
  MAX_POINTS_GAP: 12, // разница до следующей позиции ≤ 12 очков
  MAX_TIME_LEFT_HOURS: 6, // до конца ивента ≤ 6 часов
  MIN_USER_ACTIONS: 5, // минимум 5 действий (реакции или комментарии)
  COOLDOWN_HOURS: 24, // не показывать boost 24 часа после последнего показа
}

// Boost pricing
export const BOOST_PRICING = {
  BASE: {
    id: 'boost_x1_5_event',
    multiplier: 1.5,
    duration: 'event',
    priceStars: 100,
  },
}

// Boost trigger input type
export type BoostTriggerInput = {
  userRank: number
  totalUsers: number
  pointsToNextRank: number
  hoursLeft: number
  userActionsCount: number
  lastBoostPromptAt?: number
}

// Функция определения показа Boost - ВСЕ условия должны быть выполнены
export function shouldShowBoost(input: BoostTriggerInput): boolean {
  const {
    userRank,
    totalUsers,
    pointsToNextRank,
    hoursLeft,
    userActionsCount,
    lastBoostPromptAt,
  } = input

  const {
    TOP_PERCENT_THRESHOLD,
    MAX_POINTS_GAP,
    MAX_TIME_LEFT_HOURS,
    MIN_USER_ACTIONS,
    COOLDOWN_HOURS,
  } = BOOST_TRIGGER_CONFIG

  // Проверка: пользователь в топ-30%
  const isInTopPercent = userRank / totalUsers <= TOP_PERCENT_THRESHOLD

  // Проверка: близко к следующей позиции (≤ 12 очков)
  const isCloseEnough = pointsToNextRank > 0 && pointsToNextRank <= MAX_POINTS_GAP

  // Проверка: до конца ≤ 6 часов
  const isEndingSoon = hoursLeft > 0 && hoursLeft <= MAX_TIME_LEFT_HOURS

  // Проверка: минимум 5 действий
  const hasEnoughEngagement = userActionsCount >= MIN_USER_ACTIONS

  // Проверка: cooldown прошёл (24 часа)
  const cooldownPassed = !lastBoostPromptAt
    ? true
    : Date.now() - lastBoostPromptAt > COOLDOWN_HOURS * 60 * 60 * 1000

  // Показывать только если ВСЕ условия выполнены
  return (
    isInTopPercent &&
    isCloseEnough &&
    isEndingSoon &&
    hasEnoughEngagement &&
    cooldownPassed
  )
}
