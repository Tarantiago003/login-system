"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "../../components/protected-route"

interface UserData {
  name: string
  email: string
  department: string
  title: string
  role: string
  badgeId?: string
  phone?: string
}

function DashboardContent() {
  const [signingOut, setSigningOut] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
    setLoading(false)
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("rememberMe")

    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">No user data found. Please log in again.</p>
      </div>
    )
  }

  const isAdmin = userData.role === "admin"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </h1>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Welcome, {userData.name.split(" ")[0]}
            </h2>
            <p className="text-slate-600 mb-8">
              {isAdmin
                ? "You have administrator access to manage officers and settings."
                : "You're successfully signed in to your officer dashboard."}
            </p>

            {/* Role-specific cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {isAdmin ? (
                <>
                  <div
                    onClick={() => (window.location.href = "/admin/users")}
                    className="p-6 bg-slate-50 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-slate-900 mb-2">
                      User Management
                    </h3>
                    <p className="text-sm text-slate-600">
                      Add, remove, and manage officer accounts
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">
                      System Reports
                    </h3>
                    <p className="text-sm text-slate-600">
                      View department analytics and reports
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">
                      Settings
                    </h3>
                    <p className="text-sm text-slate-600">
                      Configure system-wide preferences
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">
                      Case Management
                    </h3>
                    <p className="text-sm text-slate-600">
                      Create and manage incident reports
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">
                      AI Assistant
                    </h3>
                    <p className="text-sm text-slate-600">
                      Get help with writing and analysis
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">
                      My Profile
                    </h3>
                    <p className="text-sm text-slate-600">
                      Update personal information
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
