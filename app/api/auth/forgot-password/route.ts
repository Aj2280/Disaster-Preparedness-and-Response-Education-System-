import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // In production, you'd:
    // 1. Generate a reset token
    // 2. Store it with expiry in DB
    // 3. Send email via Resend
    // For demo, we just return success always for security
    await prisma.user.findUnique({ where: { email: parsed.data.email } })

    return NextResponse.json({
      message: 'If an account exists, a reset link has been sent.',
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
