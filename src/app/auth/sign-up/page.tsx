"use client"

import { useState, useContext } from "react"
import styles from "./sign-up.module.css"
import { AuthContext } from "@/app/provider/auth-provider"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { signup } = useContext(AuthContext) || {}

  const handleSignUp = () => {
    if (email && password) {
      if (signup) signup(email, password)
    } else {
      alert("Please fill all fields")
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <input
        type="email"
        className={styles.input}
        placeholder="Email"
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
      <button className={styles.button} onClick={handleSignUp}>
        Sign Up
      </button>
      <Link href="/auth/sign-in" className={styles.link}>
        Go to Sign In
      </Link>
    </div>
  )
}
