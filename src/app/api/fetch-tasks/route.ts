import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: {
                dueDate: "asc",
            },
        })

        return NextResponse.json({
            success: true,
            tasks
        })
    } catch (error) {
        console.error("Failed to fetch tasks:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch tasks" },
            { status: 500 }
        )
    }
}