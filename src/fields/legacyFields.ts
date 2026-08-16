import type { Field } from 'payload'

export const legacyFields: Field[] = [
  {
    name: 'legacyId',
    type: 'text',
    index: true,
    admin: { description: 'Original MySQL primary key. Populated only by migration.' },
  },
  {
    name: 'legacyUrl',
    type: 'text',
    index: true,
    admin: { description: 'Original public URL used for SEO migration verification.' },
  },
]

