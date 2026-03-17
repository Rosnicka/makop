import { Hono } from 'hono'
import { db } from '../db/index.js'
import { teams, profiles } from '../db/schema.js'
import { eq } from 'drizzle-orm'

type Variables = { userId: string }

const teamsRoute = new Hono<{ Variables: Variables }>()

teamsRoute.post('/', async (c) => {
  const body = await c.req.json<{ name: string }>()
  const name = body.name?.trim()

  if (!name) {
    return c.json({ error: 'Team name is required' }, 400)
  }

  const userId = c.get('userId')

  const [team] = await db.insert(teams).values({ name }).returning()

  await db
    .update(profiles)
    .set({ teamId: team.id, role: 'captain' })
    .where(eq(profiles.id, userId))

  return c.json(team, 201)
})

export default teamsRoute
