import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPage } from '@/components/CategoryPage'
import { findCategoryContent } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

type PageProps = { params: Promise<{ legacyTypeId: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { legacyTypeId } = await params
  const result = await findCategoryContent('products', 'product', legacyTypeId)
  if (!result) return {}
  return {
    title: result.category.seo?.title || result.category.name,
    description: result.category.seo?.description,
    alternates: { canonical: absoluteUrl(`/products/category/${legacyTypeId}`) },
  }
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { legacyTypeId } = await params
  const result = await findCategoryContent('products', 'product', legacyTypeId)
  if (!result) notFound()
  return <CategoryPage basePath="/products" category={result.category} docs={result.docs} />
}

