import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentPage } from '@/components/ContentPage'
import { findByLegacyId } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

type PageProps = { params: Promise<{ legacyId: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { legacyId } = await params
  const article = await findByLegacyId('news', legacyId)
  if (!article) return {}
  return {
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.summary,
    alternates: { canonical: absoluteUrl(`/news/${legacyId}`) },
  }
}

export default async function NewsPage({ params }: PageProps) {
  const { legacyId } = await params
  const article = await findByLegacyId('news', legacyId)
  if (!article) notFound()
  return <ContentPage content={article} />
}

