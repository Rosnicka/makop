import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MakopLogo } from '@/components/MakopLogo'

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
          <MakopLogo className="text-4xl" />
          <p className="text-xs text-yellow-400/60 tracking-widest uppercase font-medium mt-1">Sunday League Manager</p>
        </div>

        <div className="flex bg-yellow-400/5 rounded-xl p-1 mb-6 border border-yellow-400/10">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                mode === m
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'text-yellow-200/50 hover:text-yellow-200'
              }`}
            >
              {m === 'login' ? 'Přihlášení' : 'Registrace'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Jméno</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-yellow-200/60">Heslo</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-yellow-400/5 border-yellow-400/15 text-yellow-50 placeholder:text-yellow-200/25" />
          </div>
          {error && (
            <p className="text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-bold transition-all duration-150 shadow-sm shadow-yellow-400/20 disabled:opacity-60"
          >
            {loading ? '...' : mode === 'login' ? 'Přihlásit se' : 'Registrovat se'}
          </button>
        </form>
        {mode === 'login' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-yellow-200/40 hover:text-yellow-400 transition-colors"
            >
              Zapomenuté heslo?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
