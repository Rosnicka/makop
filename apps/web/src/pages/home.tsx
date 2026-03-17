import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { profile } = useAuth()

  if (!profile?.teamId) return <Navigate to="/create-team" replace />

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Makop</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{profile.name}</span>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              Odhlásit se
            </Button>
          </div>
        </div>
        <p className="text-gray-500">Vítej, {profile.name}! Role: {profile.role}</p>
      </div>
    </div>
  )
}
