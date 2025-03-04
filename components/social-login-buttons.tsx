"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useState } from "react"
import { Facebook, Mail, Linkedin } from "lucide-react"

export function SocialLoginButtons() {
  const { socialLogin } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider)
    try {
      await socialLogin(provider)
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading !== null}
        className="bg-white hover:bg-gray-50"
      >
        {isLoading === "google" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
        ) : (
          <Mail className="h-4 w-4 text-red-500" />
        )}
        <span className="sr-only">Google</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("facebook")}
        disabled={isLoading !== null}
        className="bg-white hover:bg-gray-50"
      >
        {isLoading === "facebook" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
        ) : (
          <Facebook className="h-4 w-4 text-blue-600" />
        )}
        <span className="sr-only">Facebook</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("linkedin")}
        disabled={isLoading !== null}
        className="bg-white hover:bg-gray-50"
      >
        {isLoading === "linkedin" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
        ) : (
          <Linkedin className="h-4 w-4 text-blue-700" />
        )}
        <span className="sr-only">LinkedIn</span>
      </Button>
    </div>
  )
}

