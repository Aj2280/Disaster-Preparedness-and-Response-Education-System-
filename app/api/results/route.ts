import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { quizSubmitSchema } from '@/lib/validations'
import { generateCertificateNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = quizSubmitSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

    const { quizId, answers, timeTaken } = parsed.data

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true, module: true },
    })

    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

    // Calculate score
    let correctCount = 0
    const questionResults = quiz.questions.map(q => {
      const userAnswer = answers[q.id]
      const isCorrect = userAnswer === q.correctOption
      if (isCorrect) correctCount++
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctOption,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const score = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore
    const xpEarned = passed ? (score === 100 ? 150 : 50) : 0

    // Save result
    const result = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        totalQ: quiz.questions.length,
        correctQ: correctCount,
        timeTaken: timeTaken || null,
        passed,
        xpEarned,
      },
    })

    // Award XP to student profile
    if (xpEarned > 0) {
      await prisma.studentProfile.updateMany({
        where: { userId: session.user.id },
        data: { xpPoints: { increment: xpEarned } },
      })
    }

    // Update quiz stats on student profile
    const allResults = await prisma.quizResult.findMany({
      where: { userId: session.user.id },
    })
    const avgScore = allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
    await prisma.studentProfile.updateMany({
      where: { userId: session.user.id },
      data: { totalQuizzes: allResults.length, avgScore: Math.round(avgScore) },
    })

    // Issue certificate if passed
    let certificate = null
    if (passed) {
      certificate = await prisma.certificate.create({
        data: {
          userId: session.user.id,
          title: `${quiz.module.title} Certificate`,
          description: `Successfully completed the ${quiz.module.title} quiz with a score of ${score}%.`,
          moduleType: quiz.module.disasterType,
          quizResultId: result.id,
          certificateNo: generateCertificateNumber(),
        },
      })

      // Mark module as completed
      await prisma.moduleProgress.upsert({
        where: { userId_moduleId: { userId: session.user.id, moduleId: quiz.moduleId } },
        update: { completed: true, completedAt: new Date() },
        create: { userId: session.user.id, moduleId: quiz.moduleId, completed: true, completedAt: new Date() },
      })
    }

    return NextResponse.json({
      result: { ...result, questionResults },
      certificate,
      xpEarned,
      passed,
    })
  } catch (error) {
    console.error('Quiz submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const results = await prisma.quizResult.findMany({
      where: { userId: session.user.id },
      include: {
        quiz: { include: { module: { select: { title: true, disasterType: true, iconEmoji: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
