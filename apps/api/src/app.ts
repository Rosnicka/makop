import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware } from './middleware/auth.js'
import teamsRoute from './routes/teams.js'
import eventsRoute from './routes/events.js'

type Variables = {
  userId: string
}

const app = new Hono<{ Variables: Variables }>()

app.use('*', cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))

app.get('/', (c) => c.json({ ok: true }))

const api = new Hono<{ Variables: Variables }>()
api.use('*', authMiddleware)

api.get('/me', (c) => c.json({ userId: c.get('userId') }))
api.route('/teams', teamsRoute)
api.route('/events', eventsRoute)

app.route('/api', api)

export default app
