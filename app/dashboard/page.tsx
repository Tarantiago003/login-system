"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userStr = localStorage.getItem("userData");
    
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
        // Clear invalid data and redirect
        localStorage.removeItem("userData");
        router.push("/login");
        return;
      }
    } else {
      // No user data means not logged in
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call logout API to clear the HTTP-only cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include'
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    
    // Clear local storage
    localStorage.removeItem("userData");
    
    // Redirect to login
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user.name}!</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              <p>{user.title}</p>
              <p>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Profile</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Department:</strong> {user.department || 'N/A'}</p>
              <p><strong>Title:</strong> {user.title || 'N/A'}</p>
              <p><strong>Badge ID:</strong> {user.badgeId || 'N/A'}</p>
              <p><strong>Role:</strong> {user.role || 'Officer'}</p>
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Admin Actions</h3>
              <div className="space-y-3">
                <a 
                  href="/admin/users" 
                  className="block px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-center"
                >
                  Manage Users
                </a>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                View Reports
              </button>
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                New Incident
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}