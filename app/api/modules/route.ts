import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    const modules = await prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      take: limit,
      include: {
        quizzes: { select: { id: true, title: true } },
        _count: { select: { quizzes: true } },
      },
    })

    // Get user's module progress
    const progress = await prisma.moduleProgress.findMany({
      where: { userId: session.user.id },
    })
    const progressMap = new Map(progress.map(p => [p.moduleId, p]))

    const modulesWithProgress = modules.map(m => ({
      ...m,
      userProgress: progressMap.get(m.id) || null,
      isCompleted: progressMap.get(m.id)?.completed || false,
    }))

    return NextResponse.json(modulesWithProgress)
  } catch (error) {
    console.error('Modules GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
