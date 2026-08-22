import { postgresAdapter } from '@payloadcms/db-postgres'
import { pushDevSchema, type DrizzleAdapter } from '@payloadcms/drizzle'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Cases } from './collections/Cases'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Products } from './collections/Products'
import { Redirects } from './collections/Redirects'
import { SiteSettings } from './collections/SiteSettings'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { runtimeDatabaseUrl, runtimeEnv } from './lib/runtimeEnv'
import { importLegacyContent } from './migrations/importLegacyContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseUrl = runtimeDatabaseUrl()
const payloadSecret = runtimeEnv('PAYLOAD_SECRET') || (databaseUrl
  ? createHash('sha256').update(`batumtech-payload:${databaseUrl}`).digest('hex')
  : '')

const errorChainMessage = (error: unknown) => {
  const messages: string[] = []
  let current: unknown = error
  for (let depth = 0; current && depth < 5; depth += 1) {
    messages.push(current instanceof Error ? current.message : String(current))
    current = typeof current === 'object' && current && 'cause' in current
      ? (current as { cause?: unknown }).cause
      : null
  }
  return messages.join('\n')
}

export default buildConfig({
  admin: { user: Users.slug },
  onInit: async (payload) => {
    const bootstrapEnabled = ['true', '1', 'yes'].includes(
      (runtimeEnv('PAYLOAD_DB_BOOTSTRAP') || runtimeEnv('PAYLOAD_DB_PUSH')).toLowerCase(),
    )

    if (bootstrapEnabled) {
      try {
        await payload.count({ collection: 'users' })
      } catch (error) {
        const message = errorChainMessage(error)
        if (!/relation .*users.* does not exist|undefined table/i.test(message)) throw error

        payload.logger.info('Payload schema is missing; starting one-time database bootstrap.')
        await pushDevSchema(payload.db as DrizzleAdapter)
        payload.logger.info('Payload database schema bootstrap completed.')
      }
    }

    if (runtimeEnv('AUTO_MIGRATE_LEGACY').toLowerCase() === 'false') return
    try {
      await importLegacyContent(payload)
      payload.logger.info('Legacy Batumtech content is synchronized.')
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Legacy content synchronization failed.' })
    }
  },
  collections: [Users, Tenants, Media, Categories, Products, News, Cases, SiteSettings, Redirects],
  db: postgresAdapter({
    pool: { connectionString: databaseUrl },
    // Payload ignores push mode in production. Production bootstrap is guarded in onInit above.
    push: process.env.NODE_ENV !== 'production',
  }),
  editor: lexicalEditor(),
  plugins: [
    multiTenantPlugin({
      tenantsSlug: 'tenants',
      userHasAccessToAllTenants: (user) => Boolean(user?.roles?.includes('super-admin')),
      collections: {
        media: {},
        categories: {},
        products: {},
        news: {},
        cases: {},
        redirects: {},
        'site-settings': { isGlobal: true },
      },
    }),
  ],
  secret: payloadSecret,
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
