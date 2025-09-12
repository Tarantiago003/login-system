"use client";

import { useState, useRef, useEffect } from "react";

// --- Utilities ---
function classNames(...xs: (string | boolean | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

// Focus trap helper for modal-like success card
function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const selectors = ["button", "a[href]", "input", "select", "textarea", '[tabindex]:not([tabindex="-1"])'];
    const nodes = containerRef.current.querySelectorAll(selectors.join(","));
    const first = nodes[0] as HTMLElement;
    const last = nodes[nodes.length - 1] as HTMLElement;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    containerRef.current.addEventListener("keydown", handleKeyDown);
    first?.focus();
    return () => containerRef.current?.removeEventListener("keydown", handleKeyDown);
  }, [active]);
  return containerRef;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const successTrapRef = useFocusTrap(success);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token in cookies (middleware reads this)
        document.cookie = `token=${data.token}; path=/; max-age=3600; SameSite=Strict`;

        // ✅ Option A: show success modal first
        setSuccess(true);

        // ✅ Option B: auto-redirect immediately
        // window.location.href = "/dashboard";
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 space-y-5 border border-slate-100"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded-xl border px-3 py-2 border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              className="mt-1 w-full rounded-xl border px-3 py-2 border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={classNames(
              "w-full rounded-xl px-4 py-2 font-medium shadow-sm transition",
              submitting
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-400"
            )}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Success Modal */}
        {success && (
          <div className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              ref={successTrapRef}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-2">You're in 🎉</h2>
              <p className="text-sm text-slate-600 mb-4">Redirecting to dashboard…</p>
              <button
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
