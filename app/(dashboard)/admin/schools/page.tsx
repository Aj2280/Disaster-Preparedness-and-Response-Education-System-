'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { School, MapPin, Phone } from 'lucide-react'

interface SchoolData {
  id: string
  name: string
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  _count: { users: number }
}

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setSchools(d.schools || []); setLoading(false) })
  }, [])

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Schools</h1>
        <p className="text-slate-500">{schools.length} registered schools</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schools.map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg">
                <School className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">{school.name}</h3>
              <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                {(school.city || school.state) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {[school.city, school.state].filter(Boolean).join(', ')}
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    {school.phone}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between text-sm">
                <span className="text-slate-400">{school._count?.users || 0} users</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">Active</span>
              </div>
            </motion.div>
          ))}
          {schools.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-400">No schools found</div>
          )}
        </div>
      )}
    </div>
  )
}
