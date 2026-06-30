'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, AlertCircle } from 'lucide-react'

interface Contact {
  id: string
  name: string
  role: string
  phone: string
  altPhone: string | null
  email: string | null
  isNational: boolean
  priority: number
}

const roleEmojis: Record<string, string> = {
  'Emergency Services': '🚨',
  'Police Emergency': '👮',
  'Fire Emergency': '🚒',
  'Medical Emergency': '🚑',
  'Disaster Management': '🏛️',
  'Child Emergency': '👦',
  'Women Safety': '👩',
  'Rail Accident': '🚂',
  'School Emergency': '🏫',
  'Medical': '🏥',
}

export default function AdminEmergencyContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/emergency-contacts')
      .then(r => r.json())
      .then(d => { setContacts(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const national = contacts.filter(c => c.isNational)
  const school = contacts.filter(c => !c.isNational)

  if (loading) return (
    <div className="page-container grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Emergency Contacts Database</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Viewing all emergency contacts registered in the system.
        </p>
      </div>

      {/* National */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          🇮🇳 National Emergency Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {national.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 text-center card-hover group"
            >
              <div className="text-3xl mb-2">{roleEmojis[contact.role] || '📞'}</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{contact.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{contact.role}</p>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 transition-colors">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="text-lg font-black text-red-600">{contact.phone}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* School */}
      {school.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            🏫 School Specific Contacts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {school.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 text-center card-hover group"
              >
                <div className="text-3xl mb-2">{roleEmojis[contact.role] || '📞'}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{contact.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{contact.role}</p>
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">{contact.phone}</span>
                </div>
                {contact.email && (
                  <p className="text-xs text-slate-400 mt-2">{contact.email}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
