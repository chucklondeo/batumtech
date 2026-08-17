const fetchOrigin = (process.env.SEO_FETCH_ORIGIN || 'https://batumtech.com').replace(/\/$/, '')
const canonicalOrigin = 'https://batumtech.com'
const failures = []

const request = async (pathname, options = {}) => {
  const response = await fetch(`${fetchOrigin}${pathname}`, {
    redirect: 'manual',
    headers: { 'user-agent': 'Batumtech-SEO-Monitor/1.0' },
    ...options,
  })
  return { response, body: await response.text() }
}

const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

const extract = (body, pattern) => body.match(pattern)?.[1]?.trim()

const pages = ['/', '/products', '/news', '/about', '/contact']
for (const pathname of pages) {
  const { response, body } = await request(pathname)
  expect(response.status === 200, `${pathname} expected 200, got ${response.status}`)
  expect(!/noindex/i.test(body), `${pathname} unexpectedly contains noindex`)
  expect(Boolean(extract(body, /<title[^>]*>([^<]+)<\/title>/i)), `${pathname} has no title`)
  expect(Boolean(extract(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i)), `${pathname} has no H1`)
  const canonical = extract(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  expect(canonical === `${canonicalOrigin}${pathname === '/' ? '' : pathname}` || canonical === `${canonicalOrigin}${pathname}`, `${pathname} canonical is ${canonical || 'missing'}`)
}

const robots = await request('/robots.txt')
expect(robots.response.status === 200, `robots.txt expected 200, got ${robots.response.status}`)
expect(robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), 'robots.txt sitemap host is incorrect')
expect(!/Disallow:\s*\/uploadfile/i.test(robots.body), 'robots.txt blocks legacy product images')

const sitemap = await request('/sitemap.xml')
expect(sitemap.response.status === 200, `sitemap.xml expected 200, got ${sitemap.response.status}`)
expect(sitemap.body.includes(`<loc>${canonicalOrigin}/`), 'sitemap.xml has no Batumtech canonical URLs')
expect(!/batumparking\.cn/i.test(sitemap.body), 'sitemap.xml contains batumparking.cn')
expect(!/<loc>https?:\/\/www\.batumtech\.com/i.test(sitemap.body), 'sitemap.xml contains www duplicate host')

const redirects = new Map([
  ['/index.php/product.html', '/products'],
  ['/index.php/news.html', '/news'],
  ['/index.php/about.html', '/about'],
  ['/index.php/contact.html', '/contact'],
  ['/index.php/product/typeid-50-id-33.html', '/products/33'],
  ['/index.php/news/id-241.html', '/news/241'],
])

for (const [source, target] of redirects) {
  const { response } = await request(source)
  expect(response.status === 301, `${source} expected 301, got ${response.status}`)
  expect(response.headers.get('location') === `${canonicalOrigin}${target}`, `${source} redirects to ${response.headers.get('location') || 'nowhere'}`)
}

if (failures.length) {
  console.error(`SEO audit failed for ${fetchOrigin}:`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`SEO audit passed for ${fetchOrigin}: ${pages.length} pages, robots, sitemap and ${redirects.size} redirects.`)
