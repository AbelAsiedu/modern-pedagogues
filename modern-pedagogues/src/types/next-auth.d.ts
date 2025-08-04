import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: UserRole
      avatar?: string
      status: string
    }
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    avatar?: string
    status: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    firstName: string
    lastName: string
    status: string
  }
}