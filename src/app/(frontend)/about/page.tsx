import type { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: '关于巴图姆科技｜低压伺服门控与智慧通行核心技术',
  description: '了解巴图姆（深圳）科技有限公司在24V低压伺服门控、AFC闸机、ETC栏杆机、站台屏蔽门和智慧通行领域的技术能力、产品体系与合作方式。',
  alternates: { canonical: absoluteUrl('/about') },
}

const capabilities = [
  ['01', '伺服驱动与控制', '围绕24V低压伺服架构、正弦波控制算法与运动控制策略，提升门体启停的平顺性、响应速度与运行稳定性。'],
  ['02', '门控机电一体化', '从控制板、驱动器到核心机芯与整机系统，统筹电气、结构、传动和接口设计，降低项目集成复杂度。'],
  ['03', '高频场景工程化', '面向轨道交通、高速公路和公共通行等高频工况，持续优化可靠性、噪声、能耗、维护效率与系统兼容性。'],
  ['04', '项目定制与协同', '支持接口适配、参数匹配、结构配合及OEM／ODM协作，让标准产品更快融入客户既有平台和项目规范。'],
] as const

const applications = [
  ['AFC 自动售检票', '面向地铁、铁路及公共交通闸机，提供快速、平稳且便于系统集成的门控核心方案。'],
  ['ETC 快速栏杆机', '服务高速公路与停车出入口，兼顾快速抬落杆、高频运行和低压安全需求。'],
  ['站台屏蔽门', '围绕公交、轨道交通和机场等场景，提供低压伺服控制与门体驱动技术支持。'],
  ['智慧门禁与通行', '适配企业园区、公共建筑及高端门禁设备，为合作伙伴提供核心部件和定制能力。'],
] as const

export default function AboutPage() {
  return (
    <main className="inner-page about-page">
      <section className="page-hero about-hero"><div className="page-shell">
        <p className="eyebrow">ABOUT BATUM TECHNOLOGY</p>
        <h1>以低压伺服核心技术，驱动更安全、更高效的智慧通行</h1>
        <p>巴图姆（深圳）科技有限公司专注于门控驱动与控制技术，为轨道交通、高速公路、智慧停车和高端门禁提供核心产品及项目化解决方案。</p>
      </div></section>

      <section className="content-shell page-shell about-grid">
        <div><p className="eyebrow">WHO WE ARE</p><h2>专注门控系统的核心控制层</h2></div>
        <div className="about-copy">
          <p>巴图姆科技关注的并不只是单一设备，而是通行系统中决定速度、稳定性与安全性的核心控制环节。我们围绕24V低压伺服门控持续开展产品研发与工程实践，形成覆盖伺服控制板、门控驱动器、核心机芯、快速栏杆机及相关解决方案的产品体系。</p>
          <p>面对设备高频启停、长期连续运行、空间受限和多系统协同等实际问题，我们从控制算法、电气架构、机械传动、通信接口和项目适配等多个维度进行优化，帮助设备制造商、系统集成商和项目合作伙伴缩短开发周期、提升整机品质。</p>
          <div className="value-grid"><span><strong>安全</strong><small>24V低压设计思路</small></span><span><strong>稳定</strong><small>面向高频运行工况</small></span><span><strong>协同</strong><small>开放接口与项目定制</small></span></div>
        </div>
      </section>

      <section className="about-dark-section"><div className="page-shell">
        <div className="about-section-heading"><div><p className="eyebrow">CORE CAPABILITIES</p><h2>从控制算法到项目落地</h2></div><p>以核心技术为基础，以实际工况为验证标准，围绕产品全生命周期持续提升可靠性和可维护性。</p></div>
        <div className="capability-grid">{capabilities.map(([index, title, description]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </div></section>

      <section className="section about-applications"><div className="page-shell">
        <div className="about-section-heading light-heading"><div><p className="eyebrow">APPLICATIONS</p><h2>服务关键通行场景</h2></div><p>针对不同场景的速度、安全、耐久与集成要求，提供可组合的产品和技术支持。</p></div>
        <div className="application-grid">{applications.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </div></section>

      <section className="about-partner page-shell">
        <div><p className="eyebrow">HOW WE WORK</p><h2>与合作伙伴共同完成从方案到交付</h2></div>
        <div><p>我们重视产品参数之外的工程协作。在需求确认阶段理解门体结构、负载、速度、通信和使用环境；在方案阶段完成控制与机电匹配；在验证阶段结合样机和现场反馈持续优化；在交付后为产品迭代及项目扩展提供支持。</p><p>面向未来，巴图姆科技将继续完善中国内地业务，并为香港、新加坡等区域市场建立可本地化运营的产品内容与服务体系，让同一技术平台更好地适应不同地区的项目标准和合作需求。</p><div className="about-actions"><Link href="/products">查看产品体系</Link><Link href="/contact">联系项目团队</Link></div></div>
      </section>
    </main>
  )
}
