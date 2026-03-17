import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useEvents, useSetAttendance } from '@/hooks/useEvents'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STATUS_LABELS = {
  going: 'Jdu',
  not_going: 'Nejdu',
  maybe: 'Nevím',
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  going: 'default',
  not_going: 'secondary',
  maybe: 'outline',
}

export default function HomePage() {
  const { profile, user } = useAuth()
  const { data: events, isLoading } = useEvents()
  const setAttendance = useSetAttendance()

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

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Události</h2>
          {profile.role === 'captain' && (
            <Button size="sm" asChild>
              <Link to="/events/new">+ Přidat událost</Link>
            </Button>
          )}
        </div>

        {isLoading && <p className="text-gray-500 text-sm">Načítání...</p>}

        {!isLoading && events?.length === 0 && (
          <p className="text-gray-500 text-sm">Žádné události zatím nejsou.</p>
        )}

        <div className="space-y-4">
          {events?.map((event) => {
            const myAttendance = event.attendance.find((a) => a.userId === user?.id)

            return (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">vs {event.opponent}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString('cs-CZ', {
                      weekday: 'short', day: 'numeric', month: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                    {' · '}{event.location}
                  </p>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  )}
                  <div className="flex gap-2 flex-wrap mb-3">
                    {(['going', 'not_going', 'maybe'] as const).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={myAttendance?.status === status ? STATUS_VARIANTS[status] : 'outline'}
                        onClick={() => setAttendance.mutate({ eventId: event.id, status })}
                        disabled={setAttendance.isPending}
                      >
                        {STATUS_LABELS[status]}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {event.attendance.map((a) => (
                      <Badge key={a.userId} variant={STATUS_VARIANTS[a.status]}>
                        {STATUS_LABELS[a.status]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
