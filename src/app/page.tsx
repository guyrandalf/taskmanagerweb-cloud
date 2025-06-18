"use client"

import { useEffect, useState, useContext } from "react"
import styles from "./page.module.css"
import { AuthContext } from "./provider/auth-provider"
import Link from "next/link"
import { deleteTask, toggleTaskStatus } from "./actions/tasks"
import { toast } from "react-hot-toast"

interface Task {
  id: string
  name: string
  dueDate: string
  done: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export default function HomePage() {
  const { isAuthenticated, user, logout } = useContext(AuthContext) || {
    isAuthenticated: false,
    logout: () => {},
  }
  const [loading, setLoading] = useState<boolean>(false)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // this useEffect will run to fetch tasks from the server on initial load
    const loadTasks = async () => {
      setLoading(true)
      try {
        const userId = user?.id
        const response = await fetch(`/api/fetch-tasks?userId=${userId}`)
        const data = await response.json()

        if (data.success) {
          setTasks(data.tasks)
          if (data.tasks.length === 0) {
            toast.error("No tasks found")
          }
        } else {
          setTasks([])
          toast.error(data.error || "Failed to get tasks")
        }
      } catch (error) {
        console.error("Failed to load tasks", error)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [user])

  const handleToggleStatus = async (taskId: string) => {
    const result = await toggleTaskStatus(taskId)
    if (result.success) {
      toast.success(result.message || "Task updated successfully!")
      // Update the task in the local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      )
    } else {
      toast.error(result.error || "Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId)
    if (result.success) {
      toast.success(result.message || "Task deleted successfully")
      // Remove the task from the local state
      setTasks(tasks.filter((task) => task.id !== taskId))
    } else {
      toast.error(result.error || "Failed to delete task")
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
      {loading ? (
        <span
          style={{
            color: "#000",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Loading...
        </span>
      ) : (
        <>
          <ul className={styles.taskList}>
            {Array.isArray(tasks) &&
              tasks.map((task) => (
                <li key={task.id} className={styles.task}>
                  <span
                    className={task.done ? styles.completed : ""}
                    onClick={() => handleToggleStatus(task.id)}
                  >
                    {task.name} (Due: {task.dueDate})
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTask(task.id)
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
          <Link href="/add-task" className={styles.addButton}>
            Add New Task
          </Link>
        </>
      )}
    </div>
  )
}
