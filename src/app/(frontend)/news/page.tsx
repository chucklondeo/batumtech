import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ArrowIcon'
import { findPublicContentOrEmpty } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '新闻资讯', alternates: { canonical: absoluteUrl('/news') } }
export const dynamic = 'force-dynamic'

export default async function NewsIndexPage() {
  const articles = await findPublicContentOrEmpty('news')
  return <main className="inner-page"><section className="page-hero"><div className="page-shell"><p className="eyebrow">INSIGHTS & NEWS</p><h1>技术洞察</h1><p>聚焦低压伺服控制、轨道交通门控与智慧通行领域的技术实践和行业动态。</p></div></section><section className="content-shell page-shell"><div className="news-grid">{articles.map((item, index) => <Link className="news-card" href={`/news/${item.legacyId ?? item.slug}`} key={item.id}><span className="news-index">{String(index + 1).padStart(2, '0')}</span><p className="eyebrow">BATUM INSIGHT</p><h2>{item.title}</h2><p>{item.summary || '了解巴图姆科技最新技术进展与行业应用。'}</p><span className="text-link">阅读全文 <ArrowIcon /></span></Link>)}</div>{!articles.length ? <div className="empty-state"><span>INSIGHTS</span><h2>内容迁移准备中</h2><p>历史资讯将在数据核验后完整迁入，并保留原发布日期与 SEO 信息。</p></div> : null}</section></main>
}
