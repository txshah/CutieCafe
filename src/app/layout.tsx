import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'lockin.cafe',
  description: 'SF cafe passport for work-friendly Mission and SoMa cafes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

