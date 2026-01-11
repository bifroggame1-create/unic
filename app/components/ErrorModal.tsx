'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Sticker from './Sticker'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  details?: string
  showRetry?: boolean
  onRetry?: () => void
}

export default function ErrorModal({
  isOpen,
  onClose,
  title = 'Ошибка',
  message,
  details,
  showRetry = false,
  onRetry,
}: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
          >
            <div className="card p-6 shadow-2xl">
              {/* Error Icon/Sticker */}
              <div className="flex justify-center mb-4">
                <Sticker name="error" size={80} />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-[var(--text-primary)] text-center mb-3">
                {title}
              </h2>

              {/* Message */}
              <p className="text-[var(--text-secondary)] text-center mb-4">
                {message}
              </p>

              {/* Details (collapsible for admins) */}
              {details && (
                <details className="mb-4">
                  <summary className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] mb-2">
                    Технические детали
                  </summary>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-[var(--text-secondary)] font-mono break-all">
                    {details}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {showRetry && onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Попробовать снова
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`${showRetry ? 'flex-1' : 'w-full'} py-3 px-4 rounded-xl bg-[var(--bg-start)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-end)] transition-all`}
                >
                  {showRetry ? 'Закрыть' : 'Понятно'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
