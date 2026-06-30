'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Brain } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatDate } from '@/lib/utils'

interface Report {
  recentResults: Array<{
    id: string; score: number; passed: boolean; createdAt: string
    user: { name: string }; quiz: { module: { title: string } }
  }>
  students: Array<{
    id: string; name: string
    studentProfile: { avgScore: number; totalQuizzes: number; xpPoints: number }
  }>
}

export default function TeacherReportsPage() {
  const [data, setData] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="page-container space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
    </div>
  )

  const studentScores = (data?.students || []).map(s => ({
    name: s.name.split(' ')[0],
    avgScore: Math.round(s.studentProfile?.avgScore || 0),
    quizzes: s.studentProfile?.totalQuizzes || 0,
    xp: s.studentProfile?.xpPoints || 0,
  }))

  const passRate = data?.recentResults
    ? Math.round((data.recentResults.filter(r => r.passed).length / (data.recentResults.length || 1)) * 100)
    : 0

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reports & Analytics</h1>
        <p className="text-slate-500">Performance insights for your students</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pass Rate', value: `${passRate}%`, icon: TrendingUp, color: 'green' },
          { label: 'Total Attempts', value: data?.recentResults?.length || 0, icon: Brain, color: 'blue' },
          { label: 'Students', value: data?.students?.length || 0, icon: Users, color: 'purple' },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <stat.icon className={`w-6 h-6 text-${stat.color}-600 mb-2`} />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Student score bar chart */}
      {studentScores.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Student Average Scores</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={studentScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [`${value}%`, 'Avg Score']} />
              <Bar dataKey="avgScore" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Results Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Quiz Results</h2>
        </div>
        {(data?.recentResults || []).slice(0, 15).map((result, i) => (
          <div key={result.id} className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {result.user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{result.user.name}</p>
              <p className="text-xs text-slate-400 truncate">{result.quiz.module.title}</p>
            </div>
            <span className={`text-sm font-bold ${result.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>{result.score}%</span>
            <span className={`text-xs px-2 py-1 rounded-full ${result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.passed ? 'Pass' : 'Fail'}
            </span>
          </div>
        ))}
        {(!data?.recentResults || data.recentResults.length === 0) && (
          <div className="text-center py-12 text-slate-400 text-sm">No quiz results yet</div>
        )}
      </motion.div>
    </div>
  )
}
