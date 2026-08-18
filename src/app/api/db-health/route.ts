import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

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
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users' })

    return NextResponse.json({ status: 'ok', database: 'connected', schema: 'ready' })
  } catch (error) {
    const code = classifyDatabaseError(error)
    console.error(`[db-health] ${code}`)

    return NextResponse.json(
      { status: 'error', database: 'unavailable', code },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    )
  }
}
