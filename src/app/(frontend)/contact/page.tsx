import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '联系我们', alternates: { canonical: absoluteUrl('/contact') } }
export default function ContactPage() { return <main><h1>联系我们</h1></main> }
