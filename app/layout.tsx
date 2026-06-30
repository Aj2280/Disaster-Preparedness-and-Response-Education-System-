import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
export const metadata: Metadata = {
  title: {
    default: 'DisasterPrep EDU — Disaster Preparedness for Schools',
    template: '%s | DisasterPrep EDU',
  },
  description: 'Comprehensive disaster preparedness and response education system for schools and colleges. Learn earthquake, flood, fire, cyclone, and more.',
  keywords: ['disaster preparedness', 'school safety', 'earthquake safety', 'flood safety', 'fire safety', 'disaster education'],
  authors: [{ name: 'DisasterPrep EDU' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DisasterPrep EDU',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' },
          }}
        />
      </body>
    </html>
  )
}
