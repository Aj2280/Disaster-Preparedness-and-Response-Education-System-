'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Shield, GraduationCap } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  school: { name: string } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false) })
  }, [])

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const counts = {
    STUDENT: users.filter(u => u.role === 'STUDENT').length,
    TEACHER: users.filter(u => u.role === 'TEACHER').length,
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
        <p className="text-slate-500">{users.length} total users registered</p>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { role: 'STUDENT', label: 'Students', icon: GraduationCap, color: 'blue', count: counts.STUDENT },
          { role: 'TEACHER', label: 'Teachers', icon: Users, color: 'violet', count: counts.TEACHER },
          { role: 'ADMIN', label: 'Admins', icon: Shield, color: 'rose', count: counts.ADMIN },
        ].map(item => (
          <button
            key={item.role}
            onClick={() => setRoleFilter(roleFilter === item.role ? 'ALL' : item.role)}
            className={`stat-card text-left ${roleFilter === item.role ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            <item.icon className={`w-6 h-6 text-${item.color}-600 mb-2`} />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{item.count}</div>
            <div className="text-xs text-slate-500">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <div className="col-span-2">User</div>
            <div>Role</div>
            <div className="text-right">School</div>
          </div>
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-4 gap-4 px-6 py-4 border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  user.role === 'ADMIN' ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
                  user.role === 'TEACHER' ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                  'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  {user.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  user.role === 'ADMIN' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                  user.role === 'TEACHER' ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-end text-xs text-slate-400 truncate">
                {user.school?.name || '—'}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No users found</div>
          )}
        </div>
      )}
    </div>
  )
}
