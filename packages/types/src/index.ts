export type Role = 'captain' | 'player'

export interface Team {
  id: string
  name: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: Role
  teamId: string | null
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  description?: string
  createdBy: string
  createdAt: string
}

export interface Attendance {
  eventId: string
  userId: string
  status: 'going' | 'not_going' | 'maybe'
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  createdAt: string
}
