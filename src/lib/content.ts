import config from '@payload-config'
import { getPayload } from 'payload'
import legacyExport from '../../docs/legacy-content-export.json'

export type PublicContent = {
  id: number | string
  legacyId?: string | null
  legacyHtml?: string | null
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

type LegacyItem = (typeof legacyExport.products)[number] | (typeof legacyExport.news)[number]

const migratedItems = (collection: 'products' | 'news'): PublicContent[] => {
  const items = collection === 'products' ? legacyExport.products : legacyExport.news
  return items.map((item: LegacyItem) => ({
    id: `legacy-${collection}-${item.legacyId}`,
    legacyId: item.legacyId,
    legacyHtml: item.legacyHtml,
    publishedAt: 'publishedAt' in item ? item.publishedAt : null,
    seo: { description: item.summary || null, noIndex: false, title: item.title },
    slug: item.slug,
    summary: item.summary,
    title: item.title,
    updatedAt: ('publishedAt' in item && item.publishedAt) || legacyExport.generatedAt,
  }))
}

const migratedCategory = (contentType: 'product' | 'news', legacyId: string): PublicCategory | null => {
  const item = legacyExport.categories.find((category) => (
    category.contentType === contentType && category.legacyId === legacyId
  ))
  if (!item) return null
  return { id: `legacy-category-${contentType}-${legacyId}`, legacyId, name: item.name }
}

export const findByLegacyId = async (collection: 'products' | 'news', legacyId: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection,
      depth: 1,
      draft: false,
      limit: 1,
      where: { legacyId: { equals: legacyId } },
    })
    if (result.docs[0]) return result.docs[0] as PublicContent
  } catch {
    // The bundled migration export keeps public pages available while Payload is initialized.
  }
  return migratedItems(collection).find((item) => item.legacyId === legacyId) ?? null
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
    const docs = await findPublicContent(collection)
    return docs.length ? docs : migratedItems(collection)
  } catch {
    return migratedItems(collection)
  }
}

export const findCategoryContent = async (
  collection: 'products' | 'news',
  contentType: 'product' | 'news',
  legacyTypeId: string,
) => {
  try {
    const payload = await getPayload({ config })
    const categoryResult = await payload.find({
      collection: 'categories', depth: 0, limit: 1,
      where: { and: [{ legacyId: { equals: legacyTypeId } }, { contentType: { equals: contentType } }] },
    })
    const category = categoryResult.docs[0] as PublicCategory | undefined
    if (category) {
      const contentResult = await payload.find({
        collection, depth: 0, draft: false, limit: 1000, pagination: false,
        sort: '-publishedAt', where: { category: { equals: category.id } },
      })
      if (contentResult.docs.length) return { category, docs: contentResult.docs as PublicContent[] }
    }
  } catch {
    // Fall through to the verified legacy export.
  }

  const category = migratedCategory(contentType, legacyTypeId)
  if (!category) return null
  const source = collection === 'products' ? legacyExport.products : legacyExport.news
  const ids = new Set(source.filter((item) => item.categoryLegacyId === legacyTypeId).map((item) => item.legacyId))
  return { category, docs: migratedItems(collection).filter((item) => item.legacyId && ids.has(item.legacyId)) }
}
