import { postgresAdapter } from '@payloadcms/db-postgres'
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
import { importLegacyContent } from './migrations/importLegacyContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseUrl = process.env.DATABASE_URL || ''
const payloadSecret = process.env.PAYLOAD_SECRET || (databaseUrl
  ? createHash('sha256').update(`batumtech-payload:${databaseUrl}`).digest('hex')
  : '')

export default buildConfig({
  admin: { user: Users.slug },
  onInit: async (payload) => {
    if (process.env.AUTO_MIGRATE_LEGACY === 'false') return
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
    push: process.env.PAYLOAD_DB_PUSH === 'true',
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
