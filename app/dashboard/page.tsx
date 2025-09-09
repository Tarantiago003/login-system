"use client"

import { useState } from "react"

export default function DashboardPage() {
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)

    // Simulate sign out delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Clear any stored auth data
    localStorage.removeItem("authToken")
    localStorage.removeItem("rememberMe")

    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
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
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome to your dashboard</h2>
            <p className="text-slate-600 mb-8">Mock Dashboard... You're successfully signed in!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-2">Profile</h3>
                <p className="text-sm text-slate-600">Manage your account settings</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-2">Activity</h3>
                <p className="text-sm text-slate-600">View your recent activity</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-2">Settings</h3>
                <p className="text-sm text-slate-600">Configure your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
