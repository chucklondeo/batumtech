import { NextRequest, NextResponse } from 'next/server'
import { LEGACY_HOSTS, PRIMARY_HOST, PRIMARY_ORIGIN } from './lib/site'
import { resolveLegacyPath } from './lib/legacyRedirects'

export function middleware(request: NextRequest) {
  const requestHost = request.headers.get('host')?.split(':')[0].toLowerCase() ?? ''
  const resolution = resolveLegacyPath(request.nextUrl.pathname)

  if (resolution.kind === 'gone') {
    return new NextResponse('Gone', {
      status: 410,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
    })
  }

  if (resolution.kind === 'redirect') {
    const target = new URL(resolution.pathname, PRIMARY_ORIGIN)
    if (resolution.preservePage) {
      const page = request.nextUrl.searchParams.get('page')
      if (page && /^\d+$/.test(page)) target.searchParams.set('page', page)
    }
    return NextResponse.redirect(target, 301)
  }

  if (LEGACY_HOSTS.has(requestHost) || requestHost === `www.${PRIMARY_HOST}`) {
    return NextResponse.redirect(new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, PRIMARY_ORIGIN), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico).*)'],
}

