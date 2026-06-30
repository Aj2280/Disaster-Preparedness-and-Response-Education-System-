import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { scenarioId, score, totalSteps, correctSteps } = body

    const history = await prisma.simulationHistory.create({
      data: {
        userId: session.user.id,
        scenarioId,
        score,
        totalSteps,
        correctSteps,
      },
    })

    // Award XP
    const xp = 75
    await prisma.studentProfile.updateMany({
      where: { userId: session.user.id },
      data: { xpPoints: { increment: xp }, drillsCompleted: { increment: 1 } },
    })

    return NextResponse.json({ history, xpEarned: xp })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
