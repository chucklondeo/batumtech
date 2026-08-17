import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentPage } from '@/components/ContentPage'
import { findByLegacyId } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

type PageProps = { params: Promise<{ legacyId: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { legacyId } = await params
  const product = await findByLegacyId('products', legacyId)
  if (!product) return {}
  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.summary,
    alternates: { canonical: absoluteUrl(`/products/${legacyId}`) },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { legacyId } = await params
  const product = await findByLegacyId('products', legacyId)
  if (!product) notFound()
  return <ContentPage content={product} />
}

