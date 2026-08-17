import Link from 'next/link'
import { BrandMark } from './BrandMark'

const navigation = [
  { href: '/products', label: '产品中心' },
  { href: '/products/category/116', label: 'AFC 闸机' },
  { href: '/products/category/122', label: '屏蔽门' },
  { href: '/products/category/114', label: '伺服控制' },
  { href: '/news', label: '技术洞察' },
  { href: '/about', label: '关于巴图姆' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-shell">
        <Link className="brand" href="/" aria-label="巴图姆科技首页">
          <BrandMark />
          <span><strong>BATUM</strong><small>TECHNOLOGY</small></span>
        </Link>
        <nav className="main-nav" aria-label="主要导航">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Link className="header-cta" href="/contact">项目咨询</Link>
      </div>
    </header>
  )
}

