'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

interface Schedule {
  id: string
  title: string
  description: string | null
  eventType: string
  disasterType: string | null
  date: string
  location: string | null
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'DRILL',
    disasterType: '',
    date: '',
    location: ''
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedule')
      if (res.ok) {
        const data = await res.json()
        setSchedules(data)
      }
    } catch (error) {
      console.error('Failed to fetch schedules', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        await fetchSchedules()
        setIsAdding(false)
        setFormData({
          title: '',
          description: '',
          eventType: 'DRILL',
          disasterType: '',
          date: '',
          location: ''
        })
      } else {
        const errorData = await res.json()
        alert('Failed to save schedule: ' + (errorData.error || 'Unknown error') + '\n' + (errorData.details || ''))
      }
    } catch (error: any) {
      console.error('Failed to create schedule', error)
      alert('Network error: ' + error.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule Drills & Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage upcoming preparedness drills and deadlines</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Schedule Event</>}
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={e => setFormData({...formData, eventType: e.target.value})}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-transparent"
                >
                  <option value="DRILL">Mock Drill</option>
                  <option value="WEBINAR">Webinar / Live Class</option>
                  <option value="DEADLINE">Module Deadline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Disaster Category</label>
                <select
                  value={formData.disasterType}
                  onChange={e => setFormData({...formData, disasterType: e.target.value})}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-transparent"
                >
                  <option value="">General Readiness / None</option>
                  <option value="EARTHQUAKE">Earthquake</option>
                  <option value="FIRE">Fire</option>
                  <option value="FLOOD">Flood</option>
                  <option value="CYCLONE">Cyclone</option>
                  <option value="LANDSLIDE">Landslide</option>
                  <option value="HEAT_WAVE">Heat Wave</option>
                  <option value="LIGHTNING">Lightning</option>
                  <option value="PANDEMIC">Pandemic</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading schedules...</div>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {schedule.title}
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {schedule.eventType}
                    </span>
                  </h3>
                  {schedule.description && (
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{schedule.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {format(new Date(schedule.date), 'PPP p')}
                    </div>
                    {schedule.disasterType && (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        {schedule.disasterType}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {schedules.length === 0 && !isAdding && (
            <div className="text-center py-12 text-slate-500 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No events scheduled yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
