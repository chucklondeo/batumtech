import Link from 'next/link'
import type { PublicCategory, PublicContent } from '@/lib/content'

export function CategoryPage({
  basePath,
  category,
  docs,
}: {
  basePath: '/news' | '/products'
  category: PublicCategory
  docs: PublicContent[]
}) {
  return (
    <main>
      <h1>{category.name}</h1>
      {docs.map((item) => (
        <p key={item.id}>
          <Link href={`${basePath}/${item.legacyId ?? item.slug}`}>{item.title}</Link>
        </p>
      ))}
    </main>
  )
}

