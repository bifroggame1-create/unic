import type { Metadata, Viewport } from "next"
import "./globals.css"
import "@telegram-apps/telegram-ui/dist/styles.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "UNIC — Engagement Events",
  description: "Launch engagement events with Telegram Gifts for your channel",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
