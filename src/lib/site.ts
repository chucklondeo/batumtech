export const PRIMARY_HOST = 'batumtech.com'
export const PRIMARY_ORIGIN = `https://${PRIMARY_HOST}`
export const LEGACY_HOSTS = new Set(['batumparking.cn', 'www.batumparking.cn'])

export const absoluteUrl = (pathname = '/') => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(normalizedPath, PRIMARY_ORIGIN).toString()
}

