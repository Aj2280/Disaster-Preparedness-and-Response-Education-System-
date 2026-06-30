import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'earthquake', 'flood', etc.

    const where = type
      ? { disasterType: type.toUpperCase() as any, isPublished: true }
      : { isPublished: true }

    const scenarios = await prisma.simulationScenario.findMany({
      where,
      include: { steps: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(scenarios)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
