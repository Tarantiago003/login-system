"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface UserData {
  name: string
  email: string
  department: string
  title: string
  role: string
  badgeId?: string
  phone?: string
}

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({ children, requireAdmin = false, redirectTo = "/login" }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken")
      const storedUserData = localStorage.getItem("userData")

      // Check if user is authenticated
      if (!authToken) {
        window.location.href = redirectTo
        return
      }

      // Parse user data
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData)
          setUserData(parsedUserData)

          // Check admin requirement
          if (requireAdmin && parsedUserData.role !== "admin") {
            // Redirect non-admins to dashboard with error message
            localStorage.setItem("accessError", "You don't have permission to access this page.")
            window.location.href = "/dashboard"
            return
          }

          setIsAuthorized(true)
        } catch (error) {
          console.error("Error parsing user data:", error)
          window.location.href = redirectTo
          return
        }
      } else {
        window.location.href = redirectTo
        return
      }
    }

    checkAuth()
  }, [requireAdmin, redirectTo])

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message (shouldn't reach here due to redirects, but good fallback)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">
            {requireAdmin
              ? "You don't have administrator privileges to access this page."
              : "You need to be signed in to access this page."}
          </p>
          <button
            onClick={() => (window.location.href = userData?.role === "admin" ? "/dashboard" : "/login")}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            {userData ? "Go to Dashboard" : "Sign In"}
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
