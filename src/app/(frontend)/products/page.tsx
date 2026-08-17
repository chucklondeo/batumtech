import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ArrowIcon'
import { ProductCategoryGrid } from '@/components/ProductCategoryGrid'
import { findPublicContentOrEmpty } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '产品中心', alternates: { canonical: absoluteUrl('/products') } }
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await findPublicContentOrEmpty('products')
  return <main className="inner-page">
    <section className="page-hero"><div className="page-shell"><p className="eyebrow">PRODUCT SYSTEMS</p><h1>产品中心</h1><p>按照应用场景与技术层级重新梳理产品，从整机系统、核心机芯到低压伺服控制，让选型更直观。</p></div></section>
    <section className="content-shell page-shell"><div className="section-heading"><div><p className="eyebrow">CATEGORY MAP</p><h2>五大核心产品系统</h2></div><p>轨道交通、高速公路和智慧出入口拥有不同工况，我们为每类场景提供明确的产品路径。</p></div><ProductCategoryGrid />
      {products.length ? <div className="catalog-block"><div className="section-heading compact-heading"><div><p className="eyebrow">ALL PRODUCTS</p><h2>全部产品</h2></div></div><div className="product-list">{products.map((item) => <Link className="product-item" href={`/products/${item.legacyId ?? item.slug}`} key={item.id}><span className="product-chip">BATUM PRODUCT</span><h3>{item.title}</h3><p>{item.summary || '查看产品参数、应用场景与技术资料。'}</p><span className="text-link">查看详情 <ArrowIcon /></span></Link>)}</div></div> : null}
    </section>
  </main>
}
