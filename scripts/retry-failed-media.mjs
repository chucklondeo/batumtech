import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const manifestPath = path.resolve('docs/legacy-media-manifest.json')
const publicRoot = path.resolve('public')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const failed = manifest.assets.filter((asset) => asset.status === 'failed')

for (const asset of failed) {
  const destination = path.resolve(publicRoot, asset.publicPath.replace(/^\/+/, ''))
  if (!destination.startsWith(publicRoot + path.sep)) throw new Error(`Unsafe path: ${asset.publicPath}`)
  let lastError
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(asset.sourceUrl, {
        headers: { 'user-agent': 'Batumtech-Migration/1.0' },
        signal: AbortSignal.timeout(60_000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const bytes = Buffer.from(await response.arrayBuffer())
      await mkdir(path.dirname(destination), { recursive: true })
      await writeFile(destination, bytes)
      Object.assign(asset, {
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        contentType: response.headers.get('content-type'),
        status: 'downloaded',
      })
      delete asset.error
      lastError = null
      break
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) asset.error = lastError instanceof Error ? lastError.message : String(lastError)
  console.log(`${asset.status}: ${asset.publicPath}`)
}

manifest.generatedAt = new Date().toISOString()
manifest.totals.downloaded = manifest.assets.filter((asset) => asset.status === 'downloaded').length
manifest.totals.failed = manifest.assets.filter((asset) => asset.status === 'failed').length
manifest.totals.bytes = manifest.assets.reduce((sum, asset) => sum + (asset.bytes || 0), 0)
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify(manifest.totals, null, 2))
