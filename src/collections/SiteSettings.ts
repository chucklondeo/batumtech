import type { CollectionConfig } from 'payload'
import { seoFields } from '../fields/seoFields'

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  admin: { useAsTitle: 'siteName' },
  fields: [
    { name: 'siteName', type: 'text', required: true, localized: true },
    { name: 'companyName', type: 'text', localized: true },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea', localized: true },
    { name: 'legacyConfig', type: 'json', admin: { description: 'Auditable copy of mapped web_config values.' } },
    seoFields,
  ],
}
