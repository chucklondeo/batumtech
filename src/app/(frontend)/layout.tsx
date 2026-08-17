import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { PRIMARY_ORIGIN } from '@/lib/site'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(PRIMARY_ORIGIN),
  title: {
    default: '巴图姆科技｜低压伺服门控与智能通行系统',
    template: '%s｜巴图姆科技',
  },
  description: '巴图姆科技专注低压伺服门控系统，为轨道交通、智慧楼宇与智能通行场景提供核心控制、门机及定制解决方案。',
  alternates: { canonical: '/' },
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN"><body><SiteHeader />{children}<SiteFooter /></body></html>
}
