import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-sm p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Nové heslo</h2>
        <p className="text-sm text-slate-500 mb-6">Zadej své nové heslo.</p>

        {!ready ? (
          <p className="text-sm text-slate-500 text-center py-4">Ověřování odkazu...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Nové heslo</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/70"
              />
            </div>
            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-sm shadow-emerald-200 disabled:opacity-60"
            >
              {loading ? '...' : 'Uložit heslo'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
