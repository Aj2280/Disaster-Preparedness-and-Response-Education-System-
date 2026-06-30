'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, BookOpen, AlertTriangle, Loader2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Module {
  id: string
  title: string
  description: string
  disasterType: string
  iconEmoji: string
  color: string
  overview: string
  causes: string
  warningSigns: string
  beforeDisaster: string
  duringDisaster: string
  afterDisaster: string
  emergencyChecklist: string
  safetyTips: string
  quizzes: Array<{ id: string; title: string; _count: { questions: number } }>
  userProgress: { completed: boolean } | null
}

const sections = [
  { key: 'overview', label: '📋 Overview', icon: '📋' },
  { key: 'causes', label: '🔬 Causes', icon: '🔬' },
  { key: 'warningSigns', label: '⚠️ Warning Signs', icon: '⚠️' },
  { key: 'beforeDisaster', label: '✅ Before', icon: '✅' },
  { key: 'duringDisaster', label: '🚨 During', icon: '🚨' },
  { key: 'afterDisaster', label: '🔄 After', icon: '🔄' },
  { key: 'emergencyChecklist', label: '📝 Checklist', icon: '📝' },
  { key: 'safetyTips', label: '💡 Safety Tips', icon: '💡' },
]

export default function ModuleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetch(`/api/modules/${params.id}`)
      .then(r => r.json())
      .then(d => { setModule(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await fetch(`/api/modules/${params.id}`, { method: 'PATCH' })
      toast.success('Module marked as complete! +100 XP earned! 🎉')
      setModule(prev => prev ? { ...prev, userProgress: { completed: true } } : prev)
    } catch {
      toast.error('Failed to mark complete')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return (
    <div className="page-container">
      <div className="skeleton h-8 w-48 mb-6" />
      <div className="skeleton h-64 rounded-2xl mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
      </div>
    </div>
  )

  if (!module) return (
    <div className="page-container text-center py-20">
      <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Module not found</h2>
      <Link href="/student/modules" className="text-blue-600 hover:underline">← Back to modules</Link>
    </div>
  )

  const sectionContent = {
    overview: module.overview,
    causes: module.causes,
    warningSigns: module.warningSigns,
    beforeDisaster: module.beforeDisaster,
    duringDisaster: module.duringDisaster,
    afterDisaster: module.afterDisaster,
    emergencyChecklist: module.emergencyChecklist,
    safetyTips: module.safetyTips,
  }

  return (
    <div className="page-container">
      {/* Back */}
      <Link href="/student/modules" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Modules
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden"
        style={{ borderTop: `4px solid ${module.color}` }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-16 translate-x-16"
          style={{ background: module.color }}
        />
        <div className="flex items-start gap-4">
          <span className="text-6xl">{module.iconEmoji}</span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{module.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{module.description}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {module.userProgress?.completed ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Completed
                </span>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Mark as Complete (+100 XP)
                </button>
              )}
              {(module.quizzes || []).map(quiz => (
                <Link key={quiz.id} href={`/student/quiz/${quiz.id}`}>
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
                    <BookOpen className="w-4 h-4" /> Take Quiz ({quiz._count?.questions || 0} questions)
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Nav */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-4 sticky top-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Sections</p>
            <nav className="space-y-1">
              {sections.map(sec => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-all ${
                    activeSection === sec.key
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{sec.icon}</span>
                  {sec.label.replace(/^.+ /, '')}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Section Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {sections.find(s => s.key === activeSection)?.label}
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {sectionContent[activeSection as keyof typeof sectionContent]?.split('\n').map((line, i) => (
              <p key={i} className={`text-slate-600 dark:text-slate-300 leading-relaxed ${line.startsWith('•') || line.startsWith('✅') || line.startsWith('💡') ? 'font-medium' : ''}`}>
                {line}
              </p>
            ))}
          </div>

          {/* Navigation between sections */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            {sections.findIndex(s => s.key === activeSection) > 0 && (
              <button
                onClick={() => setActiveSection(sections[sections.findIndex(s => s.key === activeSection) - 1].key)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ← Previous
              </button>
            )}
            {sections.findIndex(s => s.key === activeSection) < sections.length - 1 && (
              <button
                onClick={() => setActiveSection(sections[sections.findIndex(s => s.key === activeSection) + 1].key)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-auto"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
