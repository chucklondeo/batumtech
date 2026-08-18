export const runtimeEnv = (name: string) => {
  const env = process.env as Record<string, string | undefined>
  return env[name]?.trim() || ''
}

export const databaseEnvNames = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRESQL_URL',
  'SUPABASE_DB_URL',
  'SUPABASE_DATABASE_URL',
] as const

export const runtimeDatabaseUrl = () => {
  for (const name of databaseEnvNames) {
    const value = runtimeEnv(name)
    if (value) return value
  }
  return ''
}
