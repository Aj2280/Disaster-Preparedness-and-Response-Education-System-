import { prisma } from '@/lib/prisma'

export const auth = async () => {
  let user = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })

  if (!user || !user.schoolId) {
    let school = await prisma.school.findFirst()
    if (!school) {
      school = await prisma.school.create({
        data: {
          name: 'Demo School',
          city: 'Mumbai',
          state: 'Maharashtra',
        }
      })
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Mock Admin',
          email: 'admin@disasterprepedu.com',
          role: 'ADMIN',
          emailVerified: new Date(),
          schoolId: school.id,
        },
      })
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { schoolId: school.id }
      })
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
  }
}

export const handlers = {
  GET: async (req: Request) => {
    const session = await auth()
    if (new URL(req.url).pathname.endsWith('/session')) {
      return new Response(JSON.stringify({ ...session, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
  },
  POST: async () => new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
}

export const signIn = async () => {}
export const signOut = async () => {}
