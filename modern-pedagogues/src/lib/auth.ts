import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            teacherProfile: true,
            studentProfile: true,
            parentProfile: true,
            adminProfile: true
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Check if user is active
        if (user.status !== "ACTIVE") {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.status = token.status as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  debug: process.env.NODE_ENV === "development"
}

// Utility functions for role-based access
export const requireAuth = (roles?: UserRole[]) => {
  return (session: any) => {
    if (!session?.user) {
      return false
    }
    
    if (roles && !roles.includes(session.user.role)) {
      return false
    }
    
    return true
  }
}

export const hasRole = (userRole: UserRole, allowedRoles: UserRole[]) => {
  return allowedRoles.includes(userRole)
}

export const isAdmin = (userRole: UserRole) => {
  return userRole === UserRole.ADMIN
}

export const isTeacher = (userRole: UserRole) => {
  return userRole === UserRole.TEACHER
}

export const isStudent = (userRole: UserRole) => {
  return userRole === UserRole.STUDENT
}

export const isParent = (userRole: UserRole) => {
  return userRole === UserRole.PARENT
}