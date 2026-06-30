'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface LeaderboardEntry {
  rank: number
  name: string
  image: string | null
  school: string
  xpPoints: number
  level: number
  totalQuizzes: number
  avgScore: number
}

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { setEntries(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-container">
      {[...Array(10)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl mb-3" />)}
    </div>
  )

  const rankMedals = ['🥇', '🥈', '🥉']

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Top performers ranked by XP points</p>
      </div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3
            const heights = ['h-24', 'h-32', 'h-20']
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                  {entry.name[0]}
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mb-1 truncate max-w-[80px]">{entry.name}</p>
                <p className="text-xs text-slate-400 mb-2">{entry.xpPoints} XP</p>
                <div className={`w-full ${heights[i]} rounded-t-xl flex items-center justify-center text-2xl ${
                  actualRank === 1 ? 'bg-amber-400' : actualRank === 2 ? 'bg-slate-300' : 'bg-orange-400'
                }`}>
                  {rankMedals[actualRank - 1]}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {entries.map((entry, i) => {
          const isCurrentUser = entry.name === session?.user?.name
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 ${isCurrentUser ? 'bg-blue-50 dark:bg-blue-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'} transition-colors`}
            >
              <div className="w-8 text-center">
                {entry.rank <= 3
                  ? <span className="text-xl">{rankMedals[entry.rank - 1]}</span>
                  : <span className="text-sm font-bold text-slate-400">#{entry.rank}</span>
                }
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                {entry.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {entry.name} {isCurrentUser && <span className="text-xs font-normal text-blue-500">(You)</span>}
                </p>
                <p className="text-xs text-slate-400 truncate">{entry.school}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">Avg Score</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{Math.round(entry.avgScore)}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Level {entry.level}</p>
                <p className="font-bold text-sm text-amber-600">{entry.xpPoints} XP</p>
              </div>
            </motion.div>
          )
        })}

        {entries.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            No entries yet. Complete a quiz to appear on the leaderboard!
          </div>
        )}
      </div>
    </div>
  )
}
