import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// This route fetches all tasks from the database and returns them as JSON
// It orders the tasks by their due date in ascending order
// If an error occurs, it returns a 500 status with an error message
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "User Id not found" },
                { status: 400 }
            )
        }

        const tasks = await prisma.task.findMany({
            where: {
                userId
            },
            orderBy: {
                dueDate: "asc",
            },
        })

        // remove the time and timezone from the due date using split
        const formattedDueDate = tasks.map((task) => ({
            ...task,
            dueDate: task.dueDate.toISOString().split("T")[0],
        }))

        return NextResponse.json({
            success: true,
            tasks: formattedDueDate,
            message: "Tasks fetched successfully",
        })
    } catch (error) {
        console.error("Failed to fetch tasks:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch tasks" },
            { status: 500 }
        )
    }
}