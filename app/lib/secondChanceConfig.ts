// Second Chance configuration - единая точка правды
export const SECOND_CHANCE_CONFIG = {
  TOP_PERCENT_THRESHOLD: 0.4, // топ-40% участников
  MAX_POINTS_GAP: 15, // разница до последнего призового места ≤ 15 очков
  MIN_USER_ACTIONS: 5, // минимум 5 действий
  TIME_WINDOW_MINUTES: 30, // не более 30 минут после окончания события
}

// Second Chance pricing
export const SECOND_CHANCE_PRICING = {
  BASE: {
    id: 'second_chance_event',
    priceStars: 75,
  },
}

// Second Chance trigger input type
export type SecondChanceInput = {
  userRank: number
  totalUsers: number
  pointsToPrizeRank: number // разница до последнего призового места
  userActionsCount: number
  minutesSinceEventEnd: number
  alreadyUsed: boolean
}

// Функция определения показа Second Chance - ВСЕ условия должны быть выполнены
export function shouldShowSecondChance(input: SecondChanceInput): boolean {
  const {
    userRank,
    totalUsers,
    pointsToPrizeRank,
    userActionsCount,
    minutesSinceEventEnd,
    alreadyUsed,
  } = input

  const {
    TOP_PERCENT_THRESHOLD,
    MAX_POINTS_GAP,
    MIN_USER_ACTIONS,
    TIME_WINDOW_MINUTES,
  } = SECOND_CHANCE_CONFIG

  // Если уже использован - не показывать
  if (alreadyUsed) return false

  // Показывать только если ВСЕ условия выполнены
  return (
    userRank / totalUsers <= TOP_PERCENT_THRESHOLD && // топ-40%
    pointsToPrizeRank <= MAX_POINTS_GAP && // ≤ 15 очков до приза
    userActionsCount >= MIN_USER_ACTIONS && // ≥ 5 действий
    minutesSinceEventEnd <= TIME_WINDOW_MINUTES // ≤ 30 минут после окончания
  )
}
