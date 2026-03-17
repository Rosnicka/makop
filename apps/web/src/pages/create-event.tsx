import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { queryClient } from '@/lib/queryClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session!.access_token}`,
      },
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Nová událost</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="opponent">Soupeř</Label>
                <Input id="opponent" name="opponent" placeholder="FC Sokol Praha" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Datum a čas</Label>
                <Input id="date" name="date" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Místo</Label>
                <Input id="location" name="location" placeholder="Hřiště Na Kotlářce" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Poznámka (nepovinné)</Label>
                <Textarea id="description" name="description" placeholder="Dorazte 15 minut před zápasem" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Vytváření...' : 'Vytvořit'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Zrušit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
