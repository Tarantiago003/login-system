"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false); // ✅ prevents redirect loop
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("userData");

    if (!token || !userStr) {
      // No token → redirect to login
      router.push("/login");
    } else {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
        router.push("/login");
      }
    }

    setChecked(true); // ✅ Only show content after checking
  }, [router]);

  if (!checked) {
    return <p className="p-6">Loading...</p>; // Prevents flicker loop
  }

  if (!user) {
    return <p className="p-6">Redirecting to login...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          router.push("/login");
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
