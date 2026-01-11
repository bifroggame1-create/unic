'use client'

import { Modal, Button } from '@telegram-apps/telegram-ui'
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
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      header={<Modal.Header>{title}</Modal.Header>}
    >
      <div className="space-y-4">
        {/* Error Icon/Sticker */}
        <div className="flex justify-center">
          <Sticker name="error" size={80} />
        </div>

        {/* Message */}
        <p className="text-[var(--text-secondary)] text-center">
          {message}
        </p>

        {/* Details (collapsible for admins) */}
        {details && (
          <details>
            <summary className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] mb-2">
              Технические детали
            </summary>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-[var(--text-secondary)] font-mono break-all mt-2">
              {details}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {showRetry && onRetry && (
            <Button
              size="l"
              stretched
              onClick={onRetry}
            >
              Попробовать снова
            </Button>
          )}
          <Button
            size="l"
            stretched
            mode="gray"
            onClick={onClose}
          >
            {showRetry ? 'Закрыть' : 'Понятно'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
