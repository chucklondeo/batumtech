import legacyExport from '../../docs/legacy-content-export.json'
import type { Payload } from 'payload'

type ContentCollection = 'products' | 'news'

const findOne = async (payload: Payload, collection: string, where: Record<string, unknown>) => {
  const result = await payload.find({
    collection: collection as never,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: where as never,
  })
  return result.docs[0] as { id: number | string } | undefined
}

export async function importLegacyContent(payload: Payload) {
  const tenant = await findOne(payload, 'tenants', { code: { equals: 'batumtech-cn' } })
    || await payload.create({
      collection: 'tenants',
      overrideAccess: true,
      data: {
        name: 'Batumtech China', code: 'batumtech-cn', domain: 'batumtech.com',
        defaultLocale: 'zh-CN', supportedLocales: ['zh-CN'], timezone: 'Asia/Shanghai', enabled: true,
      },
    })

  const categoryIds = new Map<string, number | string>()
  for (const category of legacyExport.categories) {
    const key = `${category.contentType}:${category.legacyId}`
    const existing = await findOne(payload, 'categories', {
      and: [
        { legacyId: { equals: category.legacyId } },
        { contentType: { equals: category.contentType } },
        { tenant: { equals: tenant.id } },
      ],
    })
    const saved = existing || await payload.create({
      collection: 'categories', overrideAccess: true,
      data: {
        tenant: tenant.id, name: category.name, slug: category.slug,
        contentType: category.contentType, legacyId: category.legacyId,
        legacyUrl: category.legacyUrl,
        seo: { title: category.name, canonicalUrl: `https://www.batumtech.com/${category.contentType === 'product' ? 'products' : 'news'}/category/${category.legacyId}`, noIndex: false },
      } as never,
    })
    categoryIds.set(key, saved.id)
  }

  const importItems = async (collection: ContentCollection, items: typeof legacyExport.products | typeof legacyExport.news) => {
    for (const item of items) {
      const existing = await findOne(payload, collection, {
        and: [{ legacyId: { equals: item.legacyId } }, { tenant: { equals: tenant.id } }],
      })
      if (existing) continue
      const categoryType = collection === 'products' ? 'product' : 'news'
      await payload.create({
        collection,
        overrideAccess: true,
        data: {
          tenant: tenant.id,
          title: item.title,
          slug: item.slug,
          category: categoryIds.get(`${categoryType}:${item.categoryLegacyId}`),
          summary: item.summary,
          legacyHtml: item.legacyHtml,
          publishedAt: 'publishedAt' in item && item.publishedAt ? `${item.publishedAt}T00:00:00.000Z` : undefined,
          legacyId: item.legacyId,
          legacyUrl: item.legacyUrl,
          seo: {
            title: item.title,
            description: item.summary,
            canonicalUrl: `https://www.batumtech.com/${collection}/${item.legacyId}`,
            noIndex: false,
          },
          _status: 'published',
        } as never,
      })
    }
  }

  await importItems('products', legacyExport.products)
  await importItems('news', legacyExport.news)
}
