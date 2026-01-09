'use client'

import { useState } from 'react'
import { Modal, Button } from '@telegram-apps/telegram-ui'
import { useHaptic, useTelegram } from '../contexts/TelegramContext'
import { t } from '../lib/translations'
import { BOOST_PRICING } from '../lib/boostConfig'
import { trackEvent } from '../lib/analytics'

interface BoostModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  userId: number
  onPurchase: () => Promise<void>
}

export default function BoostModal({
  isOpen,
  onClose,
  eventId,
  userId,
  onPurchase,
}: BoostModalProps) {
  const haptic = useHaptic()
  const { webApp } = useTelegram()
  const [processing, setProcessing] = useState(false)

  const handlePurchase = async () => {
    haptic.impact('medium')
    trackEvent('boost_clicked', eventId, userId)

    setProcessing(true)

    try {
      // Call the actual purchase handler which will use Telegram Stars
      await onPurchase()

      trackEvent('boost_purchased', eventId, userId, {
        price: BOOST_PRICING.BASE.priceStars,
        multiplier: BOOST_PRICING.BASE.multiplier,
      })

      haptic.notification('success')
      onClose()
    } catch (error: any) {
      console.error('Boost purchase error:', error)

      if (error.message?.includes('reject') || error.message?.includes('cancel')) {
        webApp?.showAlert('Оплата отменена')
      } else {
        webApp?.showAlert(error.message || 'Не удалось активировать Boost. Попробуй снова.')
      }

      haptic.notification('error')
    } finally {
      setProcessing(false)
    }
  }

  const handleSecondary = () => {
    haptic.impact('light')
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleSecondary()
      }}
      header={<Modal.Header>{t('boost.modalTitle')}</Modal.Header>}
    >
      <div className="space-y-4 p-4">
        {/* Описание */}
        <p className="text-[var(--text-primary)] text-base leading-relaxed">
          {t('boost.modalDescription')}
        </p>

        {/* Детали Boost */}
        <div className="bg-[var(--primary)]/10 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">{t('boost.multiplier')}</span>
            <span className="text-lg font-bold text-[var(--primary)]">
              ×{BOOST_PRICING.BASE.multiplier}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">{t('boost.priceLabel')}</span>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              {BOOST_PRICING.BASE.priceStars} {t('boost.priceSuffix')}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
          {t('boost.disclaimer')}
        </p>

        {/* Кнопки */}
        <div className="space-y-3 pt-2">
          <Button
            size="l"
            stretched
            onClick={handlePurchase}
            disabled={processing}
            loading={processing}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]"
          >
            {processing ? 'Обработка...' : t('boost.ctaPrimary')}
          </Button>

          <Button size="l" stretched mode="gray" onClick={handleSecondary} disabled={processing}>
            {t('boost.ctaSecondary')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
