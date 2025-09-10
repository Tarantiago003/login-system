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
  const [accessError, setAccessError] = useState<string | null>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    const error = localStorage.getItem("accessError")

    if (error) {
      setAccessError(error)
      localStorage.removeItem("accessError")
      // Clear error after 5 seconds
      setTimeout(() => setAccessError(null), 5000)
    }

    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData)
        setUserData(parsedUserData)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    setLoading(false)
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)

    // Simulate sign out delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("rememberMe")

    // Redirect to home page
    window.location.href = "/"
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const isAdmin = userData.role === "admin"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Access Error Alert */}
      {accessError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{accessError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => setAccessError(null)} className="text-red-400 hover:text-red-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {isAdmin ? "Admin Dashboard" : "Officer Dashboard"}
              </h1>
              <p className="text-sm text-slate-600">
                {userData.name} • {userData.title} • {userData.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                Administrator
              </span>
            )}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Welcome back, {userData.name.split(" ")[0]}
              </h2>
              <p className="text-slate-600 mb-4">
                {isAdmin
                  ? "Manage officers, view system reports, and oversee department operations."
                  : "Access case management tools and generate incident reports."}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span>
                  <strong>Department:</strong> {userData.department}
                </span>
                <span>
                  <strong>Rank:</strong> {userData.title}
                </span>
                {userData.badgeId && (
                  <span>
                    <strong>Badge:</strong> {userData.badgeId}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Content */}
        {isAdmin ? (
          // Admin Dashboard
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Administrative Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => (window.location.href = "/admin/users")}
                  className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">User Management</h4>
                  <p className="text-sm text-slate-600">Add, remove, and manage officer accounts</p>
                </button>

                <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">System Reports</h4>
                  <p className="text-sm text-slate-600">View department analytics and performance metrics</p>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">System Settings</h4>
                  <p className="text-sm text-slate-600">Configure department-wide settings and policies</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">New officer registration: Officer Johnson</span>
                    <span className="text-xs text-slate-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">System backup completed successfully</span>
                    <span className="text-xs text-slate-500 ml-auto">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Monthly report generated</span>
                    <span className="text-xs text-slate-500 ml-auto">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Officer Dashboard
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Officer Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Case Management</h4>
                  <p className="text-sm text-slate-600">Create and manage incident reports</p>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">AI Assistant</h4>
                  <p className="text-sm text-slate-600">Get help with report writing and case analysis</p>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">My Profile</h4>
                  <p className="text-sm text-slate-600">Update personal information and preferences</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">My Recent Cases</h3>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Case #2024-001: Traffic violation report completed</span>
                    <span className="text-xs text-slate-500 ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Case #2024-002: Incident report in progress</span>
                    <span className="text-xs text-slate-500 ml-auto">3 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Case #2024-003: Follow-up investigation scheduled</span>
                    <span className="text-xs text-slate-500 ml-auto">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
