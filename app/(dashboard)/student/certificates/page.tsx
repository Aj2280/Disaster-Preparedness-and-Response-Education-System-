'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Download } from 'lucide-react'
import { formatDateOnly } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface Certificate {
  id: string
  title: string
  description: string
  moduleType: string
  certificateNo: string
  issuedAt: string
}

export default function CertificatesPage() {
  const { data: session } = useSession()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/certificates')
      .then(r => r.json())
      .then(d => { setCertificates(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const downloadCertificate = (cert: Certificate) => {
    const content = `
DisasterPrep EDU
Certificate of Achievement

This is to certify that
${session?.user?.name}

has successfully completed

${cert.title}

${cert.description}

Certificate No: ${cert.certificateNo}
Issue Date: ${formatDateOnly(cert.issuedAt)}

DisasterPrep EDU — Empowering Schools with Life-Saving Knowledge
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cert.certificateNo}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="page-container grid grid-cols-1 md:grid-cols-2 gap-5">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Certificates</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20">
          <Award className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No certificates yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Complete a module quiz with 70%+ to earn your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-6"
            >
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-200/30 dark:bg-amber-800/20 -translate-y-10 translate-x-10" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => downloadCertificate(cert)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{cert.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{cert.description}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-700 dark:text-amber-400">{cert.certificateNo}</span>
                <span className="text-slate-500">{formatDateOnly(cert.issuedAt)}</span>
              </div>

              {/* Seal */}
              <div className="absolute bottom-4 right-6 opacity-10">
                <div className="w-16 h-16 rounded-full border-4 border-amber-600 flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
