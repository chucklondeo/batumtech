import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const manifestPath = path.resolve('docs/legacy-media-manifest.json')
const publicRoot = path.resolve('public')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

for (const asset of manifest.assets) {
  const localPath = path.resolve(publicRoot, asset.publicPath.replace(/^\/+/, ''))
  try {
    const bytes = await readFile(localPath)
    asset.bytes = bytes.length
    asset.sha256 = createHash('sha256').update(bytes).digest('hex')
    asset.status = 'downloaded'
    delete asset.error
  } catch {
    asset.status = 'failed'
    asset.error = 'Local file is missing'
    delete asset.bytes
    delete asset.sha256
  }
}

manifest.verifiedAt = new Date().toISOString()
manifest.totals = {
  discovered: manifest.assets.length,
  downloaded: manifest.assets.filter((asset) => asset.status === 'downloaded').length,
  failed: manifest.assets.filter((asset) => asset.status === 'failed').length,
  bytes: manifest.assets.reduce((sum, asset) => sum + (asset.bytes || 0), 0),
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify(manifest.totals, null, 2))

if (manifest.totals.failed) process.exit(1)
