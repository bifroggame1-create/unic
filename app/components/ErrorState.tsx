'use client'

import { t } from '../lib/translations'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  emoji?: string
  centered?: boolean
}

export default function ErrorState({
  title,
  message,
  onRetry,
  emoji = '😢',
  centered = true
}: ErrorStateProps) {
  // Use translated defaults if not provided
  const displayTitle = title || t('common.error')
  const displayMessage = message || t('common.errorMessage')
  const retryText = t('common.tryAgain')

  return (
    <div className={`flex flex-col items-center px-4 text-center ${centered ? 'justify-center min-h-[50vh]' : 'py-12'}`}>
      {/* Big emoji */}
      <div className="text-7xl mb-4 animate-bounce-slow">
        {emoji}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        {displayTitle}
      </h2>

      {/* Message */}
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm text-sm leading-relaxed">
        {displayMessage}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-6 py-3 rounded-xl
            bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]
            text-white font-semibold text-sm
            active-scale touch-target
            shadow-lg
          "
        >
          {retryText}
        </button>
      )}
    </div>
  )
}
