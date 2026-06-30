import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { Sidebar } from '@/components/shared/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <main className="lg:pl-60">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
