'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, Users, Brain, Shield } from 'lucide-react'

interface AnalyticsData {
  chartData: Array<{ date: string; avgScore: number; attempts: number; passed: number }>
  moduleCompletion: Array<{ name: string; completions: number }>
  stats: { totalStudents: number; totalTeachers: number; prepScore: number; totalDrills: number; totalQuizResults: number }
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#EC4899']

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-container space-y-6">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-slate-500">System-wide disaster preparedness metrics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Preparedness Score', value: `${data?.stats?.prepScore || 0}%`, icon: Shield, color: 'blue' },
          { label: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'purple' },
          { label: 'Quiz Attempts', value: data?.stats?.totalQuizResults || 0, icon: Brain, color: 'green' },
          { label: 'Drills Completed', value: data?.stats?.totalDrills || 0, icon: TrendingUp, color: 'orange' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950 flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily Quiz Activity */}
      {data?.chartData && data.chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Daily Quiz Activity (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="Avg Score %" />
              <Line type="monotone" dataKey="attempts" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} name="Attempts" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Module Completion */}
      {data?.moduleCompletion && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Module Completion Rates</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.moduleCompletion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={140} />
              <Tooltip formatter={(v: any) => [v, 'Completions']} />
              <Bar dataKey="completions" radius={[0, 4, 4, 0]}>
                {data.moduleCompletion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Preparedness Score Gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-6">Overall Preparedness Score</h2>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={data?.stats?.prepScore && data.stats.prepScore >= 70 ? '#10B981' : data?.stats?.prepScore && data.stats.prepScore >= 50 ? '#F59E0B' : '#EF4444'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - (data?.stats?.prepScore || 0) / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{data?.stats?.prepScore || 0}%</span>
              <span className="text-xs text-slate-400">Preparedness</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center max-w-sm">
            {(data?.stats?.prepScore || 0) >= 70
              ? 'Strong! Students show good disaster preparedness knowledge.'
              : (data?.stats?.prepScore || 0) >= 50
              ? 'Moderate. More practice quizzes and drills recommended.'
              : 'Needs improvement. Consider scheduling mandatory drills and module reviews.'
            }
          </p>
        </div>
      </motion.div>
    </div>
  )
}
