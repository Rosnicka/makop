import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/pages/login'
import HomePage from '@/pages/home'
import CreateTeamPage from '@/pages/create-team'
import CreateEventPage from '@/pages/create-event'
import ForgotPasswordPage from '@/pages/forgot-password'
import ResetPasswordPage from '@/pages/reset-password'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/create-team" element={<ProtectedRoute><CreateTeamPage /></ProtectedRoute>} />
      <Route path="/events/new" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  )
}
