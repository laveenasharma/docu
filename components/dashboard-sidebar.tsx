"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Home, Upload, LogOut, Menu, GitPullRequest } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/dashboard/documents",
      active: pathname === "/dashboard/documents" || pathname.startsWith("/dashboard/documents/"),
    },
    {
      label: "Upload",
      icon: Upload,
      href: "/dashboard/upload",
      active: pathname === "/dashboard/upload",
    },
    {
      label: "Workflows",
      icon: GitPullRequest,
      href: "/dashboard/workflows",
      active: pathname === "/dashboard/workflows",
    },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-bold">Document Manager</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                route.active ? "bg-gray-100" : "text-gray-500",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )

  // For mobile, use a Sheet component
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed left-4 top-4 z-50 md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // For desktop, use the regular sidebar
  return (
    <div className="hidden md:block md:w-64 border-r bg-white">
      <SidebarContent />
    </div>
  )
}

