import type { Metadata } from 'next'
import Link from 'next/link'
import { findPublicContent } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '产品中心', alternates: { canonical: absoluteUrl('/products') } }
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await findPublicContent('products')
  return <main><h1>产品中心</h1>{products.map((item) => <p key={item.id}><Link href={`/products/${item.legacyId ?? item.slug}`}>{item.title}</Link></p>)}</main>
}

