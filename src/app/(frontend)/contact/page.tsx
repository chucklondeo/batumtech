import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = { title: '联系我们', alternates: { canonical: absoluteUrl('/contact') } }
export default function ContactPage() { return <main className="inner-page"><section className="page-hero"><div className="page-shell"><p className="eyebrow">CONTACT</p><h1>从需求开始，建立可靠方案</h1><p>提供场景、速度、尺寸、接口与数量要求，我们将协助完成产品选型和项目评估。</p></div></section><section className="content-shell page-shell contact-grid"><div className="contact-card"><p className="eyebrow">SALES & ENGINEERING</p><h2>项目咨询</h2><span className="contact-phone">提交项目需求</span><p>中国 · 深圳<br />面向全球客户提供产品、OEM 与技术支持。</p></div><div className="contact-notes"><article><span>01</span><h3>描述应用场景</h3><p>轨道交通、ETC、停车场、园区或定制设备。</p></article><article><span>02</span><h3>提供技术要求</h3><p>通行速度、设备尺寸、控制接口和运行频率。</p></article><article><span>03</span><h3>获得匹配方案</h3><p>工程团队提供产品建议、集成边界和下一步计划。</p></article></div></section></main> }
