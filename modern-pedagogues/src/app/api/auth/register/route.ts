import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      dateOfBirth
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with transaction to ensure data consistency
    const user = await prisma.$transaction(async (tx) => {
      // Create the main user record
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          role: role as UserRole,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          status: role === "TEACHER" ? "PENDING" : "ACTIVE", // Teachers need approval
        }
      })

      // Create role-specific profile
      switch (role) {
        case "STUDENT":
          await tx.studentProfile.create({
            data: {
              userId: newUser.id,
              studentId: `STU${Date.now()}`, // Generate unique student ID
              gradeLevel: "Not Set", // Will be updated later
              curriculum: "GES" // Default curriculum
            }
          })
          break

        case "TEACHER":
          await tx.teacherProfile.create({
            data: {
              userId: newUser.id,
              isApproved: false
            }
          })
          break

        case "PARENT":
          await tx.parentProfile.create({
            data: {
              userId: newUser.id
            }
          })
          break

        default:
          throw new Error("Invalid role specified")
      }

      return newUser
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTRATION",
        description: `New ${role.toLowerCase()} registered: ${firstName} ${lastName}`,
        metadata: {
          role,
          email,
          registrationDate: new Date().toISOString()
        }
      }
    })

    // Return success response (don't include sensitive data)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}