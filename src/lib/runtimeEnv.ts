export const runtimeEnv = (name: string) => {
  const env = process.env as Record<string, string | undefined>
  return env[name]?.trim() || ''
}
