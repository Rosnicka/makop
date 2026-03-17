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
            <button onClick={() => navigate('/')} className="text-xs text-yellow-400/60 hover:text-yellow-400 font-medium mb-4 flex items-center gap-1 transition-colors">
              ← Zpět
            </button>
            <h2 className="text-xl font-bold text-yellow-50">Nová událost</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="opponent" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Soupeř</Label>
              <Input id="opponent" name="opponent" placeholder="FC Sokol Praha" required className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Datum a čas</Label>
              <Input id="date" name="date" type="datetime-local" required className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Místo</Label>
              <Input id="location" name="location" placeholder="Hřiště Na Kotlářce" required className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Poznámka (nepovinné)</Label>
              <Textarea id="description" name="description" placeholder="Dorazte 15 minut před zápasem" className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25" />
            </div>
            {error && (
              <p className="text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-3 py-2">{error}</p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition-all shadow-sm shadow-yellow-400/20 disabled:opacity-60"
              >
                {loading ? 'Vytváření...' : 'Vytvořit'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl border border-yellow-400/15 text-yellow-200/60 hover:border-yellow-400/30 hover:text-yellow-200 font-medium transition-all"
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
