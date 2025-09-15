"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check localStorage for user + token
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      // If no token, push back to login
      router.push("/login");
    } else {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Invalid user data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {user ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} 👋</h1>
            <p className="text-gray-600 mb-6">Email: {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </div>
  );
}
