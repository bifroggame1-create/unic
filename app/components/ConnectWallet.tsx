'use client'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'

export function ConnectWalletButton() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()

  if (!wallet) {
    return (
      <button
        onClick={() => tonConnectUI.openModal()}
        className="fixed top-4 right-4 z-[100]
                   flex items-center gap-3 px-6 py-3.5
                   bg-gradient-to-r from-blue-500 to-blue-600
                   rounded-2xl text-white font-bold text-base
                   shadow-2xl hover:shadow-3xl
                   active:scale-95 transition-all duration-200"
        style={{ minHeight: '50px', minWidth: '160px' }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-2
                   px-4 py-2.5 bg-green-500/20 backdrop-blur-xl
                   border-2 border-green-400 rounded-2xl shadow-lg">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-white font-mono text-sm">
        {wallet.account.address.slice(0, 4)}...{wallet.account.address.slice(-4)}
      </span>
      <button
        onClick={() => tonConnectUI.disconnect()}
        className="ml-2 text-red-400 hover:text-red-300"
      >
        ✕
      </button>
    </div>
  )
}
