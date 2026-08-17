import config from '@payload-config'
import { getPayload } from 'payload'

export type PublicContent = {
  id: number | string
  legacyId?: string | null
  publishedAt?: string | null
  seo?: { description?: string | null; noIndex?: boolean | null; title?: string | null } | null
  slug: string
  summary?: string | null
  title: string
  updatedAt: string
}

export type PublicCategory = {
  id: number | string
  legacyId?: string | null
  name: string
  seo?: { description?: string | null; title?: string | null } | null
}

export const findByLegacyId = async (collection: 'products' | 'news', legacyId: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection,
    depth: 1,
    draft: false,
    limit: 1,
    where: { legacyId: { equals: legacyId } },
  })
  return (result.docs[0] as PublicContent | undefined) ?? null
}

export const findPublicContent = async (collection: 'products' | 'news') => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection,
    depth: 0,
    draft: false,
    limit: 1000,
    pagination: false,
    sort: '-publishedAt',
    where: { 'seo.noIndex': { not_equals: true } },
  })
  return result.docs as PublicContent[]
}

export const findPublicContentOrEmpty = async (collection: 'products' | 'news') => {
  try {
    return await findPublicContent(collection)
  } catch {
    return []
  }
}

export const findCategoryContent = async (
  collection: 'products' | 'news',
  contentType: 'product' | 'news',
  legacyTypeId: string,
) => {
  const payload = await getPayload({ config })
  const categoryResult = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    where: {
      and: [
        { legacyId: { equals: legacyTypeId } },
        { contentType: { equals: contentType } },
      ],
    },
  })
  const category = categoryResult.docs[0] as PublicCategory | undefined
  if (!category) return null

  const contentResult = await payload.find({
    collection,
    depth: 0,
    draft: false,
    limit: 1000,
    pagination: false,
    sort: '-publishedAt',
    where: { category: { equals: category.id } },
  })

  return { category, docs: contentResult.docs as PublicContent[] }
}
