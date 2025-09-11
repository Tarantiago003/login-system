import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="mb-4 flex justify-center">
              <img src="/images/logo.jpg" alt="AuthFlow Logo" className="w-16 h-16 object-contain" />
            </div>
            {/* Alternative: Keep the geometric icon as fallback */}
            {/* <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div> */}
            <h1 className="text-4xl font-bold text-slate-900 mb-2">AuthFlow</h1>
            <p className="text-slate-600 text-lg">Secure authentication made simple</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4 border border-slate-100">
          <Link
            href="/login"
            className="w-full bg-slate-900 text-white rounded-xl px-6 py-4 font-medium hover:bg-slate-800 transition text-center block flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Sign In
          </Link>

          <Link
            href="/signup"
            className="w-full border border-slate-300 text-slate-700 rounded-xl px-6 py-4 font-medium hover:bg-slate-50 transition text-center block flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Sign Up
          </Link>

          <Link
            href="/logout"
            className="w-full text-slate-600 rounded-xl px-6 py-3 font-medium hover:bg-slate-50 transition text-center block text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </Link>
        </div>

        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>© 2024 AuthFlow. Secure by design.</p>
        </div>
      </div>
    </div>
  )
}
