import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const origin = 'https://batumtech.com'
const outputPath = path.resolve('docs/legacy-content-export.json')
const queue = ['/', '/index.php/product.html', '/index.php/news.html']
const queued = new Set(queue)
const visited = new Set()
const pages = new Map()
const errors = []

const decode = (value = '') => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')

const text = (html = '') => decode(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const capture = (html, pattern) => decode(html.match(pattern)?.[1]?.trim() || '')
const slugify = (type, id) => `${type}-${id}`

const sanitize = (html = '') => html
  .replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+\s*=\s*(["']).*?\1/gi, '')
  .replace(/\s+style\s*=\s*(["']).*?\1/gi, '')
  .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"')
  .trim()

const fetchPage = async (pathname) => {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(new URL(pathname, origin), {
        headers: { 'user-agent': 'Batumtech-Content-Migration/1.0' },
        signal: AbortSignal.timeout(20_000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.text()
    } catch (error) {
      lastError = error
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500))
    }
  }
  throw lastError
}

const normalizeLink = (raw, pagePath) => {
  try {
    const url = new URL(decode(raw), new URL(pagePath, origin))
    if (url.origin !== origin) return null
    if (!/^\/index\.php\/(?:product|news)(?:[/.?]|$)/i.test(`${url.pathname}${url.search}`)) return null
    url.hash = ''
    return `${url.pathname}${url.search}`
  } catch {
    return null
  }
}

while (queue.length && visited.size < 600) {
  const batch = queue.splice(0, 6)
  await Promise.all(batch.map(async (pathname) => {
    if (visited.has(pathname)) return
    visited.add(pathname)
    try {
      const html = await fetchPage(pathname)
      pages.set(pathname, html)
      for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
        const next = normalizeLink(match[1], pathname)
        if (next && !queued.has(next)) {
          queued.add(next)
          queue.push(next)
        }
      }
    } catch (error) {
      errors.push({ path: pathname, error: error instanceof Error ? error.message : String(error) })
    }
  }))
  console.log(`Crawled ${visited.size} pages; ${queue.length} queued`)
}

const categories = new Map()
const products = []
const news = []

for (const [pathname, html] of pages) {
  for (const match of html.matchAll(/<a[^>]+href=["']\/index\.php\/(product|news)\/typeid-(\d+)\.html["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const [, routeType, legacyId, label] = match
    const name = text(label)
    if (!name) continue
    const contentType = routeType.toLowerCase() === 'product' ? 'product' : 'news'
    categories.set(`${contentType}:${legacyId}`, {
      legacyId,
      contentType,
      name,
      slug: slugify(contentType === 'product' ? 'product-category' : 'news-category', legacyId),
      legacyUrl: `/index.php/${routeType.toLowerCase()}/typeid-${legacyId}.html`,
    })
  }

  let match = pathname.match(/^\/index\.php\/product\/typeid-(\d+)-id-(\d+)\.html$/i)
  if (match) {
    const [, categoryId, legacyId] = match
    const title = capture(html, /<h1[^>]*class=["'][^"']*h3[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)
    const rawContent = html.match(/<div[^>]+class=["'][^"']*cp-txt[^"']*["'][^>]*>([\s\S]*?)<div[^>]+class=["'][^"']*cp-tjbox/i)?.[1] || ''
    if (title && title !== '提示信息') {
      const legacyHtml = sanitize(rawContent)
      products.push({ legacyId, categoryLegacyId: categoryId, title, slug: slugify('product', legacyId),
        legacyUrl: pathname, summary: capture(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || text(legacyHtml).slice(0, 260),
        keywords: capture(html, /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)/i), legacyHtml,
        images: [...new Set([...legacyHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((item) => item[1]))] })
    }
    continue
  }

  const newsId = pathname.match(/^\/index\.php\/news\/(?:typeid-(\d+)-)?id-(\d+)\.html$/i)
  if (newsId) {
    const categoryId = newsId[1] || null
    const legacyId = newsId[2]
    const title = capture(html, /<h1[^>]*class=["'][^"']*h3[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)
    const rawContent = html.match(/<div[^>]+class=["'][^"']*nr-txt[^"']*["'][^>]*>([\s\S]*?)<ul[^>]+class=["'][^"']*pagws-ul/i)?.[1] || ''
    if (title && title !== '提示信息') {
      const legacyHtml = sanitize(rawContent)
      news.push({ legacyId, categoryLegacyId: categoryId, title, slug: slugify('news', legacyId), legacyUrl: pathname,
        publishedAt: html.match(/发布时间：\s*(\d{4}-\d{2}-\d{2})/)?.[1] || null,
        summary: capture(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || text(legacyHtml).slice(0, 260),
        keywords: capture(html, /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)/i), legacyHtml,
        images: [...new Set([...legacyHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((item) => item[1]))] })
    }
  }
}

const uniqueById = (items) => [...new Map(items.map((item) => [item.legacyId, item])).values()]
const output = {
  generatedAt: new Date().toISOString(), origin, pagesCrawled: pages.size, errors,
  categories: [...categories.values()], products: uniqueById(products), news: uniqueById(news),
}

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`)
console.log(JSON.stringify({ pages: pages.size, errors: errors.length, categories: output.categories.length,
  products: output.products.length, news: output.news.length }, null, 2))
