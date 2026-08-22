declare module 'drizzle-kit/api' {
  import type { RequireDrizzleKit } from '@payloadcms/drizzle'

  type DrizzleKit = ReturnType<RequireDrizzleKit>

  export const generateDrizzleJson: DrizzleKit['generateDrizzleJson']
  export const generateMigration: DrizzleKit['generateMigration']
  export const pushSchema: DrizzleKit['pushSchema']
  export const upPgSnapshot: NonNullable<DrizzleKit['upSnapshot']>
}
