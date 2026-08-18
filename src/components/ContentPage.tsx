import type { PublicContent } from '@/lib/content'

export function ContentPage({ content }: { content: PublicContent }) {
  return (
    <main className="inner-page">
      <section className="page-hero"><div className="page-shell"><p className="eyebrow">BATUM TECHNOLOGY</p><h1>{content.title}</h1>{content.summary ? <p>{content.summary}</p> : null}</div></section>
      <section className="content-shell page-shell">
        {content.legacyHtml ? (
          <article className="legacy-content" dangerouslySetInnerHTML={{ __html: content.legacyHtml }} />
        ) : (
          <div className="content-placeholder"><span>TECHNICAL CONTENT</span><p>详细参数、应用说明和媒体资料将在历史数据完成迁移后显示。</p></div>
        )}
      </section>
    </main>
  )
}
