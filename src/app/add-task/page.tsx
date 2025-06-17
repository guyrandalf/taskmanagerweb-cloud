"use client"

import { useState } from "react"
import styles from "./add-task.module.css"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { addTask } from "../actions/tasks"

export default function AddTaskPage() {
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const saveTask = async () => {
    if (!name || !dueDate) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addTask({ name, dueDate })

      if (result.success) {
        toast.success("Task added successfully!")
        router.push("/")
      } else {
        toast.error(result.error || "Failed to add task")
      }
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Task</h1>
      <input
        type="text"
        className={styles.input}
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="date"
        className={styles.input}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button className={styles.button} onClick={saveTask}>
        {isSubmitting ? "Saving..." : "Save Task"}
      </button>
    </div>
  )
}
