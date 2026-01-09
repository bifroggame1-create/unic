'use client'

import { useState } from 'react'
import { Modal, Button } from '@telegram-apps/telegram-ui'
import { useHaptic, useTelegram } from '../contexts/TelegramContext'
import { t } from '../lib/translations'
import { SECOND_CHANCE_PRICING } from '../lib/secondChanceConfig'
import { trackEvent } from '../lib/analytics'

interface SecondChanceModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  userId: number
  onPurchase: () => Promise<void>
}

export default function SecondChanceModal({
  isOpen,
  onClose,
  eventId,
  userId,
  onPurchase,
}: SecondChanceModalProps) {
  const haptic = useHaptic()
  const { webApp } = useTelegram()
  const [processing, setProcessing] = useState(false)

  const handlePurchase = async () => {
    haptic.impact('medium')
    trackEvent('second_chance_clicked', eventId, userId)

    setProcessing(true)

    try {
      // Call the actual purchase handler which will use Telegram Stars
      await onPurchase()

      trackEvent('second_chance_purchased', eventId, userId, {
        price: SECOND_CHANCE_PRICING.BASE.priceStars,
      })

      haptic.notification('success')
      onClose()
    } catch (error: any) {
      console.error('Second Chance purchase error:', error)

      if (error.message?.includes('reject') || error.message?.includes('cancel')) {
        webApp?.showAlert('Оплата отменена')
      } else {
        webApp?.showAlert(error.message || 'Не удалось активировать Second Chance. Попробуй снова.')
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
      header={<Modal.Header>{t('secondChance.modalTitle')}</Modal.Header>}
    >
      <div className="space-y-4 p-4">
        {/* Описание */}
        <p className="text-[var(--text-primary)] text-base leading-relaxed">
          {t('secondChance.modalDescription')}
        </p>

        {/* Детали Second Chance */}
        <div className="bg-amber-500/10 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">
              {t('secondChance.priceLabel')}
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {SECOND_CHANCE_PRICING.BASE.priceStars} {t('secondChance.priceSuffix')}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
          {t('secondChance.disclaimer')}
        </p>

        {/* Кнопки */}
        <div className="space-y-3 pt-2">
          <Button
            size="l"
            stretched
            onClick={handlePurchase}
            disabled={processing}
            loading={processing}
            className="bg-gradient-to-r from-amber-500 to-orange-500"
          >
            {processing ? t('secondChance.processing') : t('secondChance.ctaPrimary')}
          </Button>

          <Button size="l" stretched mode="gray" onClick={handleSecondary} disabled={processing}>
            {t('secondChance.ctaSecondary')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
