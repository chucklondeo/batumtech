import type { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'sourcePath' },
  fields: [
    { name: 'sourcePath', type: 'text', required: true, index: true },
    { name: 'destinationUrl', type: 'text', required: true },
    { name: 'statusCode', type: 'select', required: true, defaultValue: '301', options: ['301', '308', '410'] },
    { name: 'preserveQuery', type: 'checkbox', defaultValue: false },
    { name: 'reason', type: 'textarea' },
    { name: 'verifiedAt', type: 'date' },
    { name: 'enabled', type: 'checkbox', required: true, defaultValue: true },
  ],
}

