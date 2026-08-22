import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
}

const payloadConfig = withPayload(nextConfig)

// Payload excludes drizzle-kit from standalone traces because normal production deployments use
// migrations. Batumtech needs it for one guarded first-run schema bootstrap, so retain the package
// as an external dependency and explicitly copy its runtime files into the server output.
const tracingExcludes = payloadConfig.outputFileTracingExcludes?.['**/*'] ?? []
payloadConfig.outputFileTracingExcludes = {
  ...payloadConfig.outputFileTracingExcludes,
  '**/*': tracingExcludes.filter(
    (entry) => entry !== 'drizzle-kit' && entry !== 'drizzle-kit/api',
  ),
}
payloadConfig.outputFileTracingIncludes = {
  ...payloadConfig.outputFileTracingIncludes,
  '**/*': [
    ...(payloadConfig.outputFileTracingIncludes?.['**/*'] ?? []),
    './node_modules/drizzle-kit/**/*',
    './node_modules/.pnpm/drizzle-kit@*/node_modules/drizzle-kit/**/*',
  ],
}

export default payloadConfig
