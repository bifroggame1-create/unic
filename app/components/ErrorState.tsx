'use client'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  emoji?: string
}

export default function ErrorState({
  title = 'Oops!',
  message = 'Something went wrong',
  onRetry,
  emoji = '😢'
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Big emoji */}
      <div className="text-8xl mb-4 animate-bounce-slow">
        {emoji}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h2>

      {/* Message */}
      <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-6 py-3 rounded-xl
            bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]
            text-white font-semibold
            active-scale touch-target
            shadow-lg
          "
        >
          Try Again
        </button>
      )}
    </div>
  )
}
