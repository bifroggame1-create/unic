interface IconProps {
  size?: number
  color?: string
  className?: string
}

export function HomeIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 10.182V22h6.5v-7h5v7H21V10.182L12 2L3 10.182Z"
        fill={color}
      />
    </svg>
  )
}

export function GiftIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 7h-1.5A3.5 3.5 0 0 0 12 4.05 3.5 3.5 0 0 0 5.5 7H4c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2zm-8-1.5c.83 0 1.5.67 1.5 1.5h-3c0-.83.67-1.5 1.5-1.5zm-3.5 1.5c0-.83.67-1.5 1.5-1.5S11.5 6.17 11.5 7H7.05c.24-.55.63-1 1.45-1zM11 19H7v-6h4v6zm2 0V13h4v6h-4zm6-8H5V9h14v2z"
        fill={color}
      />
    </svg>
  )
}

export function ChannelIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8h2v8H9V8zm4 0h2v8h-2V8zm-8 6h2v2H5v-2zm12 0h2v2h-2v-2zm-12-4h2v2H5v-2zm12 0h2v2h-2v-2z"
        fill={color}
      />
    </svg>
  )
}

export function DiamondIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3H9.62zM11 10v6.68L5.44 10H11zm2 0h5.56L13 16.68V10zm6.26-2h-2.65l-1.5-3h2.65l1.5 3zM6.24 5h2.65l-1.5 3H4.74l1.5-3z"
        fill={color}
      />
    </svg>
  )
}

export function ProfileIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"
        fill={color}
      />
    </svg>
  )
}

export function TrophyIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8v2h8v-2h-3v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
        fill={color}
      />
    </svg>
  )
}

export function RocketIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12.003 2c-3.865 4.89-4.953 9.27-4.003 12.5l-3 2.5 1.5 3 3.5-1.5c.847 1.218 1.873 2.074 3.003 2.5 1.13-.426 2.156-1.282 3.003-2.5l3.5 1.5 1.5-3-3-2.5c.95-3.23-.138-7.61-4.003-12.5zm0 3.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
        fill={color}
      />
    </svg>
  )
}

export function StarIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2l2.939 6.243L22 9.18l-5.001 4.614L18.18 22 12 18.2 5.82 22l1.18-8.206L2 9.18l7.061-.937L12 2z"
        fill={color}
      />
    </svg>
  )
}

export function SearchIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill={color}
      />
    </svg>
  )
}

export function CelebrationIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m2 22 14-5-9-9-5 14zm12.53-9.47 5.59-5.59c.78-.78.78-2.05 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0l-5.59 5.59 4 4zM19.11 2.36l1.17 1.17c.78.78.78 2.05 0 2.83l-1.42 1.42-4-4 1.42-1.42a2 2 0 0 1 2.83 0z"
        fill={color}
      />
    </svg>
  )
}
