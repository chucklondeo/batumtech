import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '关于我们', alternates: { canonical: absoluteUrl('/about') } }
export default function AboutPage() { return <main><h1>关于我们</h1></main> }

