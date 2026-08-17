import { writeFile } from 'node:fs/promises'

const sitemapUrl = 'https://batumtech.com/sitemap.xml'
const outputPath = new URL('../docs/url-migration-inventory.csv', import.meta.url)

const response = await fetch(sitemapUrl, {
  headers: { 'user-agent': 'BatumtechMigrationAudit/1.0' },
})

if (!response.ok) {
  throw new Error(`Unable to fetch ${sitemapUrl}: HTTP ${response.status}`)
}

const xml = await response.text()
const entries = [...xml.matchAll(/<url>\s*<loc>([\s\S]*?)<\/loc>\s*<lastmod>([\s\S]*?)<\/lastmod>\s*<priority>([\s\S]*?)<\/priority>\s*<\/url>/gi)]

const decodeXml = (value) => value.replaceAll('&amp;', '&').trim()
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

const classify = (url) => {
  const path = url.pathname
  if (/\/product\/typeid-\d+\.html$/i.test(path)) return 'product_category'
  if (/\/product\/(?:typeid-\d+-)?id-\d+\.html$/i.test(path)) return 'product_detail'
  if (/\/product\.html$/i.test(path)) return url.search ? 'product_pagination' : 'product_index'
  if (/\/news\/typeid-\d+\.html$/i.test(path)) return url.search ? 'news_category_pagination' : 'news_category'
  if (/\/news\/(?:typeid-\d+-)?id-\d+\.html$/i.test(path)) return 'news_detail'
  if (/\/news\.html$/i.test(path)) return url.search ? 'news_pagination' : 'news_index'
  if (/\/about\.html$/i.test(path)) return 'about'
  if (/\/contact\.html$/i.test(path)) return 'contact'
  if (path === '/' || path === '') return 'home'
  return 'anomalous_or_other'
}

const targetFor = (pageType, id, typeId) => {
  const origin = 'https://batumtech.com'
  if (pageType === 'home') return `${origin}/`
  if (pageType === 'product_detail') return `${origin}/products/${id}`
  if (pageType === 'product_category') return `${origin}/products/category/${typeId}`
  if (pageType === 'product_index' || pageType === 'product_pagination') return `${origin}/products`
  if (pageType === 'news_detail') return `${origin}/news/${id}`
  if (pageType === 'news_category' || pageType === 'news_category_pagination') return `${origin}/news/category/${typeId}`
  if (pageType === 'news_index' || pageType === 'news_pagination') return `${origin}/news`
  if (pageType === 'about') return `${origin}/about`
  if (pageType === 'contact') return `${origin}/contact`
  return ''
}

const rows = []
for (const match of entries) {
  const sourceUrl = decodeXml(match[1])
  const parsed = new URL(sourceUrl)
  const id = parsed.pathname.match(/(?:\/|-)id-(\d+)\.html$/i)?.[1] ?? ''
  const typeId = parsed.pathname.match(/typeid-(\d+)/i)?.[1] ?? ''
  const normalized = `${parsed.protocol}//${parsed.hostname.toLowerCase()}${parsed.pathname}${parsed.search}`

  const pageType = classify(parsed)
  const targetUrl = targetFor(pageType, id, typeId)
  rows.push({
    source_url: sourceUrl,
    normalized_source: normalized,
    source_host: parsed.hostname,
    page_type: pageType,
    legacy_id: id,
    legacy_type_id: typeId,
    target_url: targetUrl,
    action: targetUrl ? 'permanent_redirect' : 'gone',
    status_code: targetUrl ? '301' : '410',
    canonical_target: targetUrl,
    priority: decodeXml(match[3]),
    lastmod: decodeXml(match[2]),
    evidence: 'batumtech.com/sitemap.xml fetched 2026-08-17',
    status: targetUrl ? 'mapped_to_batumtech.com' : 'mapped_to_410',
    notes: parsed.hostname === 'www.batumparking.cn' ? 'Sitemap host differs from current batumtech.com host' : '',
  })
}

const headers = Object.keys(rows[0] ?? {})
const output = [headers.map(csv).join(','), ...rows.map((row) => headers.map((header) => csv(row[header])).join(','))].join('\n') + '\n'
await writeFile(outputPath, output, 'utf8')

const counts = rows.reduce((result, row) => {
  result[row.page_type] = (result[row.page_type] ?? 0) + 1
  return result
}, {})

console.log(JSON.stringify({ sitemapUrl, total: rows.length, counts }, null, 2))
