"use client"

import { useEffect } from "react"

import { useState } from "react"

import type React from "react"
import ProtectedRoute from "../../../components/protected-route"

interface UserData {
  id: string
  name: string
  email: string
  department: string
  title: string
  role: string
  badgeId?: string
  phone?: string
  createdAt: string
  status: "active" | "inactive"
}

function UserManagementContent() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    title: "",
    role: "officer",
    badgeId: "",
    phone: "",
  })

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")

    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        setCurrentUser(userData)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Load mock users data
    loadUsers()
    setLoading(false)
  }, [])

  const loadUsers = () => {
    const mockUsers: UserData[] = [
      {
        id: "1",
        name: "Officer John Smith",
        email: "j.smith@pd.gov",
        department: "Metropolitan Police Department",
        title: "Detective",
        role: "officer",
        badgeId: "12345",
        phone: "+1 (555) 123-4567",
        createdAt: "2024-01-15",
        status: "active",
      },
      {
        id: "2",
        name: "Sergeant Maria Garcia",
        email: "m.garcia@pd.gov",
        department: "Metropolitan Police Department",
        title: "Sergeant",
        role: "officer",
        badgeId: "23456",
        phone: "+1 (555) 234-5678",
        createdAt: "2024-01-10",
        status: "active",
      },
      {
        id: "3",
        name: "Chief Robert Johnson",
        email: "r.johnson@pd.gov",
        department: "Metropolitan Police Department",
        title: "Chief of Police",
        role: "admin",
        badgeId: "00001",
        phone: "+1 (555) 345-6789",
        createdAt: "2024-01-01",
        status: "active",
      },
    ]

    const registeredUsers = localStorage.getItem("registeredUsers")
    if (registeredUsers) {
      try {
        const parsed = JSON.parse(registeredUsers)
        mockUsers.push(...parsed)
      } catch (error) {
        console.error("Error loading registered users:", error)
      }
    }

    setUsers(mockUsers)
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    const newUser: UserData = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)

    const registeredUsers = updatedUsers.filter((u) => !["1", "2", "3"].includes(u.id))
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

    setFormData({
      name: "",
      email: "",
      department: "",
      title: "",
      role: "officer",
      badgeId: "",
      phone: "",
    })
    setShowAddForm(false)
  }

  const handleEditUser = (user: UserData) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department,
      title: user.title,
      role: user.role,
      badgeId: user.badgeId || "",
      phone: user.phone || "",
    })
    setShowAddForm(true)
  }

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingUser) return

    const updatedUsers = users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user))

    setUsers(updatedUsers)

    const registeredUsers = updatedUsers.filter((u) => !["1", "2", "3"].includes(u.id))
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

    setFormData({
      name: "",
      email: "",
      department: "",
      title: "",
      role: "officer",
      badgeId: "",
      phone: "",
    })
    setShowAddForm(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)

      const registeredUsers = updatedUsers.filter((u) => !["1", "2", "3"].includes(u.id))
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    }
  }

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : ("active" as "active" | "inactive") }
        : user,
    )
    setUsers(updatedUsers)

    const registeredUsers = updatedUsers.filter((u) => !["1", "2", "3"].includes(u.id))
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">User Management</h1>
              <p className="text-sm text-slate-600">Manage officer accounts and permissions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Admin Panel</span>
            <span className="text-sm text-slate-600">{currentUser?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="officer">Officers</option>
              </select>
            </div>

            <button
              onClick={() => {
                setShowAddForm(true)
                setEditingUser(null)
                setFormData({
                  name: "",
                  email: "",
                  department: "",
                  title: "",
                  role: "officer",
                  badgeId: "",
                  phone: "",
                })
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Officer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">Officer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">Created</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                        {user.badgeId && <div className="text-xs text-slate-500">Badge: {user.badgeId}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{user.department}</div>
                      <div className="text-xs text-slate-600">{user.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "admin" ? "Administrator" : "Officer"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        >
                          {user.status === "active" ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                              />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-slate-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <p className="text-slate-600">No users found matching your criteria</p>
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {editingUser ? "Edit Officer" : "Add New Officer"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingUser(null)
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="Officer John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="officer@department.gov"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="Metropolitan Police Department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title/Rank</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="Detective, Sergeant, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="officer">Officer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Badge ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.badgeId}
                      onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingUser(null)
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      {editingUser ? "Update Officer" : "Add Officer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function UserManagementPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <UserManagementContent />
    </ProtectedRoute>
  )
}
