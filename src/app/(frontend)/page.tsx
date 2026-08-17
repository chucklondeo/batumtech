import Link from 'next/link'
import { ArrowIcon } from '@/components/ArrowIcon'
import { ProductCategoryGrid } from '@/components/ProductCategoryGrid'

const advantages = [
  ['24V', '安全低压系统'],
  ['SERVO', '自主控制技术'],
  ['7×24', '技术响应支持'],
  ['OEM', '深度定制能力'],
]

export default function HomePage() {
  return <main className="home-page">
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true"><span /><i /><b /></div>
      <div className="page-shell hero-content">
        <div className="hero-copy">
          <p className="kicker"><span /> LOW-VOLTAGE SERVO CONTROL</p>
          <h1>让每一次通行<br /><em>更快，更稳，更安全</em></h1>
          <p className="hero-intro">巴图姆科技专注 24V 低压伺服门控技术，为轨道交通、ETC 高速车道与智慧出入口提供从控制器、核心机芯到整机系统的完整方案。</p>
          <div className="hero-actions"><Link className="button button-primary" href="/products">探索产品系统 <ArrowIcon /></Link><Link className="button button-ghost" href="/contact">获取项目方案</Link></div>
        </div>
        <div className="hero-panel">
          <div className="status-row"><span><i /> SYSTEM ONLINE</span><b>24V</b></div>
          <div className="servo-diagram"><span className="servo-ring ring-one" /><span className="servo-ring ring-two" /><span className="servo-core">B</span><i className="servo-line line-one" /><i className="servo-line line-two" /></div>
          <div className="metric-row"><span><small>响应表现</small><strong>高速</strong></span><span><small>控制表现</small><strong>精准</strong></span><span><small>运行表现</small><strong>低噪</strong></span></div>
        </div>
      </div>
      <div className="page-shell hero-stats">{advantages.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    </section>

    <section className="section product-section">
      <div className="page-shell">
        <div className="section-heading"><div><p className="eyebrow">PRODUCT ARCHITECTURE</p><h2>清晰的产品系统<br />面向真实应用场景</h2></div><p>从交通场站到高速车道，从整机设备到核心控制，每一条产品线都有清晰的应用边界和技术定位。</p></div>
        <ProductCategoryGrid />
      </div>
    </section>

    <section className="section engineering-section">
      <div className="page-shell engineering-grid">
        <div className="engineering-visual"><div className="tech-card tech-a"><span>01</span><strong>正弦波伺服</strong><small>Smooth Motion</small></div><div className="tech-card tech-b"><span>02</span><strong>24V 安全低压</strong><small>Safe Architecture</small></div><div className="tech-card tech-c"><span>03</span><strong>模块化集成</strong><small>OEM Ready</small></div></div>
        <div className="engineering-copy"><p className="eyebrow">ENGINEERING VALUE</p><h2>核心技术，不止于参数</h2><p>以精准运动控制为核心，结合结构设计、接口适配与长期工况验证，让设备在高频、复杂的实际环境中持续稳定运行。</p><ul><li><span>01</span>精准启停，降低冲击与机械磨损</li><li><span>02</span>低噪运行，适配交通与公共空间</li><li><span>03</span>开放接口，缩短系统集成周期</li></ul><Link className="text-link text-link-light" href="/about">了解技术能力 <ArrowIcon /></Link></div>
      </div>
    </section>

    <section className="section scenarios-section"><div className="page-shell"><div className="section-heading"><div><p className="eyebrow">APPLICATIONS</p><h2>覆盖关键通行场景</h2></div></div><div className="scenario-grid"><article><span>01</span><h3>轨道交通</h3><p>AFC 闸机、站台屏蔽门与速通门核心控制。</p></article><article><span>02</span><h3>高速公路</h3><p>面向 ETC 高频车道的快速栏杆与伺服方案。</p></article><article><span>03</span><h3>智慧园区</h3><p>停车、门禁和访客通行的一体化设备能力。</p></article><article><span>04</span><h3>OEM / ODM</h3><p>从控制板、机芯到整机的项目化联合开发。</p></article></div></div></section>

    <section className="cta-section"><div className="page-shell cta-shell"><div><p className="eyebrow">START A PROJECT</p><h2>让通行系统从核心开始升级</h2><p>告诉我们应用场景、通行频率与集成要求，工程团队将为你匹配合适的产品与技术方案。</p></div><Link className="button button-light" href="/contact">联系技术顾问 <ArrowIcon /></Link></div></section>
  </main>
}
