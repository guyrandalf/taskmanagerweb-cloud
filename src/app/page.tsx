// app/home/page.tsx
// Task list page with local storage and logout
"use client"

import { useEffect, useState, useContext } from "react"
import styles from "./page.module.css"
import { AuthContext } from "./provider/auth-provider"
import Link from "next/link"

interface Task {
  id: string
  name: string
  dueDate: string
  done: boolean
}

export default function HomePage() {
  const { isAuthenticated, logout } = useContext(AuthContext) || {}
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const loadTasks = () => {
      const data = localStorage.getItem("tasks")
      if (data) {
        setTasks(JSON.parse(data))
      } else {
        setTasks([])
      }
    }
    loadTasks()
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    )
    saveTasks(updatedTasks)
    if (!tasks.find((t) => t.id === id)?.done) {
      alert(`Task "${tasks.find((t) => t.id === id)?.name}" completed!`)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tasks</h1>
        <button className={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={styles.task}
            onClick={() => toggleTask(task.id)}
          >
            <span className={task.done ? styles.completed : ""}>
              {task.name} (Due: {task.dueDate})
            </span>
          </li>
        ))}
      </ul>
      <Link href="/add-task" className={styles.addButton}>
        Add New Task
      </Link>
    </div>
  )
}
