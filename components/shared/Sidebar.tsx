'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Brain, Trophy, Award, Bell, Phone,
  Users, FileText, BarChart3, Settings, LogOut, Shield, ChevronRight,
  Zap, School, GraduationCap, Menu, X, Calendar
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const studentNav = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/modules', label: 'Learning Modules', icon: BookOpen },
  { href: '/student/simulations', label: 'Virtual Drills', icon: Brain },
  { href: '/student/quiz-history', label: 'Quiz History', icon: FileText },
  { href: '/student/achievements', label: 'Achievements', icon: Trophy },
  { href: '/student/certificates', label: 'Certificates', icon: Award },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { href: '/student/alerts', label: 'Emergency Alerts', icon: Bell },
  { href: '/student/emergency-contacts', label: 'Emergency Contacts', icon: Phone },
]

const teacherNav = [
  { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/students', label: 'My Students', icon: GraduationCap },
  { href: '/teacher/modules', label: 'Modules', icon: BookOpen },
  { href: '/teacher/quizzes', label: 'Quizzes', icon: Brain },
  { href: '/teacher/schedule', label: 'Schedule', icon: Calendar },
  { href: '/teacher/reports', label: 'Reports', icon: BarChart3 },
]

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/schools', label: 'Schools', icon: School },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/alerts', label: 'Emergency Alerts', icon: Bell },
  { href: '/teacher/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

const roleNavMap: Record<string, typeof studentNav> = {
  STUDENT: studentNav,
  TEACHER: teacherNav,
  ADMIN: adminNav,
}

const roleColorMap: Record<string, string> = {
  STUDENT: 'from-blue-600 to-indigo-600',
  TEACHER: 'from-violet-600 to-purple-600',
  ADMIN: 'from-rose-600 to-pink-600',
}

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = session?.user?.role || 'STUDENT'
  const navItems = roleNavMap[role] || studentNav
  const gradient = roleColorMap[role] || 'from-blue-600 to-indigo-600'

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-white">DisasterPrep</span>
        </Link>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80`}>
          <Zap className="w-3 h-3" />
          {role === 'STUDENT' ? 'Student Portal' : role === 'TEACHER' ? 'Teacher Portal' : 'Admin Panel'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' + role && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
            {session?.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
            <p className="text-xs text-white/50 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full py-1.5 px-2 rounded-lg hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:flex w-60 shrink-0 flex-col bg-gradient-to-b ${gradient} fixed top-0 left-0 h-full z-30`}>
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gradient-to-b ${gradient} z-50`}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
