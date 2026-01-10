'use client'

interface QuickActionCardProps {
  icon: string
  title: string
  gradient?: string
  onClick?: () => void
}

export default function QuickActionCard({
  icon,
  title,
  gradient = 'from-blue-500 to-blue-600',
  onClick
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        h-32 rounded-2xl p-4
        bg-gradient-to-br ${gradient}
        active-scale touch-target
        flex flex-col justify-between
        text-white shadow-lg
        transition-all duration-200
      `}
    >
      <div className="text-5xl">{icon}</div>
      <div className="font-bold text-left">{title}</div>
    </button>
  )
}
