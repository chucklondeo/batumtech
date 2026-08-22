import type { CollectionConfig } from 'payload'
import { legacyFields } from '../fields/legacyFields'
import { seoFields } from '../fields/seoFields'

export const createContentCollection = (
  slug: 'products' | 'news' | 'cases',
  categoryType: 'product' | 'news' | 'case',
): CollectionConfig => ({
  slug,
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, index: true, localized: true },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      filterOptions: { contentType: { equals: categoryType } },
    },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'legacyHtml',
      type: 'textarea',
      admin: { description: 'Sanitized legacy HTML retained during migration.' },
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'publishedAt', type: 'date', index: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    seoFields,
    ...legacyFields,
  ],
})
