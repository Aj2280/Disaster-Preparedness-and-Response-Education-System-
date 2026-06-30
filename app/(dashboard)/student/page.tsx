'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Trophy, Award, Bell, Flame, Star, TrendingUp, ChevronRight, AlertTriangle, Calendar } from 'lucide-react'
import { getLevelFromXP, getXPProgress, formatDate, getPriorityColor } from '@/lib/utils'
import { LEVEL_TITLES, DISASTER_TYPES } from '@/lib/constants'
import { useSession } from 'next-auth/react'

interface DashboardData {
  profile: { xpPoints: number; level: number; totalQuizzes: number; avgScore: number; drillsCompleted: number } | null
  stats: { xpPoints: number; level: number; completedModules: number; totalModules: number; completionPercentage: number; totalQuizzes: number; avgScore: number; drillsCompleted: number }
  moduleProgress: Array<{ moduleId: string; completed: boolean; module: { title: string; iconEmoji: string; disasterType: string } }>
  recentResults: Array<{ id: string; score: number; passed: boolean; createdAt: string; quiz: { title: string; module: { title: string; iconEmoji: string } } }>
  badges: Array<{ badge: { name: string; iconEmoji: string; color: string; description: string } }>
  alerts: Array<{ id: string; title: string; priority: string; category: string; publishedAt: string }>
  schedules?: Array<{ id: string; title: string; eventType: string; date: string; location: string | null }>
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const xp = data?.stats?.xpPoints || 0
  const level = getLevelFromXP(xp)
  const xpProgress = getXPProgress(xp)
  const levelTitle = LEVEL_TITLES[Math.min(level, 10)] || 'Legend'

  if (loading) return <DashboardSkeleton />

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Continue your disaster preparedness journey
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 glass-card rounded-2xl">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{levelTitle}</div>
              <div className="text-xs text-slate-500">Level {level} · {xp} XP</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Alert Banner */}
      {data?.alerts && data.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {data.alerts.slice(0, 1).map(alert => (
            <Link key={alert.id} href="/student/alerts" className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm">{alert.title}</span>
                <span className="text-amber-600 dark:text-amber-400 text-xs ml-2">{formatDate(alert.publishedAt)}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </Link>
          ))}
        </motion.div>
      )}

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 glass-card rounded-2xl p-5"
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Level {level} Progress</span>
          <span className="text-slate-500">{xpProgress.current} / {xpProgress.needed} XP</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.percentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Level {level}</span>
          <span>Level {level + 1}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Modules Done', value: `${data?.stats?.completedModules || 0}/${data?.stats?.totalModules || 8}`, icon: BookOpen, color: 'blue', href: '/student/modules' },
          { label: 'Quizzes Taken', value: data?.stats?.totalQuizzes || 0, icon: Brain, color: 'purple', href: '/student/quiz-history' },
          { label: 'Avg Score', value: `${data?.stats?.avgScore || 0}%`, icon: TrendingUp, color: 'green', href: '/student/quiz-history' },
          { label: 'Drills Done', value: data?.stats?.drillsCompleted || 0, icon: Flame, color: 'orange', href: '/student/simulations' },
        ].map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="stat-card group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Disaster Modules</h2>
            <Link href="/student/modules" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DISASTER_TYPES.map(disaster => {
              const progress = data?.moduleProgress?.find(p => p.module?.disasterType === disaster.type)
              const isCompleted = progress?.completed || false
              return (
                <Link key={disaster.type} href={`/student/modules/${disaster.id}`}>
                  <div className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${isCompleted ? 'border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800' : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700'}`}>
                    <div className="text-2xl mb-2">{disaster.emoji}</div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{disaster.label}</div>
                    {isCompleted && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Badges & Recent */}
        <div className="space-y-6">
          {/* Recent Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">My Badges</h2>
              <Link href="/student/achievements" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
            </div>
            {data?.badges && data.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {data.badges.map((ub, i) => (
                  <div key={i} title={ub.badge.description} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-help">
                    <span className="text-2xl">{ub.badge.iconEmoji}</span>
                    <span className="text-xs text-slate-500 mt-1 text-center leading-tight">{ub.badge.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Trophy className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Complete modules to earn badges!</p>
              </div>
            )}
          </motion.div>

          {/* Recent Quiz Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Recent Quizzes</h2>
              <Link href="/student/quiz-history" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
            </div>
            {data?.recentResults && data.recentResults.length > 0 ? (
              <div className="space-y-3">
                {data.recentResults.slice(0, 3).map(result => (
                  <div key={result.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{result.quiz.module.iconEmoji}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 max-w-[100px] truncate">{result.quiz.module.title}</span>
                    </div>
                    <span className={`text-sm font-bold ${result.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                      {result.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Brain className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Take your first quiz!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 glass-card rounded-2xl p-6"
      >
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/student/modules', label: 'Start Learning', emoji: '📚', bg: 'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100' },
            { href: '/student/simulations', label: 'Run a Drill', emoji: '🚨', bg: 'bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100' },
            { href: '/student/leaderboard', label: 'Leaderboard', emoji: '🏆', bg: 'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100' },
            { href: '/student/emergency-contacts', label: 'Emergency #s', emoji: '📞', bg: 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100' },
          ].map(action => (
            <Link key={action.href} href={action.href}>
              <div className={`p-4 rounded-xl ${action.bg} transition-all hover:shadow-md cursor-pointer text-center`}>
                <div className="text-2xl mb-2">{action.emoji}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{action.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Schedules */}
      {data?.schedules && data.schedules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">Upcoming Drills & Deadlines</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.schedules.map(schedule => (
              <div key={schedule.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{schedule.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                    {schedule.eventType}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {formatDate(schedule.date)}
                </div>
                {schedule.location && (
                  <div className="text-xs text-slate-500">📍 {schedule.location}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="page-container space-y-6">
      <div className="skeleton h-12 w-64" />
      <div className="skeleton h-16 rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 skeleton h-64 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  )
}
