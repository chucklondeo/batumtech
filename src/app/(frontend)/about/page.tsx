import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '关于我们', alternates: { canonical: absoluteUrl('/about') } }
export default function AboutPage() { return <main className="inner-page"><section className="page-hero"><div className="page-shell"><p className="eyebrow">ABOUT BATUM</p><h1>以精准控制，推动通行系统持续进化</h1><p>巴图姆（深圳）科技有限公司专注于 24V 低压伺服门禁驱动控制研发与制造。</p></div></section><section className="content-shell page-shell about-grid"><div><p className="eyebrow">WHO WE ARE</p><h2>专注门控核心技术</h2></div><div className="about-copy"><p>我们面向高速公路 ETC、AFC 自动售检票、站台屏蔽门和智慧停车等场景，提供控制板、核心机芯、栏杆机与项目化解决方案。</p><p>从正弦波伺服算法、24V 安全低压架构到结构与接口设计，巴图姆以工程能力解决设备高频运行中的稳定性、噪声、能耗和系统兼容问题。</p><div className="value-grid"><span><strong>安全</strong><small>24V 低压架构</small></span><span><strong>稳定</strong><small>面向高频工况</small></span><span><strong>开放</strong><small>灵活接口与定制</small></span></div></div></section></main> }
