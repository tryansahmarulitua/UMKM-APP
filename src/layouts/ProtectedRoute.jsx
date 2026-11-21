import { Navigate, Outlet } from 'react-router-dom'
import FullPageSpinner from '../components/FullPageSpinner'
import { useAuth } from '../contexts/AuthContext'

/**
 * Wraps routes that require an authenticated admin user.
 * Shows nothing while session is being verified (avoids flash).
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <FullPageSpinner />

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
