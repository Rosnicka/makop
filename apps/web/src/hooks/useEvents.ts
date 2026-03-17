import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'

export interface EventAttendance {
  eventId: string
  userId: string
  status: 'going' | 'not_going' | 'maybe'
}

export interface Event {
  id: string
  teamId: string
  opponent: string
  date: string
  location: string
  description: string | null
  createdBy: string
  createdAt: string
  attendance: EventAttendance[]
}

const API_URL = import.meta.env.VITE_API_URL

export function useEvents() {
  const { session } = useAuth()

  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/events`, {
        headers: { Authorization: `Bearer ${session!.access_token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch events')
      return res.json()
    },
    enabled: !!session,
  })
}

export function useSetAttendance() {
  const { session } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'going' | 'not_going' | 'maybe' }) => {
      const res = await fetch(`${API_URL}/api/events/${eventId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to set attendance')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
