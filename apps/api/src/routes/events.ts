import { Hono } from 'hono'
import { db } from '../db/index.js'
import { events, attendance, profiles } from '../db/schema.js'
import { eq } from 'drizzle-orm'

type Variables = { userId: string }

const eventsRoute = new Hono<{ Variables: Variables }>()

async function getProfile(userId: string) {
  return db.query.profiles.findFirst({ where: eq(profiles.id, userId) })
}

eventsRoute.get('/', async (c) => {
  const userId = c.get('userId')
  const profile = await getProfile(userId)

  if (!profile?.teamId) return c.json({ error: 'Not in a team' }, 403)

  const teamEvents = await db.query.events.findMany({
    where: eq(events.teamId, profile.teamId),
    with: { attendance: true },
    orderBy: (e, { asc }) => [asc(e.date)],
  })

  return c.json(teamEvents)
})

eventsRoute.post('/', async (c) => {
  const userId = c.get('userId')
  const profile = await getProfile(userId)

  if (!profile?.teamId) return c.json({ error: 'Not in a team' }, 403)
  if (profile.role !== 'captain') return c.json({ error: 'Only captains can create events' }, 403)

  const body = await c.req.json<{
    opponent: string
    date: string
    location: string
    description?: string
  }>()

  const [event] = await db.insert(events).values({
    teamId: profile.teamId,
    opponent: body.opponent.trim(),
    date: new Date(body.date),
    location: body.location.trim(),
    description: body.description?.trim() || null,
    createdBy: userId,
  }).returning()

  return c.json(event, 201)
})

eventsRoute.put('/:id/attendance', async (c) => {
  const userId = c.get('userId')
  const eventId = c.req.param('id')
  const body = await c.req.json<{ status: 'going' | 'not_going' | 'maybe' }>()

  await db.insert(attendance)
    .values({ eventId, userId, status: body.status })
    .onConflictDoUpdate({
      target: [attendance.eventId, attendance.userId],
      set: { status: body.status },
    })

  return c.json({ ok: true })
})

export default eventsRoute
