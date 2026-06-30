'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface UserBadge {
  badge: { name: string; iconEmoji: string; color: string; description: string; xpReward: number }
  earnedAt: string
}

export default function AchievementsPage() {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [allBadges, setAllBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then(r => r.json()),
    ]).then(([dash]) => {
      setBadges(dash.badges || [])
      setLoading(false)
    })
  }, [])

  const earnedIds = new Set(badges.map(b => b.badge.name))

  const allBadgesList = [
    { name: 'First Step', description: 'Complete your first quiz', iconEmoji: '🎯', color: '#3B82F6', xpReward: 50 },
    { name: 'Perfect Score', description: 'Score 100% on any quiz', iconEmoji: '⭐', color: '#F59E0B', xpReward: 150 },
    { name: 'Knowledge Seeker', description: 'Complete 5 learning modules', iconEmoji: '📚', color: '#8B5CF6', xpReward: 200 },
    { name: 'Disaster Expert', description: 'Complete all 8 disaster modules', iconEmoji: '🏆', color: '#EF4444', xpReward: 500 },
    { name: 'Drill Ready', description: 'Complete your first virtual drill', iconEmoji: '🚨', color: '#F97316', xpReward: 75 },
    { name: 'Week Warrior', description: 'Maintain a 7-day learning streak', iconEmoji: '🔥', color: '#EF4444', xpReward: 100 },
    { name: 'Simulation Master', description: 'Complete all 8 disaster simulations', iconEmoji: '🎖️', color: '#10B981', xpReward: 400 },
    { name: 'Community Hero', description: 'Rank in the top 10 on the leaderboard', iconEmoji: '🦸', color: '#6366F1', xpReward: 300 },
  ]

  if (loading) return (
    <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Achievements & Badges</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {badges.length}/{allBadgesList.length} badges earned
        </p>
      </div>

      {/* Earned badges */}
      {badges.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Earned Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((ub, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 text-center card-hover"
                style={{ borderTop: `3px solid ${ub.badge.color}` }}
              >
                <div className="text-5xl mb-3">{ub.badge.iconEmoji}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{ub.badge.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{ub.badge.description}</p>
                <span className="text-xs font-semibold text-amber-600">+{ub.badge.xpReward} XP</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All badges */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">All Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadgesList.map((badge, i) => {
            const isEarned = earnedIds.has(badge.name)
            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-5 text-center border-2 ${isEarned ? 'border-transparent glass-card' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'}`}
              >
                <div className={`text-5xl mb-3 ${isEarned ? '' : 'grayscale opacity-40'}`}>{badge.iconEmoji}</div>
                <h3 className={`font-bold text-sm mb-1 ${isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2">{badge.description}</p>
                <span className={`text-xs font-semibold ${isEarned ? 'text-amber-600' : 'text-slate-400'}`}>+{badge.xpReward} XP</span>
                {!isEarned && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">Locked</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
