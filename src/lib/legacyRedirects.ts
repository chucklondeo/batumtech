export type LegacyResolution =
  | { kind: 'gone' }
  | { kind: 'redirect'; pathname: string; preservePage?: boolean }
  | { kind: 'unmatched' }

const match = (pathname: string, pattern: RegExp) => pathname.match(pattern)

export const resolveLegacyPath = (pathname: string): LegacyResolution => {
  if (
    /(?:^|\/)(?:www\.)?(?:batumtech|batumparking|magneticchina)\.(?:com|cn)(?:\/|$)/i.test(pathname) ||
    /typeid--id-/i.test(pathname)
  ) {
    return { kind: 'gone' }
  }

  let result = match(pathname, /^\/index\.php\/product\/typeid-(\d+)-id-(\d+)\.html$/i)
  if (result) return { kind: 'redirect', pathname: `/products/${result[2]}` }

  result = match(pathname, /^\/index\.php\/product\/id-(\d+)\.html$/i)
  if (result) return { kind: 'redirect', pathname: `/products/${result[1]}` }

  result = match(pathname, /^\/index\.php\/product\/typeid-(\d+)\.html$/i)
  if (result) return { kind: 'redirect', pathname: `/products/category/${result[1]}` }

  if (/^\/index\.php\/product\.html$/i.test(pathname)) return { kind: 'redirect', pathname: '/products' }

  result = match(pathname, /^\/index\.php\/news\/typeid-(\d+)-id-(\d+)\.html$/i)
  if (result) return { kind: 'redirect', pathname: `/news/${result[2]}` }

  result = match(pathname, /^\/index\.php\/news\/id-(\d+)\.html$/i)
  if (result) return { kind: 'redirect', pathname: `/news/${result[1]}` }

  result = match(pathname, /^\/index\.php\/news\/typeid-(\d+)\.html$/i)
  if (result) return { kind: 'redirect', pathname: `/news/category/${result[1]}` }

  if (/^\/index\.php\/news\.html$/i.test(pathname)) {
    return { kind: 'redirect', pathname: '/news' }
  }

  if (/^\/index\.php\/about\.html$/i.test(pathname)) return { kind: 'redirect', pathname: '/about' }
  if (/^\/index\.php\/contact\.html$/i.test(pathname)) return { kind: 'redirect', pathname: '/contact' }

  return { kind: 'unmatched' }
}
