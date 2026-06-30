'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Plus, Loader2, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { alertSchema, type AlertInput } from '@/lib/validations'
import { formatDate, getPriorityColor } from '@/lib/utils'
import { ALERT_CATEGORY_LABELS } from '@/lib/constants'

interface Alert {
  id: string
  title: string
  description: string
  priority: string
  category: string
  isActive: boolean
  publishedAt: string
}

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AlertInput>({
    resolver: zodResolver(alertSchema),
    defaultValues: { priority: 'MEDIUM', category: 'GENERAL' },
  })

  useEffect(() => {
    fetch('/api/alerts?activeOnly=false')
      .then(r => r.json())
      .then(d => { setAlerts(d); setLoading(false) })
  }, [])

  const onSubmit = async (data: AlertInput) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const alert = await res.json()
      setAlerts(prev => [alert, ...prev])
      toast.success('Alert published successfully! Students will be notified.')
      reset()
      setShowForm(false)
    } catch {
      toast.error('Failed to publish alert')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Emergency Alerts</h1>
          <p className="text-slate-500">Publish and manage emergency notifications for students.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> New Alert
        </button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6 border-l-4 border-rose-500"
        >
          <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" /> Publish New Alert
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alert Title *</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Earthquake Drill on Friday"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority *</label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                >
                  <option value="LOW">🔵 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                >
                  {Object.entries(ALERT_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description *</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Detailed alert message for students and staff..."
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white resize-none"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-semibold disabled:opacity-60 hover:shadow-lg transition-all"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                {submitting ? 'Publishing...' : 'Publish Alert'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Alert list */}
      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(alert.priority)}`} />
                    <h3 className="font-bold text-slate-900 dark:text-white">{alert.title}</h3>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${alert.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {alert.isActive ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className={`px-2 py-0.5 rounded-full text-white ${getPriorityColor(alert.priority)}`}>{alert.priority}</span>
                    <span>{ALERT_CATEGORY_LABELS[alert.category] || alert.category}</span>
                    <span>•</span>
                    <span>{formatDate(alert.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No alerts published yet. Click "New Alert" to create one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
