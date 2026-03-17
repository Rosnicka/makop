import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) setError(error.message)
    else setSent(true)

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-sm p-8">
        <button onClick={() => navigate('/login')} className="text-xs text-yellow-400/60 hover:text-yellow-400 font-medium mb-6 flex items-center gap-1 transition-colors">
          ← Zpět na přihlášení
        </button>

        <h2 className="text-xl font-bold text-yellow-50 mb-1">Zapomenuté heslo</h2>
        <p className="text-sm text-yellow-200/50 mb-6">Zadej svůj email a pošleme ti odkaz pro reset hesla.</p>

        {sent ? (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3 text-sm text-yellow-300">
            ✓ Email odeslán! Zkontroluj svou schránku.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition-all shadow-sm shadow-yellow-400/20 disabled:opacity-60"
            >
              {loading ? '...' : 'Odeslat odkaz'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
