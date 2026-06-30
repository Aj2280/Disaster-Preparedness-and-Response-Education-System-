import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: string
      schoolId?: string | null
    }
  }

  interface User {
    role: string
    schoolId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    schoolId?: string | null
  }
}
