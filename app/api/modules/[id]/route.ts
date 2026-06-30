import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        quizzes: {
          where: { isPublished: true },
          include: {
            _count: { select: { questions: true } }
          }
        },
      },
    })

    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

    // Mark as started / completed
    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: session.user.id, moduleId: id } },
      update: {},
      create: { userId: session.user.id, moduleId: id, completed: false },
    })

    const userProgress = await prisma.moduleProgress.findUnique({
      where: { userId_moduleId: { userId: session.user.id, moduleId: id } },
    })

    return NextResponse.json({ ...module, userProgress })
  } catch (error) {
    console.error('Module GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const progress = await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: session.user.id, moduleId: id } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: session.user.id, moduleId: id, completed: true, completedAt: new Date() },
    })

    // Award XP for module completion
    await prisma.studentProfile.updateMany({
      where: { userId: session.user.id },
      data: { xpPoints: { increment: 100 } },
    })

    return NextResponse.json(progress)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
