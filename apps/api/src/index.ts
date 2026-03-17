import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware } from './middleware/auth.js'
import teamsRoute from './routes/teams.js'

type Variables = {
  userId: string
}

const app = new Hono<{ Variables: Variables }>()

app.use('*', cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))

app.get('/', (c) => c.json({ ok: true }))

// Chráněné routes
const api = new Hono<{ Variables: Variables }>()
api.use('*', authMiddleware)

api.get('/me', (c) => c.json({ userId: c.get('userId') }))
api.route('/teams', teamsRoute)

app.route('/api', api)

const port = Number(process.env.PORT) || 3000

serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`)
})
