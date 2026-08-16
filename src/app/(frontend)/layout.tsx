import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Batumtech',
  description: 'Batumtech corporate website',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>
}

