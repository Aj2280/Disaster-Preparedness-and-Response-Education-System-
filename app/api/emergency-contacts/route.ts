import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: {
        OR: [{ isNational: true }, { schoolId: session.user.schoolId || undefined }],
      },
      orderBy: { priority: 'asc' },
    })
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
