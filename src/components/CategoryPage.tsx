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
    <main className="inner-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{basePath === '/products' ? 'PRODUCT CATEGORY' : 'NEWS CATEGORY'}</span>
          <h1>{category.name}</h1>
          <p>浏览该分类下的{basePath === '/products' ? '产品与解决方案' : '企业动态与行业资讯'}。</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-list">
          {docs.length ? docs.map((item) => (
            <Link className="content-list-item" key={item.id} href={`${basePath}/${item.legacyId ?? item.slug}`}>
              <span>{item.title}</span><span aria-hidden="true">→</span>
            </Link>
          )) : <div className="empty-state">该分类内容正在整理中。</div>}
        </div>
      </section>
    </main>
  )
}
