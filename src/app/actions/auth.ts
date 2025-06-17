"use server"

import prisma from "@/lib/prisma"

export async function createUser(userId: string, email: string) {
  try {
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
      },
    })
    return { success: true, user }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: "Failed to create user profile" }
  }
}
