'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface QuizResult {
  id: string
  score: number
  correctQ: number
  totalQ: number
  passed: boolean
  timeTaken: number | null
  createdAt: string
  quiz: {
    title: string
    module: { title: string; iconEmoji: string }
  }
}

export default function QuizHistoryPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/results')
      .then(r => r.json())
      .then(d => { setResults(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0
  const passed = results.filter(r => r.passed).length

  if (loading) return (
    <div className="page-container">
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl mb-3" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quiz History</h1>
        <p className="text-slate-500 dark:text-slate-400">{results.length} quizzes attempted</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Attempts', value: results.length },
          { label: 'Passed', value: passed },
          { label: 'Avg Score', value: `${avgScore}%` },
        ].map(stat => (
          <div key={stat.label} className="stat-card text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <Brain className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No quizzes yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Complete a module and take its quiz to see results here.</p>
          <Link href="/student/modules" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold inline-block">
            Start Learning
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {results.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0"
            >
              <span className="text-2xl">{result.quiz.module.iconEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{result.quiz.module.title}</p>
                <p className="text-xs text-slate-400">{formatDate(result.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{result.correctQ}/{result.totalQ} correct</p>
              </div>
              <div className={`text-xl font-black w-14 text-right ${result.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                {result.score}%
              </div>
              <div>
                {result.passed
                  ? <CheckCircle className="w-5 h-5 text-green-500" />
                  : <XCircle className="w-5 h-5 text-red-400" />
                }
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
