import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Time series data for charts (last 7 days quiz scores)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const results = await prisma.quizResult.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, score: true, passed: true },
      orderBy: { createdAt: 'asc' },
    })

    // Group by day
    const dailyData: Record<string, { date: string; avgScore: number; attempts: number; passed: number }> = {}
    results.forEach(r => {
      const date = r.createdAt.toISOString().slice(0, 10)
      if (!dailyData[date]) dailyData[date] = { date, avgScore: 0, attempts: 0, passed: 0 }
      dailyData[date].attempts++
      dailyData[date].avgScore += r.score
      if (r.passed) dailyData[date].passed++
    })

    const chartData = Object.values(dailyData).map(d => ({
      ...d,
      avgScore: Math.round(d.avgScore / d.attempts),
    }))

    // Disaster module completion rates
    const moduleProgress = await prisma.moduleProgress.groupBy({
      by: ['moduleId'],
      _count: { _all: true },
      where: { completed: true },
    })
    const modules = await prisma.module.findMany({ select: { id: true, title: true, iconEmoji: true } })
    const moduleCompletion = modules.map(m => {
      const found = moduleProgress.find(p => p.moduleId === m.id)
      return { name: `${m.iconEmoji} ${m.title}`, completions: found?._count._all || 0 }
    })

    // User growth
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } })
    const totalTeachers = await prisma.user.count({ where: { role: 'TEACHER' } })

    // Preparedness score (avg of all quiz results)
    const allResults = await prisma.quizResult.findMany({ select: { score: true } })
    const prepScore = allResults.length ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length) : 0

    // Drills
    const totalDrills = await prisma.simulationHistory.count()

    return NextResponse.json({
      chartData,
      moduleCompletion,
      stats: { totalStudents, totalTeachers, prepScore, totalDrills, totalQuizResults: allResults.length },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
