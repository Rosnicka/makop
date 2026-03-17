import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { queryClient } from '@/lib/queryClient'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateEventPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setLoading(true)
    setError('')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({
        opponent: data.get('opponent'),
        date: data.get('date'),
        location: data.get('location'),
        description: data.get('description') || undefined,
      }),
    })

    if (!res.ok) {
      setError('Nepodařilo se vytvořit událost.')
      setLoading(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['events'] })
    navigate('/')
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <button onClick={() => navigate('/')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mb-4 flex items-center gap-1">
              ← Zpět
            </button>
            <h2 className="text-xl font-bold text-slate-800">Nová událost</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="opponent" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Soupeř</Label>
              <Input id="opponent" name="opponent" placeholder="FC Sokol Praha" required className="bg-white/70" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Datum a čas</Label>
              <Input id="date" name="date" type="datetime-local" required className="bg-white/70" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Místo</Label>
              <Input id="location" name="location" placeholder="Hřiště Na Kotlářce" required className="bg-white/70" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Poznámka (nepovinné)</Label>
              <Textarea id="description" name="description" placeholder="Dorazte 15 minut před zápasem" className="bg-white/70" />
            </div>
            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-sm shadow-emerald-200 disabled:opacity-60"
              >
                {loading ? 'Vytváření...' : 'Vytvořit'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
