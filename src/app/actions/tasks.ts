"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from "@/app/utils/supabase/server"

// Helper function to get the current user
async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await (await supabase).auth.getUser()
  return data?.user
}

// Function to fetch tasks for the current user
export async function addTask(formData: { name: string; dueDate: string }) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }
    
    const { name, dueDate } = formData
    
    if (!name || !dueDate) {
      return { success: false, error: "Missing required fields" }
    }
    
    const task = await prisma.task.create({
      data: {
        name,
        dueDate: new Date(dueDate),
        userId: user.id,
      },
    })
    
    revalidatePath("/") // Revalidate the home page to show the new task
    
    return { 
      success: true, 
      task,
      message: "Task added successfully"
    }
  } catch (error) {
    console.error("Failed to add task:", error)
    return { success: false, error: "Failed to add task" }
  }
}


// Function to fetch tasks for the current user
export async function toggleTaskStatus(taskId: string) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // First get the current task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })
    
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    
    // Check if the task belongs to the current user
    if (task.userId !== user.id) {
      return { success: false, error: "Unauthorized" }
    }
    
    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { done: !task.done },
    })
    
    revalidatePath("/")
    
    return { 
      success: true, 
      task: updatedTask,
      message: "Task status updated successfully"
    }
  } catch (error) {
    console.error("Failed to toggle task status:", error)
    return { success: false, error: "Failed to update task" }
  }
}

// Function to delete a task for the current user
export async function deleteTask(taskId: string) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // First check if the task exists and belongs to the user
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })
    
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    
    if (task.userId !== user.id) {
      return { success: false, error: "Unauthorized" }
    }
    
    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    })
    
    revalidatePath("/")
    
    return { 
      success: true,
      message: "Task deleted successfully"
    }
  } catch (error) {
    console.error("Failed to delete task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}