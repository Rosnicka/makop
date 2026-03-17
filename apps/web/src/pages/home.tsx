import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useEvents, useSetAttendance } from '@/hooks/useEvents'
import { Button } from '@/components/ui/button'

const STATUS_LABELS = { going: 'Jdu', not_going: 'Nejdu', maybe: 'Nevím' }

const ACTIVE_CLASSES: Record<string, string> = {
  going: 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200',
  not_going: 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-200',
  maybe: 'bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-200',
}

const COUNT_CLASSES: Record<string, string> = {
  going: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
  not_going: 'text-rose-600 bg-rose-50 border border-rose-200',
  maybe: 'text-amber-600 bg-amber-50 border border-amber-200',
}

const COUNT_ICONS: Record<string, string> = {
  going: '✓',
  not_going: '✗',
  maybe: '?',
}

export default function HomePage() {
  const { profile, user } = useAuth()
  const { data: events, isLoading } = useEvents()
  const setAttendance = useSetAttendance()

  if (!profile?.teamId) return <Navigate to="/create-team" replace />

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="glass-card rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
          <span className="text-2xl font-black tracking-widest uppercase glow-text">Makop</span>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{profile.name}</p>
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">{profile.role}</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs text-slate-500 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
            >
              Odhlásit
            </button>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Události</h2>
          {profile.role === 'captain' && (
            <Button size="sm" asChild className="text-xs h-7 px-3 rounded-full">
              <Link to="/events/new">+ Přidat</Link>
            </Button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-500">
            Načítání...
          </div>
        )}

        {/* Empty state */}
        {!isLoading && events?.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">⚽</p>
            <p className="text-sm text-slate-500">Žádné události zatím nejsou.</p>
          </div>
        )}

        {/* Events */}
        <div className="space-y-4">
          {events?.map((event) => {
            const myAttendance = event.attendance.find((a) => a.userId === user?.id)
            const counts = {
              going: event.attendance.filter(a => a.status === 'going').length,
              not_going: event.attendance.filter(a => a.status === 'not_going').length,
              maybe: event.attendance.filter(a => a.status === 'maybe').length,
            }

            return (
              <div key={event.id} className="glass-card rounded-2xl p-5">
                {/* Event header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">
                      vs <span className="glow-text">{event.opponent}</span>
                    </h3>
                    <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                      {new Date(event.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    🕐 {new Date(event.date).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-2">·</span>
                    📍 {event.location}
                  </p>
                  {event.description && (
                    <p className="text-sm text-slate-600 mt-2 italic">{event.description}</p>
                  )}
                </div>

                {/* Attendance buttons */}
                <div className="flex gap-2 mb-4">
                  {(['going', 'not_going', 'maybe'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setAttendance.mutate({ eventId: event.id, status })}
                      disabled={setAttendance.isPending}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-xl border transition-all duration-150 ${
                        myAttendance?.status === status
                          ? ACTIVE_CLASSES[status]
                          : 'bg-white/60 text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-slate-700'
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>

                {/* Counts */}
                {event.attendance.length > 0 && (
                  <div className="flex gap-2">
                    {(['going', 'not_going', 'maybe'] as const).map((status) =>
                      counts[status] > 0 ? (
                        <span key={status} className={`text-xs px-2 py-0.5 rounded-full font-medium ${COUNT_CLASSES[status]}`}>
                          {COUNT_ICONS[status]} {counts[status]}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
