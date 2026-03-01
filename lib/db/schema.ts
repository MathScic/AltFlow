import { pgTable, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core'

// ─── ENUMS ───
export const roleEnum = pgEnum('role', ['admin', 'member', 'viewer'])
export const planEnum = pgEnum('plan', ['free', 'pro'])
export const logLevelEnum = pgEnum('log_level', ['info', 'warn', 'error'])
export const statusEnum = pgEnum('status', ['active', 'canceled', 'past_due'])

// ─── USERS (compatible Better Auth) ───
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  name: text('name').notNull(),
  image: text('image'),
  role: roleEnum('role').default('member').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── SESSIONS (compatible Better Auth) ───
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  device: text('device'),
  ip: text('ip'),
  ipAddress: text('ip_address'), // ← ajoute cette ligne
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

// ─── ACCOUNTS (requis par Better Auth) ───
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── VERIFICATION (requis par Better Auth) ───
export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── LOGS ───
export const logs = pgTable('logs', {
  id: text('id').primaryKey(),
  level: logLevelEnum('level').notNull(),
  message: text('message').notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  ip: text('ip'),
  userAgent: text('user_agent'),
  context: text('context'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── SUBSCRIPTIONS ───
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id'),
  plan: planEnum('plan').default('free').notNull(),
  status: statusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})