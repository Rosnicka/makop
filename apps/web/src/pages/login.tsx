import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate('/')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      if (error) setError(error.message)
      else navigate('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-widest uppercase glow-text mb-1">Makop</h1>
          <p className="text-xs text-emerald-600 tracking-widest uppercase font-medium">Sunday League Manager</p>
        </div>

        <div className="flex bg-emerald-50 rounded-xl p-1 mb-6 border border-emerald-100">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                mode === m
                  ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'login' ? 'Přihlášení' : 'Registrace'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Jméno</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/70" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/70" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Heslo</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/70" />
          </div>
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold transition-all duration-150 shadow-sm shadow-emerald-200 disabled:opacity-60"
          >
            {loading ? '...' : mode === 'login' ? 'Přihlásit se' : 'Registrovat se'}
          </button>
        </form>
        {mode === 'login' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Zapomenuté heslo?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
