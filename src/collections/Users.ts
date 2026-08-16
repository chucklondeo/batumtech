import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: ['super-admin', 'editor'],
      saveToJWT: true,
    },
    { name: 'tenants', type: 'relationship', relationTo: 'tenants', hasMany: true },
  ],
}

