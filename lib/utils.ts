import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDateOnly(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getXPForNextLevel(level: number): number {
  return level * 200
}

export function getLevelFromXP(xp: number): number {
  let level = 1
  let xpNeeded = 200
  let totalXP = 0
  while (totalXP + xpNeeded <= xp) {
    totalXP += xpNeeded
    level++
    xpNeeded = level * 200
  }
  return level
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXP(xp)
  let totalForCurrentLevel = 0
  for (let i = 1; i < level; i++) totalForCurrentLevel += i * 200
  const xpInCurrentLevel = xp - totalForCurrentLevel
  const xpNeededForNext = level * 200
  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNext,
    percentage: Math.round((xpInCurrentLevel / xpNeededForNext) * 100),
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-500'
  if (score >= 70) return 'text-blue-500'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}

export function getScoreBadge(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Average'
  return 'Needs Improvement'
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return 'bg-red-500'
    case 'HIGH': return 'bg-orange-500'
    case 'MEDIUM': return 'bg-amber-500'
    case 'LOW': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}

export function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `CERT-${timestamp}-${random}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
