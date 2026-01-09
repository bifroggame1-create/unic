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
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#e8f4fc] to-transparent dark:from-[#0f172a] px-4 py-3">
      <div className="flex items-center justify-between">
        {showLogo ? (
          <div className="flex items-center gap-2">
            <Sticker name="giftFree" size={28} />
            <span className="font-bold text-lg text-gray-800 dark:text-white">UNIC</span>
          </div>
        ) : (
          <h1 className="font-semibold text-lg text-gray-800 dark:text-white">{title}</h1>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleConnect}
            className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1.5 transition-colors ${
              userFriendlyAddress
                ? 'text-white bg-green-500 hover:bg-green-600'
                : 'text-white bg-[#2563eb] hover:bg-[#1d4ed8]'
            }`}
          >
            {userFriendlyAddress ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {formatAddress(userFriendlyAddress)}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Connect Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
