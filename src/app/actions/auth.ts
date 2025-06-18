"use server"

import prisma from "@/lib/prisma"

//  Function to create a new user profile in the database
//  This function is called when a new user signs up
//  It takes userId and email as parameters and returns the created user object or an error
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
