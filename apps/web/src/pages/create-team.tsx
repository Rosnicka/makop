import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateTeamPage() {
  const { session, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!res.ok) {
      setError('Nepodařilo se vytvořit tým. Zkus to znovu.')
      setLoading(false)
      return
    }

    await refreshProfile()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-widest uppercase glow-text mb-1">Makop</h1>
          <p className="text-xs text-emerald-600 tracking-widest uppercase font-medium">Vytvoř svůj tým</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Název týmu</Label>
            <Input
              id="name"
              placeholder="FC Makop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/70"
            />
          </div>
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-150 shadow-sm shadow-emerald-200 disabled:opacity-60"
          >
            {loading ? 'Vytváření...' : 'Vytvořit tým'}
          </button>
        </form>
      </div>
    </div>
  )
}
