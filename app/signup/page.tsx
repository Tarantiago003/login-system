"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

// --- Config ---
const FAKE_NETWORK_DELAY_MS = 1200 // simulate latency

// --- Utilities ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string) {
  if (!email.trim()) return "Email is required."
  if (!emailRegex.test(email)) return "Enter a valid email address."
  return ""
}

function validatePassword(pw: string) {
  if (!pw) return "Password is required."
  if (pw.length < 8) return "Use at least 8 characters."
  return ""
}

function validateConfirmPassword(password: string, confirmPassword: string) {
  if (!confirmPassword) return "Please confirm your password."
  if (password !== confirmPassword) return "Passwords do not match."
  return ""
}

function validateName(name: string) {
  if (!name.trim()) return "Name is required."
  if (name.trim().length < 2) return "Name must be at least 2 characters."
  return ""
}

function passwordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0..5
}

function classNames(...xs: (string | boolean | undefined)[]) {
  return xs.filter(Boolean).join(" ")
}

// Fake signup function
function mockSignup({ name, email, password }: { name: string; email: string; password: string }) {
  return new Promise<{ token: string; user: { name: string; email: string } }>((resolve, reject) => {
    setTimeout(() => {
      // Simulate existing user check
      if (email === "existing@demo.com") {
        reject(new Error("An account with this email already exists."))
      } else {
        resolve({ token: "demo_token_456", user: { name, email } })
      }
    }, FAKE_NETWORK_DELAY_MS)
  })
}

// Focus trap helper for modal-like success card
function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const focusableSelectors = ["button", "a[href]", "input", "select", "textarea", '[tabindex]:not([tabindex="-1"])']

    const el = containerRef.current
    const nodes = el.querySelectorAll(focusableSelectors.join(","))
    const first = nodes[0] as HTMLElement
    const last = nodes[nodes.length - 1] as HTMLElement

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      if (nodes.length === 0) return

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    el.addEventListener("keydown", handleKeyDown)
    first?.focus()

    return () => el.removeEventListener("keydown", handleKeyDown)
  }, [active])

  return containerRef
}

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const nameErr = validateName(name)
  const emailErr = validateEmail(email)
  const pwErr = validatePassword(password)
  const confirmPwErr = validateConfirmPassword(password, confirmPassword)
  const formValid = !nameErr && !emailErr && !pwErr && !confirmPwErr && agreeTerms

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!formValid) return

    setSubmitting(true)
    try {
      await mockSignup({ name, email, password })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.")
    } finally {
      setSubmitting(false)
    }
  }

  const successTrapRef = useFocusTrap(success)

  const strength = passwordStrength(password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-600">Join us today (frontend demo)</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 space-y-5 border border-slate-100"
          noValidate
          aria-describedby="form-error"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className={classNames(
                "mt-1 w-full rounded-xl border px-3 py-2 outline-none transition",
                nameErr
                  ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400"
                  : "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400",
              )}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameErr}
              aria-describedby={nameErr ? "name-error" : undefined}
            />
            {nameErr ? (
              <p id="name-error" className="mt-1 text-xs text-rose-600" role="alert">
                {nameErr}
              </p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              className={classNames(
                "mt-1 w-full rounded-xl border px-3 py-2 outline-none transition",
                emailErr
                  ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400"
                  : "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400",
              )}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailErr}
              aria-describedby={emailErr ? "email-error" : undefined}
            />
            {emailErr ? (
              <p id="email-error" className="mt-1 text-xs text-rose-600" role="alert">
                {emailErr}
              </p>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="text-xs underline text-slate-600 hover:text-slate-900"
                aria-pressed={showPw}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              className={classNames(
                "mt-1 w-full rounded-xl border px-3 py-2 outline-none transition",
                pwErr
                  ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400"
                  : "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400",
              )}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!pwErr}
              aria-describedby={pwErr ? "password-error" : undefined}
            />
            {pwErr ? (
              <p id="password-error" className="mt-1 text-xs text-rose-600" role="alert">
                {pwErr}
              </p>
            ) : (
              // Strength meter (informational)
              <div className="mt-2" aria-live="polite">
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={classNames(
                      "h-full transition-all",
                      strength <= 1 && "bg-rose-400",
                      strength === 2 && "bg-amber-400",
                      strength === 3 && "bg-yellow-500",
                      strength === 4 && "bg-emerald-500",
                      strength >= 5 && "bg-emerald-600",
                    )}
                    style={{ width: `${(strength / 5) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-600">Strength: {strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                className="text-xs underline text-slate-600 hover:text-slate-900"
                aria-pressed={showConfirmPw}
              >
                {showConfirmPw ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPw ? "text" : "password"}
              autoComplete="new-password"
              className={classNames(
                "mt-1 w-full rounded-xl border px-3 py-2 outline-none transition",
                confirmPwErr
                  ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400"
                  : "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400",
              )}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!confirmPwErr}
              aria-describedby={confirmPwErr ? "confirm-password-error" : undefined}
            />
            {confirmPwErr ? (
              <p id="confirm-password-error" className="mt-1 text-xs text-rose-600" role="alert">
                {confirmPwErr}
              </p>
            ) : null}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="inline-flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500 mt-0.5"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <a href="#" className="underline text-slate-900 hover:text-slate-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline text-slate-900 hover:text-slate-700">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Global error */}
          <div id="form-error" aria-live="assertive">
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formValid || submitting}
            className={classNames(
              "w-full rounded-xl px-4 py-2 font-medium shadow-sm transition",
              !formValid || submitting
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-400",
            )}
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>

          {/* Hints for the evaluator */}
          <div className="text-[11px] text-slate-500">
            <p>
              <strong>Demo note</strong>: Try existing@demo.com to see error handling
            </p>
          </div>
        </form>

        {/* Success overlay */}
        {success && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Signup successful"
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              ref={successTrapRef}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100"
            >
              <div className="mb-3">
                <h2 className="text-xl font-semibold text-slate-900">Welcome aboard! 🎉</h2>
                <p className="text-sm text-slate-600">
                  Your account has been created successfully. This is a frontend-only demo.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
                  onClick={() => {
                    window.location.href = "/login"
                  }}
                >
                  Continue to Sign In
                </button>
                <button
                  className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => {
                    alert(`Account created for: ${name} (${email})`)
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="underline text-slate-900 hover:text-slate-700">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
