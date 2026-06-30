'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { DISASTER_TYPES } from '@/lib/constants'

interface Module {
  id: string
  title: string
  disasterType: string
  iconEmoji: string
  color: string
  quizzes: Array<{ id: string; title: string; _count: { questions: number } }>
}

export default function TeacherModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/modules')
      .then(r => r.json())
      .then(d => { setModules(d); setLoading(false) })
  }, [])

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Learning Modules</h1>
        <p className="text-slate-500">{modules.length} disaster preparedness modules available</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, i) => {
            const info = DISASTER_TYPES.find(d => d.type === module.disasterType)
            return (
              <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/student/modules/${module.id}`} target="_blank">
                  <div className="glass-card rounded-2xl p-5 card-hover cursor-pointer" style={{ borderTop: `3px solid ${module.color}` }}>
                    <div className="text-4xl mb-3">{module.iconEmoji}</div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{module.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <BookOpen className="w-3 h-3" />
                      {module.quizzes?.length || 1} quiz
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
