'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DISASTER_TYPES } from '@/lib/constants'

interface Step {
  id: string
  order: number
  situation: string
  optionA: string
  optionB: string
  optionC: string
  correctOption: string
  explanationA: string
  explanationB: string
  explanationC: string
}

interface Scenario {
  id: string
  disasterType: string
  title: string
  description: string
  steps: Step[]
}

export default function SimulationRunPage() {
  const params = useParams()
  const router = useRouter()

  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/simulations')
      .then(r => r.json())
      .then((scenarios: Scenario[]) => {
        const found = scenarios.find(s => s.id === params.id)
        setScenario(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSelect = (option: 'A' | 'B' | 'C') => {
    if (revealed) return
    setSelectedOption(option)
  }

  const handleReveal = () => {
    if (!selectedOption || !scenario) return
    const step = scenario.steps[currentStep]
    setRevealed(true)
    if (selectedOption === step.correctOption) {
      setCorrectCount(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (!scenario) return
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setSelectedOption(null)
      setRevealed(false)
    } else {
      finishSimulation()
    }
  }

  const finishSimulation = async () => {
    if (!scenario) return
    setSubmitting(true)

    const totalSteps = scenario.steps.length
    const score = Math.round((correctCount / totalSteps) * 100)

    try {
      await fetch('/api/simulations/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          score,
          totalSteps,
          correctSteps: correctCount,
        }),
      })
      toast.success('+75 XP earned for completing the drill! 🎖️')
    } catch {
      // silently fail — still show result
    } finally {
      setSubmitting(false)
      setCompleted(true)
    }
  }

  if (loading) return (
    <div className="page-container flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )

  if (!scenario) return (
    <div className="page-container text-center py-20">
      <p className="text-slate-500">Simulation not found</p>
      <Link href="/student/simulations" className="text-blue-600 hover:underline mt-4 block">← Back</Link>
    </div>
  )

  const disasterInfo = DISASTER_TYPES.find(d => d.type === scenario.disasterType)
  const step = scenario.steps[currentStep]
  const explanationMap: Record<string, string> = { A: step?.explanationA, B: step?.explanationB, C: step?.explanationC }

  // Completed screen
  if (completed) {
    const totalSteps = scenario.steps.length
    const score = Math.round((correctCount / totalSteps) * 100)
    return (
      <div className="page-container max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 text-center"
        >
          <div className="text-6xl mb-4">{score >= 70 ? '🎖️' : '💪'}</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Drill Complete!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{scenario.title}</p>

          <div className={`text-5xl font-black mb-2 ${score >= 70 ? 'text-green-600' : 'text-amber-500'}`}>
            {score}%
          </div>
          <p className="text-slate-500 mb-2">{correctCount}/{totalSteps} correct decisions</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-8">
            ⚡ +75 XP earned!
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            {score >= 70
              ? 'Excellent decisions! You demonstrated strong disaster awareness. Keep practicing to stay sharp.'
              : 'Good effort! Review the module content and retry to improve your score. Every practice session builds life-saving skills.'}
          </p>

          <div className="flex gap-3 justify-center">
            <Link href="/student/simulations" className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors">
              All Drills
            </Link>
            <button
              onClick={() => { setCurrentStep(0); setSelectedOption(null); setRevealed(false); setCorrectCount(0); setCompleted(false) }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg transition-all"
            >
              Retry Drill
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/student/simulations" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
        <ArrowLeft className="w-4 h-4" /> All Drills
      </Link>

      {/* Header */}
      <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4">
        <span className="text-3xl">{disasterInfo?.emoji}</span>
        <div className="flex-1">
          <h2 className="font-bold text-slate-900 dark:text-white">{scenario.title}</h2>
          <p className="text-xs text-slate-500">Decision {currentStep + 1} of {scenario.steps.length}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">{correctCount}</div>
          <div className="text-xs text-slate-400">correct</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${((currentStep + (revealed ? 1 : 0)) / scenario.steps.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
        />
      </div>

      {/* Situation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          {/* Alert box */}
          <div
            className="rounded-2xl p-5 mb-4 border-l-4"
            style={{ borderColor: disasterInfo?.color || '#3B82F6', background: `${disasterInfo?.color}10` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🚨</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">{step.situation}</p>
            </div>
          </div>

          {/* Options */}
          {(['A', 'B', 'C'] as const).map(optLabel => {
            const optText = optLabel === 'A' ? step.optionA : optLabel === 'B' ? step.optionB : step.optionC
            const isSelected = selectedOption === optLabel
            const isCorrect = step.correctOption === optLabel
            const explanation = explanationMap[optLabel]

            let optStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400'
            if (isSelected && !revealed) optStyle = 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
            if (revealed && isCorrect) optStyle = 'border-green-500 bg-green-50 dark:bg-green-950/30'
            if (revealed && isSelected && !isCorrect) optStyle = 'border-red-500 bg-red-50 dark:bg-red-950/30'
            if (revealed && !isSelected && !isCorrect) optStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-60'

            return (
              <button
                key={optLabel}
                onClick={() => handleSelect(optLabel)}
                disabled={revealed}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all ${optStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    isSelected && !revealed ? 'bg-blue-600 border-blue-600 text-white' : 'border-current text-slate-600 dark:text-slate-400'
                  }`}>
                    {optLabel}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{optText}</p>
                    {revealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect
                            ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          }
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!selectedOption}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm disabled:opacity-40 hover:shadow-lg transition-all"
          >
            Confirm Decision
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> :
              currentStep < scenario.steps.length - 1
                ? 'Next Situation →'
                : <><Trophy className="w-4 h-4" /> Complete Drill</>
            }
          </button>
        )}
      </div>
    </div>
  )
}
