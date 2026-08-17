import type { Metadata } from 'next'
import Link from 'next/link'
import { findPublicContent } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '新闻资讯', alternates: { canonical: absoluteUrl('/news') } }
export const dynamic = 'force-dynamic'

export default async function NewsIndexPage() {
  const articles = await findPublicContent('news')
  return <main><h1>新闻资讯</h1>{articles.map((item) => <p key={item.id}><Link href={`/news/${item.legacyId ?? item.slug}`}>{item.title}</Link></p>)}</main>
}

