# Makop — Sunday League Football Team Manager

## Project Overview
Web app for managing a Sunday league football team.

**Core features:**
- Events (matches) with player attendance tracking
- Calendar of upcoming events
- Real-time chat between players
- Player list
- Auth with two roles: Captain (manages team) and Player

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Server state | TanStack Query |
| Routing | React Router v6 |
| Backend | Node.js + Hono + TypeScript |
| ORM | Drizzle ORM |
| Database | Supabase (PostgreSQL + Auth + Real-time) |
| Package manager | pnpm (workspaces monorepo) |
| Runtime manager | nvm (inside WSL2) |

---

## Monorepo Structure

```
makop/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Hono Node.js backend
├── packages/
│   └── types/        # Shared TypeScript types (used by both apps)
├── pnpm-workspace.yaml
├── package.json
└── CLAUDE.md
```

---

## Roles

- **Captain** — can create/edit/delete events, manage players
- **Player** — can view events, mark attendance, use chat

Role is stored as a custom claim in Supabase Auth JWT.

---

## Conventions

### TypeScript
- Strict mode enabled in all packages
- No `any` — use `unknown` and narrow types explicitly
- Shared types live in `packages/types`, imported as `@makop/types`

### File naming
- Components: PascalCase (`EventCard.tsx`)
- Utilities/hooks: camelCase (`useAttendance.ts`)
- Route files: kebab-case (`event-detail.tsx`)

### API
- REST-style endpoints via Hono
- All routes prefixed with `/api`
- Auth via Supabase JWT — verified in Hono middleware

### Frontend
- Use TanStack Query for all server data fetching — no raw fetch in components
- shadcn/ui components as the base — customize via Tailwind, don't override component internals
- Keep components small and focused — extract logic into hooks

### Database
- Schema defined with Drizzle ORM
- Migrations managed via Drizzle Kit
- Supabase client used for Auth and real-time subscriptions only

---

## Environment Variables

### apps/api (.env)
```
DATABASE_URL=           # Supabase PostgreSQL connection string
SUPABASE_URL=
SUPABASE_SERVICE_KEY=   # Server-side key (never expose to frontend)
PORT=3000
```

### apps/web (.env)
```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=   # Public anon key (safe for frontend)
```

---

## Key Commands

```bash
# Install all dependencies
pnpm install

# Run both apps in dev mode
pnpm dev

# Run frontend only
pnpm --filter web dev

# Run backend only
pnpm --filter api dev

# Add dependency to a specific app
pnpm --filter web add <package>
pnpm --filter api add <package>

# Add shared dev dependency to root
pnpm add -D -w <package>
```

---

## Development Environment
- OS: Windows 11 Pro
- Node.js runs inside WSL2 (Ubuntu)
- Node version managed via nvm
- Editor: VSCode with Remote WSL extension
- Project path in WSL2: `~/projects/makop`
