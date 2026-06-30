'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, BookOpen, Brain, BarChart3, ChevronRight, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface TeacherData {
  stats: { totalStudents: number; modules: number }
  students: Array<{ id: string; name: string; email: string; studentProfile: { xpPoints: number; avgScore: number; totalQuizzes: number } | null }>
  recentResults: Array<{ id: string; score: number; passed: boolean; createdAt: string; user: { name: string }; quiz: { module: { title: string } } }>
}

export default function TeacherDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-container space-y-6">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Teacher Dashboard
        </h1>
        <p className="text-slate-500">Welcome, {session?.user?.name} 👩‍🏫</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'blue', href: '/teacher/students' },
          { label: 'Modules', value: data?.stats?.modules || 8, icon: BookOpen, color: 'purple', href: '/teacher/modules' },
          { label: 'Quizzes Created', value: 8, icon: Brain, color: 'green', href: '/teacher/quizzes' },
          { label: 'Reports', value: data?.recentResults?.length || 0, icon: BarChart3, color: 'orange', href: '/teacher/reports' },
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
        {/* Students */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Students Overview</h2>
            <Link href="/teacher/students" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.students?.slice(0, 6).map(student => (
              <div key={student.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {student.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.studentProfile?.totalQuizzes || 0} quizzes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(student.studentProfile?.avgScore || 0)}%</p>
                  <p className="text-xs text-slate-400">avg</p>
                </div>
              </div>
            ))}
            {(!data?.students || data.students.length === 0) && (
              <p className="text-center text-sm text-slate-400 py-4">No students found</p>
            )}
          </div>
        </motion.div>

        {/* Recent Quiz Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <Link href="/teacher/reports" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Reports <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentResults?.slice(0, 8).map(result => (
              <div key={result.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <TrendingUp className={`w-4 h-4 shrink-0 ${result.passed ? 'text-green-500' : 'text-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{result.user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{result.quiz.module.title}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${result.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>{result.score}%</p>
                  <p className="text-xs text-slate-400">{formatDate(result.createdAt).split(',')[0]}</p>
                </div>
              </div>
            ))}
            {(!data?.recentResults || data.recentResults.length === 0) && (
              <p className="text-center text-sm text-slate-400 py-4">No activity yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/teacher/students', label: 'Manage Students', emoji: '👥' },
            { href: '/teacher/modules', label: 'View Modules', emoji: '📚' },
            { href: '/teacher/quizzes', label: 'Quiz Manager', emoji: '📝' },
            { href: '/teacher/reports', label: 'View Reports', emoji: '📊' },
          ].map(action => (
            <Link key={action.href} href={action.href}>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-center cursor-pointer">
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
