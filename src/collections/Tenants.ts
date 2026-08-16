import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'domain', type: 'text', required: true, unique: true, index: true },
    { name: 'defaultLocale', type: 'select', required: true, defaultValue: 'zh-CN', options: ['zh-CN', 'zh-HK', 'en-SG'] },
    { name: 'timezone', type: 'text', required: true, defaultValue: 'Asia/Shanghai' },
    { name: 'enabled', type: 'checkbox', required: true, defaultValue: true },
  ],
}

