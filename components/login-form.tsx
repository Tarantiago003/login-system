"use client"

import { useState } from "react"

// --- Config (you can change these for your exercise) --- const VALID_EMAIL = "test@demo.com"; const VALID_PASSWORD = "Password123!"; const FAKE_NETWORK_DELAY_MS = 900; // simulate latency

// --- Utilities --- const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

function validateEmail(email) {
  if (!email.trim()) return "Email is required."
  if (!emailRegex.test(email)) return "Enter a valid email address."
  return ""
}

function validatePassword(pw) {
  if (!pw) return "Password is required."
  if (pw.length < 8) return "Use at least 8 characters."
  return ""
}

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0..5 }

  function classNames(...xs) {
    return xs.filter(Boolean).join(" ")
  }

  // Fake auth function (NEVER ship real logic like this) function mockAuthenticate({ email, password }) { return new Promise((resolve, reject) => { setTimeout(() => { if (email === VALID_EMAIL && password === VALID_PASSWORD) { resolve({ token: "demo_token_123", user: { email } }); } else { reject(new Error("Invalid email or password.")); } }, FAKE_NETWORK_DELAY_MS); }); }

  // Focus trap helper for modal-like success card (simple) function useFocusTrap(active) { const containerRef = useRef(null); useEffect(() => { if (!active || !containerRef.current) return; const focusableSelectors = [ 'button', 'a[href]', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])' ]; const el = containerRef.current; const nodes = el.querySelectorAll(focusableSelectors.join(',')); const first = nodes[0]; const last = nodes[nodes.length - 1];

  function handleKeyDown(e) {
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

  \
}
, [active])
return containerRef;
}

export default function MockLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const emailErr = validateEmail(email)
  const pwErr = validatePassword(password)
  const formValid = !emailErr && !pwErr

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    if (!formValid) return
    setSubmitting(true)
    try {
      await mockAuthenticate({ email, password })
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Login failed.")
    } finally {
      setSubmitting(false)
    }
  }

  const successTrapRef = useFocusTrap(success)

  const strength = passwordStrength(password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"]

  return (  

\
  Welcome
  back

  \
Sign in to your account (frontend demo) 

   <form 
      onSubmit=
  onSubmit
  className = "bg-white shadow-lg rounded-2xl p-6 space-y-5 border border-slate-100"
  noValidate
  aria-describedby =
    "form-error" >
    {
      /* Email */
    }<div>(
      <label htmlFor="email" className="block text-sm font-medium text-slate-700">
        Email
      </label>,
    ) <
    input
  id = "email"
  name = "email"
  type = "email"
  autoComplete = "username"
  className={classNames(
  \
            "mt-1 w-full rounded-xl border px-3 py-2 outline-none transition", 
            emailErr 
              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400" 
              : "border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400" 
          )
}
placeholder = "you@example.com"
value = { email }
\
          onChange=
{
  ;(e) => setEmail(e.target.value)
}
\
          aria-invalid=
{
  !!emailErr
}
\
          aria-describedby=
{
  emailErr ? "email-error" : undefined
}
;/ >
{
  emailErr ? (
    <p id="email-error" className="mt-1 text-xs text-rose-600" role="alert">
      {emailErr}
    </p>
  ) : null
}
</div>

{
  /* Password */
}
;<div>
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
    autoComplete="current-password"
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

{
  /* Remember + Forgot */
}
;<div className="flex items-center justify-between">
  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
      checked={remember}
      onChange={(e) => setRemember(e.target.checked)}
    />
    Remember me
  </label>
  <button
    type="button"
    onClick={() => alert("This is a demo – implement your own route.")}
    className="text-sm underline text-slate-600 hover:text-slate-900"
  >
    Forgot password?
  </button>
</div>

{
  /* Global error */
}
;<div id="form-error" aria-live="assertive">
  {error ? (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
  ) : null}
</div>

{
  /* Submit */
}
;<button
  type="submit"
  disabled={!formValid || submitting}
  className={classNames(
    "w-full rounded-xl px-4 py-2 font-medium shadow-sm transition",
    !formValid || submitting
      ? "bg-slate-300 text-slate-600 cursor-not-allowed"
      : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-400",
  )}
>
  {submitting ? "Signing in…" : "Sign in"}
</button>

{
  /* Hints for the evaluator (optional – remove in prod) */
}
;<div className="text-[11px] text-slate-500">
  <p>
    <strong>Demo creds</strong>: {VALID_EMAIL} / {VALID_PASSWORD}
  </p>
</div>
</form>

{
  /* Success overlay (simulates post-login) */
}
{
  success && (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Login successful"
      className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div ref={successTrapRef} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-slate-900">You're in 🎉</h2>
          <p className="text-sm text-slate-600">
            This is a frontend-only success state. Replace with your router navigation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
            onClick={() => {
              // In a real app, navigate to dashboard
              setSuccess(false)
            }}
          >
            Close
          </button>
          <button
            className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={() => {
              // Show what you might persist (demo only)
              alert(`Remember me: ${remember ? "on" : "off"}`)
            }}
          >
            What did we save?
          </button>
        </div>
      </div>
    </div>
  )
}
;<p className="mt-6 text-center text-xs text-slate-500">
  By signing in, you agree to our{" "}
  <a className="underline" href="#">
    Terms
  </a>{" "}
  and{" "}
  <a className="underline" href="#">
    Privacy Policy
  </a>
  .
</p>
</div> 
</div> 
  

)
} \
