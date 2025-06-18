"use client"

import { ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createContext } from "react"
import { toast } from "react-hot-toast"
import { createClient } from "@/app/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { createUser } from "@/app/actions/auth"

// Interface defining the shape of our authentication context
// Includes authentication state, user info, and auth methods
interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string) => Promise<void>
}

// Create the authentication context with undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider component that manages authentication state and provides auth methods
 * @param {ReactNode} children - Child components that will have access to auth context
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  // State for tracking authentication status and user information
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Initialize auth state by checking for existing session
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data)
      setUser(data?.user ?? null)
    })

    // Subscribe to auth state changes to keep local state in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setUser(session?.user ?? null)
    })

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  /**
   * Handles user registration with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's chosen password
   */
  const signup = async (email: string, password: string) => {
    try {
      // First attempt to create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      // Only proceed with Prisma user creation if auth was successful
      if (authData.user) {
        const { success, error } = await createUser(authData.user.id, email)

        if (!success) {
          // If Prisma fails, cleanup by deleting the Supabase user
          await supabase.auth.admin.deleteUser(authData.user.id)
          toast.error(error || "Failed to create user profile")
          return
        }
      }

      toast.success(
        "Sign up successful! Please check your email for verification."
      )
      router.push("/auth/sign-in")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during sign up"
      )
    }
  }

  /**
   * Handles user login with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   */
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Logged in successfully!")
      router.push("/")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred during login")
    }
  }

  /**
   * Handles user logout and cleans up authentication state
   * Redirects to sign-in page after successful logout
   */
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error(error.message)
        return
      }

      setIsAuthenticated(false)
      setUser(null)
      router.push("/auth/sign-in")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred during logout")
    }
  }

  // Provide authentication context to child components
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
