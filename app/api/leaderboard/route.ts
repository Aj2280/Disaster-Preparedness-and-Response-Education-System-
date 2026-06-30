import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const leaderboard = await prisma.studentProfile.findMany({
      include: { user: { select: { name: true, image: true, schoolId: true, school: { select: { name: true } } } } },
      orderBy: { xpPoints: 'desc' },
      take: 20,
    })

    return NextResponse.json(leaderboard.map((p, i) => ({
      rank: i + 1,
      name: p.user.name,
      image: p.user.image,
      school: p.user.school?.name || 'Unknown School',
      xpPoints: p.xpPoints,
      level: p.level,
      totalQuizzes: p.totalQuizzes,
      avgScore: p.avgScore,
    })))
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
