import { NextResponse } from 'next/server'
import { runtimeEnv } from '@/lib/runtimeEnv'

export const dynamic = 'force-dynamic'

const classifyDatabaseError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)

  if (/missing secret key|secret key is needed/i.test(message)) return 'PAYLOAD_SECRET_MISSING'
  if (/password authentication failed|authentication failed/i.test(message)) return 'DATABASE_AUTH_FAILED'
  if (/getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(message)) return 'DATABASE_DNS_FAILED'
  if (/ECONNREFUSED|connection refused/i.test(message)) return 'DATABASE_CONNECTION_REFUSED'
  if (/ETIMEDOUT|timeout|timed out/i.test(message)) return 'DATABASE_CONNECTION_TIMEOUT'
  if (/self[- ]signed|certificate|SSL|TLS/i.test(message)) return 'DATABASE_SSL_FAILED'
  if (/relation .* does not exist|undefined table/i.test(message)) return 'DATABASE_SCHEMA_MISSING'
  if (/connection string|DATABASE_URL|invalid url/i.test(message)) return 'DATABASE_URL_INVALID'

  return 'DATABASE_UNKNOWN_ERROR'
}

export async function GET() {
  const environment = {
    databaseUrlConfigured: Boolean(runtimeEnv('DATABASE_URL')),
    payloadSecretConfigured: Boolean(runtimeEnv('PAYLOAD_SECRET')),
    databasePushEnabled: runtimeEnv('PAYLOAD_DB_PUSH').toLowerCase() === 'true',
  }
  try {
    const [{ default: config }, { getPayload }] = await Promise.all([
      import('@payload-config'),
      import('payload'),
    ])
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users' })

    return NextResponse.json({ status: 'ok', database: 'connected', schema: 'ready', environment })
  } catch (error) {
    const code = classifyDatabaseError(error)
    console.error(`[db-health] ${code}`)

    return NextResponse.json(
      { status: 'error', database: 'unavailable', code, environment },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    )
  }
}
