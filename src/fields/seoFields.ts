import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  localized: true,
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea', maxLength: 320 },
    { name: 'canonicalUrl', type: 'text' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
