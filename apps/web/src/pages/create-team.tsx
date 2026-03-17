import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MakopLogo } from '@/components/MakopLogo'

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
          <MakopLogo className="text-4xl" />
          <p className="text-xs text-yellow-400/60 tracking-widest uppercase font-medium mt-1">Vytvoř svůj tým</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Název týmu</Label>
            <Input
              id="name"
              placeholder="FC Makop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25"
            />
          </div>
          {error && (
            <p className="text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition-all duration-150 shadow-sm shadow-yellow-400/20 disabled:opacity-60"
          >
            {loading ? 'Vytváření...' : 'Vytvořit tým'}
          </button>
        </form>
      </div>
    </div>
  )
}
