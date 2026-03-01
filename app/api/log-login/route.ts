import { NextRequest, NextResponse } from 'next/server'
import { auditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  const { email, userId, success } = await request.json()
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const userAgent = request.headers.get('user-agent') ?? 'unknown'

  await auditLog({
    level: success ? 'info' : 'warn',
    message: success ? 'User logged in' : 'Failed login attempt',
    userId: userId ?? undefined,
    ip,
    userAgent,
    context: { email },
  })

  return NextResponse.json({ ok: true })
}