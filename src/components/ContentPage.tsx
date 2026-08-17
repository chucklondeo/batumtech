import type { PublicContent } from '@/lib/content'

export function ContentPage({ content }: { content: PublicContent }) {
  return (
    <main>
      <h1>{content.title}</h1>
      {content.summary ? <p>{content.summary}</p> : null}
    </main>
  )
}

