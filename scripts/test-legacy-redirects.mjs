import assert from 'node:assert/strict'
import { resolveLegacyPath } from '../src/lib/legacyRedirects.ts'

const redirects = new Map([
  ['/index.php/product/typeid-50-id-33.html', '/products/33'],
  ['/index.php/product/id-33.html', '/products/33'],
  ['/index.php/product/typeid-50.html', '/products/category/50'],
  ['/index.php/product.html', '/products'],
  ['/index.php/news/typeid-101-id-241.html', '/news/241'],
  ['/index.php/news/id-241.html', '/news/241'],
  ['/index.php/news/typeid-101.html', '/news/category/101'],
  ['/index.php/news.html', '/news'],
  ['/index.php/about.html', '/about'],
  ['/index.php/contact.html', '/contact'],
])

for (const [source, expected] of redirects) {
  assert.deepEqual(resolveLegacyPath(source), { kind: 'redirect', pathname: expected })
}

for (const source of [
  '/index.php/product/typeid--id-.html',
  '/index.php/product/www.batumtech.com',
  '/www.magneticchina.cn',
]) {
  assert.deepEqual(resolveLegacyPath(source), { kind: 'gone' })
}

assert.deepEqual(resolveLegacyPath('/products/33'), { kind: 'unmatched' })
console.log(`Validated ${redirects.size + 4} legacy routing cases.`)

