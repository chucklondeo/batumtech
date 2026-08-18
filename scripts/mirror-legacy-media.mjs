import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const legacyOrigin = 'https://batumtech.com'
const outputRoot = path.resolve('public')
const manifestPath = path.resolve('docs/legacy-media-manifest.json')
const allowedPrefixes = ['/uploadfile/upfiles/', '/uploadfile/editors/']
const assetPattern = /(?:src|href)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)/gi
const imagePattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i
const requestHeaders = { 'user-agent': 'Batumtech-Migration/1.0' }

const fetchWithRetry = async (url, attempts = 3) => {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, { headers: requestHeaders, signal: AbortSignal.timeout(20_000) })
    } catch (error) {
      lastError = error
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 500))
    }
  }
  throw lastError
}

const fetchText = async (url) => {
  const response = await fetchWithRetry(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

const sitemap = await fetchText(`${legacyOrigin}/sitemap.xml`)
const pageUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const source = new URL(match[1])
  return new URL(`${source.pathname}${source.search}`, legacyOrigin).toString()
})

const assetUrls = new Set()
const pageErrors = []

for (let offset = 0; offset < pageUrls.length; offset += 8) {
  const batch = pageUrls.slice(offset, offset + 8)
  await Promise.all(batch.map(async (pageUrl) => {
    try {
      const html = await fetchText(pageUrl)
      for (const match of html.matchAll(assetPattern)) {
        const raw = (match[1] || match[2] || '').trim()
        if (!raw || raw.startsWith('data:')) continue
        const asset = new URL(raw, pageUrl)
        if (asset.origin !== legacyOrigin) continue
        if (!allowedPrefixes.some((prefix) => asset.pathname.startsWith(prefix))) continue
        if (!imagePattern.test(asset.pathname)) continue
        asset.search = ''
        asset.hash = ''
        assetUrls.add(asset.toString())
      }
    } catch (error) {
      pageErrors.push({ url: pageUrl, error: error instanceof Error ? error.message : String(error) })
    }
  }))
  console.log(`Scanned ${Math.min(offset + batch.length, pageUrls.length)}/${pageUrls.length} pages`)
}

const assets = []
const sortedAssets = [...assetUrls].sort()
for (let offset = 0; offset < sortedAssets.length; offset += 6) {
  const batch = sortedAssets.slice(offset, offset + 6)
  await Promise.all(batch.map(async (assetUrl) => {
    const url = new URL(assetUrl)
    const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, '')
    const destination = path.resolve(outputRoot, relativePath)
    if (!destination.startsWith(outputRoot + path.sep)) throw new Error(`Unsafe path: ${relativePath}`)

    try {
      const response = await fetchWithRetry(assetUrl)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const bytes = Buffer.from(await response.arrayBuffer())
      await mkdir(path.dirname(destination), { recursive: true })
      await writeFile(destination, bytes)
      assets.push({ sourceUrl: assetUrl, publicPath: url.pathname, bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        contentType: response.headers.get('content-type'), status: 'downloaded' })
    } catch (error) {
      assets.push({ sourceUrl: assetUrl, publicPath: url.pathname, status: 'failed',
        error: error instanceof Error ? error.message : String(error) })
    }
  }))
  console.log(`Downloaded ${Math.min(offset + batch.length, sortedAssets.length)}/${sortedAssets.length} assets`)
}

const manifest = {
  generatedAt: new Date().toISOString(),
  legacyOrigin,
  pagesScanned: pageUrls.length,
  pageErrors,
  assets,
  totals: {
    discovered: assetUrls.size,
    downloaded: assets.filter((asset) => asset.status === 'downloaded').length,
    failed: assets.filter((asset) => asset.status === 'failed').length,
    bytes: assets.reduce((sum, asset) => sum + (asset.bytes || 0), 0),
  },
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify(manifest.totals, null, 2))
