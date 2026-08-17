export type ProductCategory = {
  id: string
  name: string
  eyebrow: string
  description: string
  accent: string
  applications: string[]
  children?: { id: string; name: string }[]
}

export const productCategories: ProductCategory[] = [
  {
    id: '116',
    name: 'AFC 智能闸机',
    eyebrow: 'Rail Transit Access',
    description: '面向地铁、高铁与公共交通场站的高频通行控制系统，兼顾速度、安全与长期稳定运行。',
    accent: 'cyan',
    applications: ['轨道交通', '高铁枢纽', '智慧场馆'],
    children: [
      { id: '120', name: '地铁闸口翼闸' },
      { id: '119', name: '高铁闸口速通门' },
    ],
  },
  {
    id: '122',
    name: '站台屏蔽门',
    eyebrow: 'Platform Safety System',
    description: '服务地铁、高铁与 BRT 站台的低压伺服门控方案，为高频启闭和安全联动而设计。',
    accent: 'blue',
    applications: ['地铁站台', '高铁站台', 'BRT 站台'],
  },
  {
    id: '114',
    name: '低压伺服控制板',
    eyebrow: 'Servo Control Core',
    description: '24V 安全低压、正弦波伺服控制与灵活接口，为门禁和自动门设备提供精准驱动核心。',
    accent: 'violet',
    applications: ['道闸控制', '屏蔽门控制', 'OEM 集成'],
  },
  {
    id: '115',
    name: '门禁核心机芯',
    eyebrow: 'Access Mechanism',
    description: '面向翼闸、摆闸和速通门的模块化机芯，支持结构、速度与控制逻辑的项目化定制。',
    accent: 'orange',
    applications: ['翼闸', '摆闸', '速通门'],
  },
  {
    id: '121',
    name: 'ETC 快速栏杆机',
    eyebrow: 'High-speed Barrier Gate',
    description: '针对高速公路与高流量车道打造的快速栏杆系统，强调高强度、低维护与可靠放行。',
    accent: 'green',
    applications: ['高速公路 ETC', '智慧停车', '园区出入口'],
  },
]

