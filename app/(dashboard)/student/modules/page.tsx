'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, BookOpen, CheckCircle, Clock, ChevronRight } from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  disasterType: string
  iconEmoji: string
  color: string
  isCompleted: boolean
  quizzes: Array<{ id: string; title: string }>
  _count?: { quizzes: number }
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/modules')
      .then(r => r.json())
      .then(d => { setModules(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = modules.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.disasterType.toLowerCase().includes(search.toLowerCase())
  )

  const completed = modules.filter(m => m.isCompleted).length

  if (loading) return (
    <div className="page-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Learning Modules</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {completed}/{modules.length} modules completed
        </p>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${modules.length ? (completed / modules.length) * 100 : 0}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search disaster types..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((module, i) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/student/modules/${module.id}`}>
              <div className="glass-card rounded-2xl p-6 card-hover group h-full relative overflow-hidden">
                {/* Background accent */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8 transition-all group-hover:opacity-20"
                  style={{ background: module.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{module.iconEmoji}</span>
                  {module.isCompleted ? (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-medium">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {module.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {module._count?.quizzes || module.quizzes?.length || 1} quiz
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                    Start <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No modules found for "{search}"</p>
        </div>
      )}
    </div>
  )
}
