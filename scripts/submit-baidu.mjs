const token = process.env.BAIDU_PUSH_TOKEN
const site = 'https://batumtech.com'

if (!token) {
  console.log('BAIDU_PUSH_TOKEN is not configured; skipping Baidu URL submission.')
  process.exit(0)
}

const sitemapResponse = await fetch(`${site}/sitemap.xml`)
if (!sitemapResponse.ok) throw new Error(`Unable to fetch sitemap: HTTP ${sitemapResponse.status}`)

const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith(`${site}/`))

if (!urls.length) throw new Error('No canonical Batumtech URLs found in sitemap.')

const response = await fetch(`https://data.zz.baidu.com/urls?site=${encodeURIComponent(site)}&token=${encodeURIComponent(token)}`, {
  method: 'POST',
  headers: { 'content-type': 'text/plain' },
  body: urls.join('\n'),
})
const result = await response.text()
if (!response.ok) throw new Error(`Baidu submission failed: HTTP ${response.status} ${result}`)

console.log(`Submitted ${urls.length} canonical URLs to Baidu. Response: ${result}`)
