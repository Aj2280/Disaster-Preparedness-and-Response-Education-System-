import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role, schoolId } = parsed.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: role as 'STUDENT' | 'TEACHER' | 'ADMIN',
        emailVerified: new Date(), // Auto-verify for demo
        schoolId: schoolId || 'school-001',
        ...(role === 'STUDENT' && {
          studentProfile: { create: {} },
        }),
        ...(role === 'TEACHER' && {
          teacherProfile: { create: {} },
        }),
      },
      select: { id: true, email: true, name: true, role: true },
    })

    return NextResponse.json({ message: 'Account created successfully', user }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
