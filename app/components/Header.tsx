'use client'

import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import Sticker from './Sticker'

interface HeaderProps {
  title?: string
  showLogo?: boolean
}

export default function Header({ title, showLogo = true }: HeaderProps) {
  const userFriendlyAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  const handleConnect = async () => {
    if (userFriendlyAddress) {
      await tonConnectUI.disconnect()
    } else {
      await tonConnectUI.openModal()
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return 'Connect'
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <>
      {/* Logo/Title header - now simpler */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#e8f4fc] to-transparent dark:from-[#0f172a] py-3 safe-area-inset-top">
        <div className="w-full max-w-[480px] mx-auto px-4">
          <div className="flex items-center gap-2">
            {showLogo ? (
              <>
                <Sticker name="giftFree" size={28} />
                <span className="font-bold text-lg text-gray-800 dark:text-white">UNIC</span>
              </>
            ) : (
              <h1 className="font-semibold text-lg text-gray-800 dark:text-white truncate">{title}</h1>
            )}
          </div>
        </div>
      </header>

      {/* Prominent Connect Wallet Button - Fixed Top Right */}
      <button
        onClick={handleConnect}
        style={{ zIndex: 'var(--z-wallet)' }}
        className={`
          fixed top-4 right-4
          flex items-center gap-3 px-5 py-3
          rounded-2xl shadow-xl font-semibold
          active-scale touch-target
          transition-all duration-200
          ${userFriendlyAddress
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            : 'bg-gradient-to-r from-[#0098EA] to-[#00C6FB] text-white'
          }
        `}
      >
        {userFriendlyAddress ? (
          <>
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{formatAddress(userFriendlyAddress)}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span className="text-sm hidden xs:inline">Connect</span>
            <span className="text-sm xs:hidden">💰</span>
          </>
        )}
      </button>
    </>
  )
}
