'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { School, Users, Bell, BarChart3, TrendingUp, AlertTriangle, ChevronRight, BookOpen, PhoneCall } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatDate } from '@/lib/utils'

interface AdminData {
  stats: { totalSchools: number; totalStudents: number; totalTeachers: number; totalAlerts: number; avgScore: number; totalModules: number; totalContacts: number }
  users: Array<{ id: string; name: string; email: string; role: string; createdAt: string; school: { name: string } | null }>
  alerts: Array<{ id: string; title: string; priority: string; publishedAt: string; isActive: boolean }>
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-container space-y-6">
      <div className="skeleton h-12 w-64" />
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
    </div>
  )

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-slate-500">Welcome, {session?.user?.name} 🏫</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Schools', value: data?.stats?.totalSchools || 0, icon: School, color: 'blue', href: '/admin/schools' },
          { label: 'Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'purple', href: '/admin/users' },
          { label: 'Modules / Quizzes', value: data?.stats?.totalModules || 0, icon: BookOpen, color: 'indigo', href: '#' },
          { label: 'Emergency Contacts', value: data?.stats?.totalContacts || 0, icon: PhoneCall, color: 'rose', href: '#' },
          { label: 'Active Alerts', value: data?.stats?.totalAlerts || 0, icon: Bell, color: 'red', href: '/admin/alerts' },
          { label: 'Avg Score', value: `${data?.stats?.avgScore || 0}%`, icon: TrendingUp, color: 'amber', href: '/admin/analytics' },
        ].map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="stat-card group"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Registrations</h2>
            <Link href="/admin/users" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              All users <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.users || []).slice(0, 8).map(user => (
              <div key={user.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  user.role === 'ADMIN' ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
                  user.role === 'TEACHER' ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                  'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.school?.name || 'No school'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' :
                  user.role === 'TEACHER' ? 'bg-violet-100 text-violet-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Emergency Alerts</h2>
            <Link href="/admin/alerts" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.alerts || []).slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${
                  alert.priority === 'CRITICAL' ? 'text-red-500' :
                  alert.priority === 'HIGH' ? 'text-orange-500' :
                  alert.priority === 'MEDIUM' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{alert.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(alert.publishedAt)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${alert.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {alert.isActive ? 'Active' : 'Expired'}
                </span>
              </div>
            ))}
          </div>
          <Link href="/admin/alerts" className="mt-4 flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors">
            <Bell className="w-4 h-4" /> Publish New Alert
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Admin Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: '/admin/schools', label: 'Manage Schools', emoji: '🏫' },
            { href: '/admin/users', label: 'Manage Users', emoji: '👥' },
            { href: '/admin/alerts', label: 'Send Alert', emoji: '🚨' },
            { href: '/admin/analytics', label: 'View Analytics', emoji: '📊' },
            { href: '/admin/contacts', label: 'Manage Contacts', emoji: '📞' },
            { href: '/admin/modules', label: 'Manage Modules', emoji: '📚' },
          ].map(action => (
            <Link key={action.label} href={action.href}>
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors text-center cursor-pointer">
                <div className="text-2xl mb-2">{action.emoji}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{action.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
