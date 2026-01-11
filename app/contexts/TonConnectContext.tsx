'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode } from 'react'

// Dynamic manifest URL - uses API endpoint
const getManifestUrl = () => {
  if (typeof window === 'undefined') return ''

  const baseUrl = window.location.origin
  return `${baseUrl}/api/tonconnect-manifest`
}

export function TonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl={getManifestUrl()}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: 'telegram-wallet',
            name: 'Wallet',
            imageUrl: 'https://wallet.tg/images/logo-288.png',
            aboutUrl: 'https://wallet.tg/',
            universalLink: 'https://t.me/wallet?attach=wallet',
            bridgeUrl: 'https://bridge.ton.space/bridge',
            platforms: ['ios', 'android', 'macos', 'windows', 'linux']
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/rtyrtrebot'
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}
