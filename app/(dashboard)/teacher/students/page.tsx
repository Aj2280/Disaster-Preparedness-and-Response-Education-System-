'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users } from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  createdAt: string
  studentProfile: { xpPoints: number; level: number; avgScore: number; totalQuizzes: number; drillsCompleted: number } | null
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setStudents(d.students || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Students</h1>
        <p className="text-slate-500">{students.length} students enrolled</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <div className="col-span-2">Student</div>
            <div className="text-center">Level</div>
            <div className="text-center">Quizzes</div>
            <div className="text-right">Avg Score</div>
          </div>
          {filtered.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-5 gap-4 px-6 py-4 border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {student.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{student.name}</p>
                  <p className="text-xs text-slate-400 truncate">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 text-xs font-semibold">
                  Lv {student.studentProfile?.level || 1}
                </span>
              </div>
              <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400">
                {student.studentProfile?.totalQuizzes || 0}
              </div>
              <div className="flex items-center justify-end">
                <span className={`text-sm font-bold ${(student.studentProfile?.avgScore || 0) >= 70 ? 'text-green-600' : 'text-amber-500'}`}>
                  {Math.round(student.studentProfile?.avgScore || 0)}%
                </span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{search ? `No students matching "${search}"` : 'No students yet'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
