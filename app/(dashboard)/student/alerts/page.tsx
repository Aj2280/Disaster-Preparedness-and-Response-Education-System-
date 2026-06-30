'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, AlertTriangle, Info, Zap, X } from 'lucide-react'
import { formatDate, getPriorityColor } from '@/lib/utils'
import { ALERT_CATEGORY_LABELS } from '@/lib/constants'

interface Alert {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
  publishedAt: string
  isActive: boolean
}

const priorityIcons: Record<string, React.ReactNode> = {
  CRITICAL: <Zap className="w-5 h-5" />,
  HIGH: <AlertTriangle className="w-5 h-5" />,
  MEDIUM: <Bell className="w-5 h-5" />,
  LOW: <Info className="w-5 h-5" />,
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    fetch('/api/alerts?activeOnly=false')
      .then(r => r.json())
      .then(d => { setAlerts(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.priority === filter)

  if (loading) return (
    <div className="page-container space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Emergency Alerts</h1>
        <p className="text-slate-500 dark:text-slate-400">Stay informed about emergency notifications and drills.</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === p ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((alert, i) => {
          const borderColor = {
            CRITICAL: 'border-red-500',
            HIGH: 'border-orange-500',
            MEDIUM: 'border-amber-400',
            LOW: 'border-blue-400',
          }[alert.priority] || 'border-slate-200'

          const bgColor = {
            CRITICAL: 'bg-red-50 dark:bg-red-950/20',
            HIGH: 'bg-orange-50 dark:bg-orange-950/20',
            MEDIUM: 'bg-amber-50 dark:bg-amber-950/20',
            LOW: 'bg-blue-50 dark:bg-blue-950/20',
          }[alert.priority] || ''

          const iconColor = {
            CRITICAL: 'text-red-500',
            HIGH: 'text-orange-500',
            MEDIUM: 'text-amber-500',
            LOW: 'text-blue-500',
          }[alert.priority] || 'text-slate-500'

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border-l-4 ${borderColor} ${bgColor} p-5`}
            >
              <div className="flex items-start gap-4">
                <div className={iconColor}>
                  {priorityIcons[alert.priority]}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{alert.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      {!alert.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-500">Expired</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{alert.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{ALERT_CATEGORY_LABELS[alert.category] || alert.category}</span>
                    <span>•</span>
                    <span>{formatDate(alert.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No alerts to display.</p>
          </div>
        )}
      </div>
    </div>
  )
}
