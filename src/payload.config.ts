import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: { user: Users.slug },
  collections: [Users, Tenants, Media, Categories, Products, News, Cases, SiteSettings, Redirects],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
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
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
