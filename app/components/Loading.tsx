'use client'

import Sticker from './Sticker'

interface LoadingProps {
  text?: string
  size?: number
}

export default function Loading({ text = 'Loading...', size = 100 }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Sticker name="loading" size={size} />
      {text && (
        <p className="text-sm text-gray-500 mt-4">{text}</p>
      )}
    </div>
  )
}

// Full screen loading overlay
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loading text={text} size={120} />
    </div>
  )
}
