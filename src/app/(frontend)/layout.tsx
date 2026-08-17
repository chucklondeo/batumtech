import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { PRIMARY_ORIGIN } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(PRIMARY_ORIGIN),
  title: 'Batumtech',
  description: 'Batumtech corporate website',
  alternates: { canonical: '/' },
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>
}
