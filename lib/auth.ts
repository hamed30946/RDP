import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    Credentials({
      id: 'sso',
      name: 'Internal SSO',
      credentials: { email: {}, name: {} },
      async authorize(creds) {
        const parsed = credentialsSchema.safeParse(creds)
        if (!parsed.success) return null
        const { email, name } = parsed.data
        const user = await prisma.user.upsert({
          where: { email },
          update: { name },
          create: {
            email,
            name,
            role: 'USER',
            rateLimit: 30,
            bulkLimit: 50,
          },
        })
        return user
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(authOptions)
