"use client"

import { useState } from "react"
import Link from "next/link"

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    // Simulate logout process with delay
    setTimeout(() => {
      setIsLoggingOut(false)
      setLoggedOut(true)

      // Clear any stored auth data (localStorage, sessionStorage, etc.)
      // In a real app, you'd also invalidate server sessions
      localStorage.removeItem("authToken")
      sessionStorage.clear()
    }, 1000)
  }

  if (loggedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-slate-100">
            <div className="mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Signed out successfully</h1>
              <p className="text-slate-600">You have been logged out of your account.</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 transition text-center block"
              >
                Sign in again
              </Link>

              <Link
                href="/"
                className="w-full border border-slate-300 text-slate-700 rounded-xl px-4 py-3 font-medium hover:bg-slate-50 transition text-center block"
              >
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-slate-100">
          <div className="mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign out</h1>
            <p className="text-slate-600">Are you sure you want to sign out of your account?</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full rounded-xl px-4 py-3 font-medium transition ${
                isLoggingOut
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
            >
              {isLoggingOut ? "Signing out..." : "Yes, sign me out"}
            </button>

            <Link
              href="/"
              className="w-full border border-slate-300 text-slate-700 rounded-xl px-4 py-3 font-medium hover:bg-slate-50 transition text-center block"
            >
              Cancel
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">This will clear your session and log you out of all devices.</p>
        </div>
      </div>
    </div>
  )
}
