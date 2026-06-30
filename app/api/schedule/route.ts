import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Find user's school
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true }
    })

    if (!user?.schoolId) return NextResponse.json({ error: 'No school associated' }, { status: 400 })

    const schedules = await prisma.eventSchedule.findMany({
      where: { schoolId: user.schoolId },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Schedule GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || session.user.role === 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true }
    })

    if (!user?.schoolId) return NextResponse.json({ error: 'No school associated' }, { status: 400 })

    const body = await req.json()
    const { title, description, eventType, disasterType, date, location } = body

    if (!title || !date || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const schedule = await prisma.eventSchedule.create({
      data: {
        schoolId: user.schoolId,
        title,
        description: description || null,
        eventType,
        disasterType: disasterType === 'GENERAL' || !disasterType ? null : disasterType,
        date: new Date(date),
        location: location || null,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(schedule)
  } catch (error: any) {
    console.error('Schedule POST error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error', details: String(error) }, { status: 500 })
  }
}
