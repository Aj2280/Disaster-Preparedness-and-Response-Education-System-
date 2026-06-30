import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const schoolId = searchParams.get('schoolId')
  const activeOnly = searchParams.get('activeOnly') === 'true'

  try {
    const alerts = await prisma.emergencyAlert.findMany({
      where: {
        ...(activeOnly && { isActive: true }),
        OR: [
          { schoolId: schoolId || undefined },
          { schoolId: null },
        ],
      },
      orderBy: [{ priority: 'desc' }, { publishedAt: 'desc' }],
      take: 20,
    })
    return NextResponse.json(alerts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const alert = await prisma.emergencyAlert.create({
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        category: body.category,
        schoolId: body.schoolId || null,
        publishedBy: session.user.id,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    })
    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
