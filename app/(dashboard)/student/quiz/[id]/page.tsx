'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  order: number
}

interface Quiz {
  id: string
  title: string
  timeLimit: number
  passingScore: number
  questions: Question[]
  module: { title: string; disasterType: string }
}

interface QuizResult {
  id: string
  score: number
  totalQ: number
  correctQ: number
  passed: boolean
  questionResults: Array<{
    questionId: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
  }>
}

const optionLabels = ['A', 'B', 'C', 'D'] as const
const optionColors = {
  idle: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30',
  selected: 'bg-blue-50 dark:bg-blue-950/30 border-blue-500',
  correct: 'bg-green-50 dark:bg-green-950/30 border-green-500',
  wrong: 'bg-red-50 dark:bg-red-950/30 border-red-500',
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [certificate, setCertificate] = useState<{ certificateNo: string; title: string } | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    fetch(`/api/quizzes/${params.id}`)
      .then(r => r.json())
      .then(d => {
        setQuiz(d)
        setTimeLeft(d.timeLimit * 60)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  // Timer
  useEffect(() => {
    if (!quiz || result) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [quiz, result])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option)
  }

  const handleNext = () => {
    if (!quiz || !selectedAnswer) return
    setAnswers(prev => ({ ...prev, [quiz.questions[currentQ].id]: selectedAnswer }))
    setSelectedAnswer(null)
    
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!quiz || submitting) return
    setSubmitting(true)

    const finalAnswers = { ...answers }
    if (selectedAnswer) finalAnswers[quiz.questions[currentQ].id] = selectedAnswer

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: finalAnswers,
          timeTaken: Math.round((Date.now() - startTime) / 1000),
        }),
      })
      const data = await res.json()
      setResult(data.result)
      setCertificate(data.certificate)
      setXpEarned(data.xpEarned)
    } catch {
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="page-container flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )

  if (!quiz) return (
    <div className="page-container text-center py-20">
      <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <p className="text-slate-600 dark:text-slate-400">Quiz not found</p>
    </div>
  )

  // Results screen
  if (result) {
    return (
      <div className="page-container max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 text-center"
        >
          <div className="text-6xl mb-4">{result.passed ? '🎉' : '😔'}</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {result.passed ? 'You passed the quiz!' : `You need ${quiz.passingScore}% to pass.`}
          </p>

          <div className={`text-6xl font-black mb-2 ${result.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
            {result.score}%
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {result.correctQ}/{result.totalQ} correct answers
          </p>

          {xpEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-6"
            >
              ⚡ +{xpEarned} XP earned!
            </motion.div>
          )}

          {certificate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-6"
            >
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-800 dark:text-blue-200">Certificate Earned!</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{certificate.title}</p>
              <p className="text-xs text-blue-500 font-mono mt-1">{certificate.certificateNo}</p>
              <Link href="/student/certificates" className="text-xs text-blue-600 hover:underline mt-2 block">
                View Certificate →
              </Link>
            </motion.div>
          )}

          {/* Question review */}
          <div className="text-left space-y-4 mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white">Review Answers</h3>
            {result.questionResults?.map((qr, i) => (
              <div key={qr.questionId} className={`p-4 rounded-xl border-2 ${qr.isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:bg-red-950/20'}`}>
                <div className="flex items-start gap-3">
                  {qr.isCorrect
                    ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  }
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">
                      Q{i + 1}: {quiz.questions[i]?.text}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-semibold">Explanation: </span>{qr.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/student/modules" className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Back to Modules
            </Link>
            <Link href="/student" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const question = quiz.questions[currentQ]
  const options = [
    { label: 'A', text: question.optionA },
    { label: 'B', text: question.optionB },
    { label: 'C', text: question.optionC },
    { label: 'D', text: question.optionD },
  ]

  const getOptionStyle = (label: string) => {
    return label === selectedAnswer ? optionColors.selected : optionColors.idle
  }

  const progress = ((currentQ) / quiz.questions.length) * 100

  return (
    <div className="page-container max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">{quiz.title}</h2>
          <p className="text-xs text-slate-500">Question {currentQ + 1} of {quiz.questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${(currentQ / quiz.questions.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="glass-card rounded-2xl p-6 mb-4"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
            {question.text}
          </h3>

          <div className="space-y-3">
            {options.map(option => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.label)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(option.label)}`}
              >
                <span className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                  selectedAnswer === option.label ? 'bg-blue-600 border-blue-600 text-white' : 'border-current'
                }`}>
                  {option.label}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">{option.text}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Button */}
      <div className="flex gap-3">
        <button
          onClick={handleNext}
          disabled={!selectedAnswer || submitting}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
          ) : currentQ < quiz.questions.length - 1 ? (
            <>Next Question <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>Finish Quiz <Trophy className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}
