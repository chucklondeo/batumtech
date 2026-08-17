import type { MetadataRoute } from 'next'
import { findPublicContent } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/products'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/news'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const [products, news] = await Promise.all([findPublicContent('products'), findPublicContent('news')])
    return [
      ...staticPages,
      ...products.map((item) => ({
        url: absoluteUrl(`/products/${item.legacyId ?? item.slug}`),
        lastModified: item.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...news.map((item) => ({
        url: absoluteUrl(`/news/${item.legacyId ?? item.slug}`),
        lastModified: item.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]
  } catch {
    return staticPages
  }
}

