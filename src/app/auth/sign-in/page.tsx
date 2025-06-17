"use client"

import { useState, useContext } from "react"
import styles from "./sign-in.module.css"
import { AuthContext } from "@/app/provider/auth-provider"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { login } = useContext(AuthContext) || {}

  const handleLogin = () => {
    if (login) login(email, password)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign In</h1>
      <input
        type="text"
        className={styles.input}
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.button} onClick={handleLogin}>
        Sign In
      </button>
      <Link href="/auth/sign-up" className={styles.link}>
        Go to Sign Up
      </Link>
    </div>
  )
}
