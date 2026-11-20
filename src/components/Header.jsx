import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 items-center justify-between bg-white px-3 shadow sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Toggle sidebar"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <span className="hidden max-w-40 truncate text-sm font-medium text-gray-700 sm:block">{user?.name}</span>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loggingOut ? '...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}
