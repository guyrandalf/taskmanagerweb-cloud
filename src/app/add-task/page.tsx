"use client"

import { useState } from "react"
import styles from "./add-task.module.css"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  name: string
  dueDate: string
  done: boolean
}

export default function AddTaskPage() {
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ) // Default to today

  const saveTask = () => {
    if (!name || !dueDate) {
      alert("Please fill in all fields")
      return
    }

    const storedTasks = localStorage.getItem("tasks")
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : []
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      dueDate,
      done: false,
    }
    const updatedTasks = [...tasks, newTask]
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    router.push("/")
    alert("Task added successfully!")
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
        Save Task
      </button>
    </div>
  )
}
