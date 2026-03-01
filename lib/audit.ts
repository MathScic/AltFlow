import { db } from './db'
import { logs } from './db/schema'
import { nanoid } from 'nanoid'

type LogLevel = 'info' | 'warn' | 'error'

interface AuditLogParams {
  level: LogLevel
  message: string
  userId?: string
  ip?: string
  userAgent?: string
  context?: Record<string, unknown>
}

export async function auditLog({
  level,
  message,
  userId,
  ip,
  userAgent,
  context,
}: AuditLogParams) {
  try {
    await db.insert(logs).values({
      id: nanoid(),
      level,
      message,
      userId: userId ?? null,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
      context: context ? JSON.stringify(context) : null,
    })
  } catch (error) {
    console.error('[AuditLog] Failed to write log:', error)
  }
}