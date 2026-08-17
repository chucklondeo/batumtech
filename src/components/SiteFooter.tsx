import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-brand">
          <Link className="brand brand-light" href="/"><BrandMark /><span><strong>BATUM</strong><small>TECHNOLOGY</small></span></Link>
          <p>专注 24V 低压伺服门控，为轨道交通、高速公路与智慧通行提供可靠的核心控制方案。</p>
        </div>
        <div className="footer-links">
          <div><strong>产品系统</strong><Link href="/products/category/116">AFC 智能闸机</Link><Link href="/products/category/122">站台屏蔽门</Link><Link href="/products/category/114">伺服控制板</Link></div>
          <div><strong>应用与服务</strong><Link href="/products/category/121">ETC 栏杆机</Link><Link href="/products/category/115">门禁机芯</Link><Link href="/contact">OEM / ODM 合作</Link></div>
          <div><strong>联系我们</strong><Link href="/contact">项目咨询</Link><span>深圳 · 中国</span><Link href="/news">新闻资讯</Link></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Batum Technology</span><span>安全 · 节能 · 精准控制</span></div>
    </footer>
  )
}
