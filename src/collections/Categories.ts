import type { CollectionConfig } from 'payload'
import { legacyFields } from '../fields/legacyFields'
import { seoFields } from '../fields/seoFields'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, index: true, localized: true },
    { name: 'contentType', type: 'select', required: true, options: ['product', 'news', 'case'] },
    { name: 'parent', type: 'relationship', relationTo: 'categories' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    seoFields,
    ...legacyFields,
  ],
}
