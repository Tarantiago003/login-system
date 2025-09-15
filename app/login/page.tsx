"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ Save token + user data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({ name: data.user.name, email: data.user.email })
      );

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Sign in
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 text-white py-2 hover:bg-slate-800 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-slate-900 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
