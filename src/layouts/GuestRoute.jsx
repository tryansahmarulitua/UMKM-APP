import { Navigate, Outlet } from 'react-router-dom'
import FullPageSpinner from '../components/FullPageSpinner'
import { useAuth } from '../contexts/AuthContext'

/**
 * Redirects already-logged-in users away from /login.
 */
export default function GuestRoute() {
  const { user, loading } = useAuth()

  if (loading) return <FullPageSpinner />

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
