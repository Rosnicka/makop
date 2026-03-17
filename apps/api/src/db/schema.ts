import { pgTable, text, timestamp, uuid, pgEnum, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const roleEnum = pgEnum('role', ['captain', 'player'])

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  role: roleEnum('role').notNull().default('player'),
  teamId: uuid('team_id').references(() => teams.id),
})

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'going',
  'not_going',
  'maybe',
])

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  opponent: text('opponent').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  location: text('location').notNull(),
  description: text('description'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const attendance = pgTable('attendance', {
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  status: attendanceStatusEnum('status').notNull(),
}, (t) => [primaryKey({ columns: [t.eventId, t.userId] })])

export const eventsRelations = relations(events, ({ many }) => ({
  attendance: many(attendance),
}))

export const attendanceRelations = relations(attendance, ({ one }) => ({
  event: one(events, { fields: [attendance.eventId], references: [events.id] }),
}))

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
