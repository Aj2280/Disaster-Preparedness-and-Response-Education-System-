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

export default function EmergencyContactsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Emergency Contacts</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Keep these numbers saved. In an emergency, every second counts.
        </p>
      </div>

      {/* National */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          🇮🇳 National Emergency Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {national.map((contact, i) => (
            <motion.a
              key={contact.id}
              href={`tel:${contact.phone}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 text-center card-hover group cursor-pointer"
            >
              <div className="text-3xl mb-2">{roleEmojis[contact.role] || '📞'}</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{contact.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{contact.role}</p>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-colors">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="text-lg font-black text-red-600">{contact.phone}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* School */}
      {school.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            🏫 School Emergency Contacts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {school.map((contact, i) => (
              <motion.a
                key={contact.id}
                href={`tel:${contact.phone}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 text-center card-hover group cursor-pointer"
              >
                <div className="text-3xl mb-2">{roleEmojis[contact.role] || '📞'}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{contact.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{contact.role}</p>
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 group-hover:bg-blue-100 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">{contact.phone}</span>
                </div>
                {contact.email && (
                  <p className="text-xs text-slate-400 mt-2">{contact.email}</p>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Safety reminder */}
      <div className="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Save these numbers now.</strong> During a disaster, internet may not be available. Memorize key numbers like 112 (National Emergency) and 108 (Ambulance).
        </p>
      </div>
    </div>
  )
}
