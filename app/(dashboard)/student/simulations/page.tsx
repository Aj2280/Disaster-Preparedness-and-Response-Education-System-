'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DISASTER_TYPES } from '@/lib/constants'

interface Scenario {
  id: string
  disasterType: string
  title: string
  description: string
  steps: Array<{
    id: string
    order: number
    situation: string
    optionA: string
    optionB: string
    optionC: string
    correctOption: string
  }>
}

export default function SimulationsPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/simulations')
      .then(r => r.json())
      .then(d => { setScenarios(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Virtual Disaster Drills</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Experience realistic disaster scenarios and practice life-saving decisions in a safe environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {scenarios.map((scenario, i) => {
          const disasterInfo = DISASTER_TYPES.find(d => d.type === scenario.disasterType)
          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link href={`/student/simulations/${scenario.id}`}>
                <div
                  className="glass-card rounded-2xl p-6 card-hover group h-full relative overflow-hidden cursor-pointer"
                  style={{ borderTop: `3px solid ${disasterInfo?.color || '#3B82F6'}` }}
                >
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-6 translate-x-6 group-hover:opacity-20 transition-opacity"
                    style={{ background: disasterInfo?.color || '#3B82F6' }}
                  />
                  <div className="text-4xl mb-3">{disasterInfo?.emoji || '⚠️'}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                    {scenario.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {scenario.steps.length} decisions
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Start Drill →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
