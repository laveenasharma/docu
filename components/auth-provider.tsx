"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: string
  provider?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  socialLogin: (provider: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Protect routes
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === "/login" || pathname === "/signup"

      if (!user && !isAuthPage && pathname !== "/") {
        router.push("/login")
      } else if (user && isAuthPage) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    // In a real app, this would call an API endpoint
    // For demo purposes, we'll accept "admin"/"admin" as valid credentials
    if (email === "admin" && password === "admin") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      }

      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return
    }

    // For demo purposes, we'll simulate a successful login if email contains "admin"
    if (!email.includes("admin")) {
      throw new Error("Invalid credentials")
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData: User = {
      id: "1",
      name: "Admin User",
      email,
      role: "admin",
    }

    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const signup = async (name: string, email: string, password: string) => {
    // In a real app, this would call an API endpoint to create a user
    // For demo purposes, we'll simulate a successful signup

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: "user",
    }

    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const socialLogin = async (provider: string) => {
    // In a real app, this would redirect to the OAuth provider
    // For demo purposes, we'll simulate a successful login

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userData: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}.com`,
      role: "user",
      provider,
    }

    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, socialLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

