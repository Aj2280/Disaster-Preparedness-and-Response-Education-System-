import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = session.user
    const role = user.role

    if (role === 'STUDENT') {
      const [profile, moduleProgress, recentResults, badges, alerts, schedules] = await Promise.all([
        prisma.studentProfile.findUnique({ where: { userId: user.id } }),
        prisma.moduleProgress.findMany({ where: { userId: user.id }, include: { module: { select: { title: true, iconEmoji: true, disasterType: true } } } }),
        prisma.quizResult.findMany({ where: { userId: user.id }, include: { quiz: { include: { module: { select: { title: true, iconEmoji: true } } } } }, orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, take: 6 }),
        prisma.emergencyAlert.findMany({ where: { isActive: true, OR: [{ schoolId: user.schoolId || undefined }, { schoolId: null }] }, orderBy: { publishedAt: 'desc' }, take: 3 }),
        prisma.eventSchedule.findMany({ where: { schoolId: user.schoolId || undefined, date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 3 }),
      ])

      const completedModules = moduleProgress.filter(p => p.completed).length
      const totalModules = 8

      return NextResponse.json({
        role,
        profile,
        stats: {
          xpPoints: profile?.xpPoints || 0,
          level: profile?.level || 1,
          completedModules,
          totalModules,
          completionPercentage: Math.round((completedModules / totalModules) * 100),
          totalQuizzes: profile?.totalQuizzes || 0,
          avgScore: profile?.avgScore || 0,
          drillsCompleted: profile?.drillsCompleted || 0,
        },
        moduleProgress,
        recentResults,
        badges,
        alerts,
        schedules,
      })
    }

    if (role === 'TEACHER') {
      const [students, modules, recentResults] = await Promise.all([
        prisma.user.findMany({ where: { schoolId: user.schoolId || undefined, role: 'STUDENT' }, include: { studentProfile: true }, take: 10 }),
        prisma.module.findMany({ where: { isPublished: true }, select: { id: true, title: true, disasterType: true, iconEmoji: true } }),
        prisma.quizResult.findMany({ include: { user: { select: { name: true } }, quiz: { include: { module: { select: { title: true } } } } }, orderBy: { createdAt: 'desc' }, take: 10 }),
      ])

      return NextResponse.json({ role, stats: { totalStudents: students.length, modules: modules.length }, students, modules, recentResults })
    }

    if (role === 'ADMIN') {
      const [schools, users, alerts, modules, totalContacts] = await Promise.all([
        prisma.school.findMany({ include: { _count: { select: { users: true } } } }),
        prisma.user.findMany({ include: { school: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 20 }),
        prisma.emergencyAlert.findMany({ orderBy: { publishedAt: 'desc' }, take: 10 }),
        prisma.module.findMany(),
        prisma.emergencyContact.count(),
      ])

      const totalStudents = users.filter(u => u.role === 'STUDENT').length
      const totalTeachers = users.filter(u => u.role === 'TEACHER').length

      // Build analytics data
      const quizResults = await prisma.quizResult.findMany({ include: { quiz: true } })
      const avgScore = quizResults.length ? Math.round(quizResults.reduce((s, r) => s + r.score, 0) / quizResults.length) : 0

      return NextResponse.json({
        role,
        stats: { totalSchools: schools.length, totalStudents, totalTeachers, totalAlerts: alerts.filter(a => a.isActive).length, avgScore, totalModules: modules.length, totalContacts },
        schools,
        users,
        alerts,
        modules,
      })
    }

    return NextResponse.json({ error: 'Unknown role' }, { status: 400 })
  } catch (error) {
    console.error('Dashboard GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
