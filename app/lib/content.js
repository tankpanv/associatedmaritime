// Bilingual content (EN + 中文) for the whole site. Each translatable value is
// { en, zh }. Chinese is a professional translation of the client's English brief.
// Consumers read the active language via useLang() and pick field[lang].

export const SERVICES = [
  {
    id: 'service-12',
    title: { en: 'Ship Management', zh: '船舶管理' },
    body: {
      en: ['Our ship management services, comprising technical management and crew management, represent our core services. Our systems and services are geared towards efficiently operating a diverse range of ship types of all sizes, including crude, product, and chemical tankers, and containerships. Ships under TOP MARINE GROUP management are manned, operated, and maintained to the highest standards in quality and safety.'],
      zh: ['船舶管理服务(涵盖技术管理与船员管理)是我们的核心业务。我们的体系与服务致力于高效运营各类船型、各种尺度的船舶,包括原油轮、成品油轮、化学品船及集装箱船。在 TOP MARINE GROUP 管理下的船舶,其配员、运营与维护均达到最高的质量与安全标准。'],
    },
  },
  {
    id: 'service-11',
    title: { en: 'Technical', zh: '技术管理' },
    body: {
      en: ['Our Technical department focuses on safety, compliance, and efficiency. Preparing ships and equipment to meet the requirements of specific routes and destinations is of utmost importance to our team, as it ensures that delays and off-hire periods are minimized.',
           'The technical department is responsible for the repairs, dry-docking, and maintenance of the vessel’s hull and equipment. An extensive preventive maintenance program is implemented, which involves proactive strategies and scheduled on-board visits.',
           'Our team also maintains close communication with classification societies, flag authorities and port contractors to ensure all regulatory requirements are strictly met, and all repair and maintenance work is carried out in compliance with the latest industry standards. By monitoring ship performance data and equipment operating conditions in real time, we can quickly identify potential risks and address them before they escalate into major failures, effectively extending the service life of vessels and reducing long-term operating costs for our clients.'],
      zh: ['我们的技术部门专注于安全、合规与效率。为特定航线和目的地做好船舶与设备的准备是我们团队的重中之重,这能确保将延误和停租时间降到最低。',
           '技术部门负责船舶船体及设备的维修、进坞与维护。我们实施全面的预防性维护计划,采取主动策略并安排定期上船检查。',
           '我们的团队还与船级社、船旗国主管机关及港口承包商保持密切沟通,确保严格满足各项法规要求,所有维修与维护工作均符合最新行业标准。通过实时监测船舶性能数据和设备运行状况,我们能够快速识别潜在风险并在其演变为重大故障之前加以处理,从而有效延长船舶使用寿命,降低客户的长期运营成本。'],
    },
  },
  {
    id: 'service-10',
    title: { en: 'Crewing', zh: '船员管理' },
    body: {
      en: ['Our crew management services encompass the recruitment, deployment, training, monitoring of crew costs, and ongoing management of officers and ratings.',
           'The crewing department is dedicated to the process of screening and recruiting well-trained and experienced crew personnel, primarily focusing on the markets of China and Southeast Asia.'],
      zh: ['我们的船员管理服务涵盖高级船员与普通船员的招募、派遣、培训、船员成本监控及日常管理。',
           '船员部门专注于筛选和招募训练有素、经验丰富的船员,主要面向中国及东南亚市场。'],
    },
  },
  {
    id: 'service-9',
    title: { en: 'Operation', zh: '运营' },
    body: {
      en: ['Our operations department works to understand our clients’ needs and then adapts our service offerings to them. We carefully monitor vessels throughout each voyage, placing emphasis on efficient and cost-effective solutions based on best routing, weather considerations, and trim optimization. We closely monitor our vessels’ performance and are always looking for ways to improve and innovate.'],
      zh: ['我们的运营部门致力于了解客户需求,并据此调整服务方案。我们在每个航次中对船舶进行细致监控,并基于最佳航线、天气因素和纵倾优化,注重提供高效且经济的解决方案。我们密切关注船舶性能,始终寻求改进与创新。'],
    },
  },
  {
    id: 'service-8',
    title: { en: 'Chartering', zh: '租船' },
    body: {
      en: ['Our Chartering Department has established solid, long-term relationships with our clients, which are built on trust, transparency, and communication. Our charterers rely on us to provide flexible and reliable solutions, and we offer a unique service that is tailored to individual requirements, goals, and concerns.',
           'Whether clients need voyage charters, time charters, or contract of affreightment arrangements, our experienced team leverages in-depth market knowledge and an extensive global network to match vessels with cargo needs efficiently. We closely monitor market fluctuations and route conditions to adjust plans promptly, minimizing operational risks and controlling costs for our clients. By maintaining open dialogue at every stage of the chartering process, we quickly address any unexpected issues and ensure all parties reach mutually beneficial outcomes, helping our clients achieve stable and sustainable maritime transportation business growth.'],
      zh: ['我们的租船部门与客户建立了稳固、长期的合作关系,这些关系建立在信任、透明与沟通之上。客户依赖我们提供灵活可靠的解决方案,我们则提供针对个性化需求、目标与关切量身定制的独特服务。',
           '无论客户需要程租、期租还是包运合同安排,我们经验丰富的团队都能凭借深入的市场认知和广泛的全球网络,高效地为货物匹配合适的船舶。我们密切关注市场波动和航线状况,及时调整方案,为客户降低运营风险、控制成本。通过在租船全过程中保持开放沟通,我们能迅速处理各类突发问题,确保各方达成互利共赢的结果,助力客户实现稳定、可持续的海运业务增长。'],
    },
  },
  {
    id: 'service-7',
    title: { en: 'Procurement Services', zh: '采购服务' },
    body: {
      en: ['We provide cost-efficient procurement services through our global network of suppliers.',
           'Together with our logistics partners, we create a reliable and efficient procurement chain. We have favorable fleet agreements with major national and global suppliers, which ensures reliability and cost control.',
           'Our dedicated procurement team continuously monitors market trends and supplier performance, allowing us to adjust strategies promptly to maintain competitive pricing without compromising on product quality. We also streamline internal approval and ordering processes to cut unnecessary administrative overhead, passing these savings directly on to our clients. Whether you need small-batch custom supplies or large-volume regular orders, we can match your specific requirements while keeping your total procurement expenditure within planned budgets.'],
      zh: ['我们通过全球供应商网络提供高性价比的采购服务。',
           '我们与物流合作伙伴携手,打造可靠高效的采购链。我们与主要的国内及全球供应商签有优惠的船队协议,确保可靠性与成本控制。',
           '我们专业的采购团队持续关注市场趋势与供应商表现,能够及时调整策略,在不影响产品质量的前提下保持有竞争力的价格。我们还简化内部审批与订购流程,削减不必要的管理开销,并将这些节省直接惠及客户。无论您需要小批量定制物资还是大批量常规订单,我们都能在满足您具体需求的同时,将采购总支出控制在预算之内。'],
    },
  },
  {
    id: 'service-6',
    title: { en: 'HSQE', zh: '健康安全质量环境(HSQE)' },
    body: {
      en: ['One of our core values and top priorities is the safe operation of vessels and offices, without any injuries, loss of life, damage to property, or harm to the environment. We adhere to our Quality, Health, Safety, and Environmental (QHSE) management system and continuously enhance its effectiveness in line with the requirements of the International Safety Management (ISM) Code, ISO 9001, 14001, and 45001.',
           'This commitment is embedded in every operational decision, from vessel maintenance and crew training to emergency response planning and environmental stewardship. We conduct regular internal audits, management reviews, and third-party certifications to ensure compliance and drive continual improvement. Through proactive risk assessments and data-driven performance monitoring, we identify emerging hazards early and implement corrective actions swiftly. Our QHSE culture is reinforced by leadership accountability, transparent reporting, and active employee participation across all levels.'],
      zh: ['安全运营船舶与办公场所、实现零伤害、零生命损失、零财产损失及零环境危害,是我们的核心价值观与首要任务之一。我们遵循质量、健康、安全与环境(QHSE)管理体系,并依照《国际安全管理(ISM)规则》、ISO 9001、14001 及 45001 的要求持续提升其有效性。',
           '这一承诺贯穿于从船舶维护、船员培训到应急响应规划和环境管理的每一个运营决策。我们定期开展内部审核、管理评审与第三方认证,以确保合规并推动持续改进。通过主动的风险评估和数据驱动的绩效监控,我们能够及早识别新出现的隐患并迅速采取纠正措施。我们的 QHSE 文化由领导层问责、透明报告及各层级员工的积极参与共同强化。'],
    },
  },
  {
    id: 'service-5',
    title: { en: 'Sale And Purchase', zh: '船舶买卖' },
    body: {
      en: ['TOP MARINE GROUP offers consultation and advice to the shareholders of the vessels it manages regarding the optimal time to buy or sell through market analysis and a careful assessment of shipping trends. Since its inception, the company has been involved in the S&P sector and has access to extensive international networks and brokerage firms.'],
      zh: ['TOP MARINE GROUP 通过市场分析与对航运趋势的审慎评估,就买入或卖出的最佳时机向其所管理船舶的股东提供咨询与建议。自成立以来,公司便涉足船舶买卖(S&P)领域,拥有广泛的国际网络与经纪行资源。'],
    },
  },
  {
    id: 'service-4',
    title: { en: 'Financial & Accounting', zh: '财务与会计' },
    body: {
      en: ['Our expert staff handles bookkeeping, payroll, and controls every expenditure. They deliver periodic reports to ensure that costs are kept in line and managed without ever compromising on quality maintenance and the welfare of our people.'],
      zh: ['我们的专业团队负责记账、薪酬发放,并对每一笔支出进行管控。他们定期出具报告,确保在不影响优质维护和员工福利的前提下,使成本得到良好的控制与管理。'],
    },
    list: {
      en: ['Cost controls', 'Payroll', 'Voyage Accounts', 'Disbursement Accounts', 'Ships Finance', 'Risk Controls', 'Compliance'],
      zh: ['成本控制', '薪酬发放', '航次账目', '港口费用账目', '船舶融资', '风险控制', '合规'],
    },
  },
  {
    id: 'service-3',
    title: { en: 'Insurance', zh: '保险' },
    body: {
      en: ['Thanks to our network and long-standing presence in the market, we seek coverage exclusively from AAA sources. Claims and legal cases are managed in-house, hand in hand with our insurers and P&I Club.'],
      zh: ['凭借我们的网络与长期的市场积淀,我们仅从 AAA 级来源寻求保险保障。理赔与法律事务由我们与保险人及 P&I 协会(船东互保协会)携手在内部处理。'],
    },
    list: {
      en: ['Insurance Cover analysis', 'H&M, P&I, War, K&R, etc.', 'Claims handling', 'Claims Disbursements', 'Risk Management'],
      zh: ['保险保障分析', '船壳险、P&I、战争险、绑架赎金险等', '理赔处理', '理赔垫付', '风险管理'],
    },
  },
  {
    id: 'service-2',
    title: { en: 'Newbuilding & Repairs', zh: '新造船与修理' },
    body: {
      en: ['Our team of Superintendents and engineers can help in drafting the best specs and supervise the building or repairs works in selected shipyards.'],
      zh: ['我们的监造师与工程师团队可协助制定最佳规格书,并在指定船厂监督新造船或修理工程。'],
    },
    list: {
      en: ['Specification Design', 'Newbuilding Supervision', 'Drydocking planning', 'Repairs Supervision', 'Energy Efficiency Improvement', 'Quality Control'],
      zh: ['规格书设计', '新造船监造', '进坞计划', '修理监督', '能效提升', '质量控制'],
    },
  },
  {
    id: 'service-1',
    title: { en: 'FSO/FPSO', zh: 'FSO/FPSO 浮式储油' },
    body: {
      en: ['We are dedicated to provide complete service to ensure safe and continuous offshore oil and gas production 24 hours a day, 365 days a year.',
           'TOP MARINE GROUP has been involved with the design, conversion, installation and operation of FPSO / FSO units including offshore units and barges.',
           'Our services include:'],
      zh: ['我们致力于提供全方位服务,确保海上油气生产全天 24 小时、全年 365 天安全持续地进行。',
           'TOP MARINE GROUP 参与了 FPSO/FSO 装置(包括海上装置和驳船)的设计、改装、安装与运营。',
           '我们的服务包括:'],
    },
    list: {
      en: ['Hull Engineering', 'Marine Systems', 'Process Engineering', 'Mooring Systems', 'Project Management'],
      zh: ['船体工程', '船舶系统', '工艺工程', '系泊系统', '项目管理'],
    },
  },
];

export const NAV = [
  { href: '/', en: 'MAIN', zh: '首页' },
  { href: '/about', en: 'ABOUT', zh: '关于我们' },
  { href: '/services', en: 'SERVICES', zh: '服务' },
  { href: '/fleet', en: 'FLEET', zh: '船队' },
  { href: '/careers', en: 'CAREERS', zh: '招聘' },
  { href: '/contact', en: 'CONTACT', zh: '联系我们' },
];

export const C = {
  ui: { toggle: { en: '中文', zh: 'EN' } },

  home: {
    h1: { en: ['We are a global', 'ship management company'], zh: ['我们是一家全球性', '船舶管理公司'] },
    sub: { en: 'Operating a fleet of crude/Product tankers & containership', zh: '运营一支原油/成品油轮及集装箱船船队' },
    more: { en: 'FIND OUT MORE >', zh: '了解更多 >' },
  },

  about: {
    title: { en: 'About', zh: '关于我们' },
    intro1: { en: 'TOP MARINE GROUP is a global ship management company, that specializes in the management and operation of oil and chemical tankers、containership.', zh: 'TOP MARINE GROUP 是一家全球性船舶管理公司,专注于油轮、化学品船及集装箱船的管理与运营。' },
    intro2: { en: 'We provide a safe and efficient full range of ship management services to ship owners and operators around the globe.', zh: '我们为全球船东与运营商提供安全、高效的全方位船舶管理服务。' },
    p1: { en: 'The services offered to our clients include technical, commercial, operations, insurance, crewing, purchasing, safety & quality. We serve our clients most professionally and flexibly.', zh: '我们为客户提供的服务包括技术、商务、运营、保险、船员、采购、安全与质量等。我们以最专业、最灵活的方式为客户服务。' },
    p2: { en: 'Based in Singapore、Hongkong、Shanghai our dedicated teams oversee all aspects of ship management services to meet our clients’ most specific needs. Currently, we are operating a fleet of oil and chemical tankers consisting of VLCC、Suezmax、Afra、LR、MR and CON.', zh: '我们的专业团队分布于新加坡、香港、上海,全面负责船舶管理服务的各个环节,以满足客户最具体的需求。目前,我们运营的油轮及化学品船船队涵盖 VLCC、Suezmax、Afra、LR、MR 及集装箱船(CON)。' },
    includeTitle: { en: ['Our', 'ship', 'management', 'services', 'include:'], zh: ['我们的', '船舶管理', '服务', '包括:'] },
    checklist1: { en: ['Technical', 'Operation', 'Insurance', 'Commercial', 'Crewing'], zh: ['技术', '运营', '保险', '商务', '船员'] },
    checklist2: { en: ['Vetting', 'Procurement', 'Accounting', 'Safety', 'Quality assurance'], zh: ['船舶审核', '采购', '会计', '安全', '质量保证'] },
    whyTitle: { en: ['Why', 'TOP MARINE GROUP'], zh: ['为什么选择', 'TOP MARINE GROUP'] },
    why: {
      en: ['We operate the vessels worldwide in the safest, most efficient and most professional manner. Our tailor-made services ensure top quality, reliable, cost-effective services while we are committed to minimizing the opex costs and vessel downtime to meet the expectations of the shipowners and operators.',
           'We are focused on operating our managed vessels with Oil Majors for their transportation requirements and to ensure the profitability of our fleet and our long-term sustainability.',
           'Our Tanker Management & Self-Assessment (TMSA) is reviewed by various oil majors. We strive to maintain excellence in our vessel performance SIRE inspections. As a progressive ship management company, we adopt the mindset to continuously improve our processes and systems to create a safe and efficient environment onboard that supports our crew.',
           'Our key strength lies in our highly professional and cost-effective management capabilities, which enable us to maintain low operating costs without compromising safety, maintenance, and operational performance.',
           'We are a one-stop ship management company, with a seasoned management team boasting many years of experience committed to delivering exceptional service and ensuring high customer satisfaction.'],
      zh: ['我们以最安全、最高效、最专业的方式在全球范围运营船舶。我们量身定制的服务确保高品质、可靠且经济的服务,同时致力于将运营成本和船舶停租时间降到最低,以满足船东和运营商的期望。',
           '我们专注于为石油巨头运营所管理的船舶以满足其运输需求,从而确保船队的盈利能力和我们的长期可持续发展。',
           '我们的油轮管理与自我评估(TMSA)接受多家石油巨头的审查。我们努力在船舶 SIRE 检验中保持卓越表现。作为一家积极进取的船舶管理公司,我们秉持持续改进流程与系统的理念,为船员营造安全、高效的船上环境。',
           '我们的核心优势在于高度专业且经济高效的管理能力,使我们能够在不影响安全、维护和运营表现的前提下保持较低的运营成本。',
           '我们是一家一站式船舶管理公司,拥有一支经验丰富、深耕行业多年的管理团队,致力于提供卓越服务并确保高客户满意度。'],
    },
    visionTitle: { en: ['Our', 'vision'], zh: ['我们的', '愿景'] },
    vision: { en: 'is to lead the ship management industry by championing a robust safety culture and leveraging innovative technologies. We aim to achieve our strategic goals with maximum efficiency, driven by the expertise of our senior management team.', zh: '是通过倡导强健的安全文化和运用创新技术,引领船舶管理行业。在高级管理团队的专业能力驱动下,我们力求以最高效率实现战略目标。' },
    missionTitle: { en: ['Our', 'mission'], zh: ['我们的', '使命'] },
    mission: { en: 'is to provide safe, cost-effective and environmentally sustainable maritime transportation of various cargoes in a timely manner.', zh: '是及时、安全、经济且环境可持续地提供各类货物的海上运输。' },
  },

  fleet: {
    title: { en: 'Fleet', zh: '船队' },
    h2a: { en: 'TOP MARINE GROUP ', zh: 'TOP MARINE GROUP ' },
    h2b: { en: ' is a global ship manager.', zh: ' 是一家全球性船舶管理公司。' },
    p1: { en: 'Presently we are managing a range of vessels including oil tankers, chemical tankers, ranging from 30,000 DWT to 320,000 DWT vessels meeting the industry’s highest standards.', zh: '目前我们管理的船舶包括油轮、化学品船,载重吨从 30,000 DWT 至 320,000 DWT,均达到行业最高标准。' },
    p2: { en: 'We also manage container ships ranging from 1,000 TEU to 4,200 TEU.', zh: '我们还管理 1,000 TEU 至 4,200 TEU 的集装箱船。' },
  },

  careers: {
    title: { en: 'Careers', zh: '招聘' },
    lead1: { en: 'TOP MARINE GROUP is always looking for talented and driven professionals', zh: 'TOP MARINE GROUP 始终在寻找优秀且充满干劲的专业人才' },
    lead2: { en: ' who share our values and want to learn and grow with us.', zh: ',他们认同我们的价值观,愿与我们共同学习和成长。' },
    p1: { en: 'We are interested in hearing from authentic and proactive individuals who possess a true passion and enthusiasm for ships and the shipping market.', zh: '我们期待结识真诚、积极主动,并对船舶和航运市场怀有真正热情的人士。' },
    p2: { en: 'If you are ready to take on challenging responsibilities in a dynamic international environment and build your career in the ship management industry, we welcome you to submit your resume to our recruitment mailbox. We offer competitive compensation packages, comprehensive training opportunities and clear career development paths to help you achieve your professional goals alongside our growing global business.', zh: '如果您已准备好在充满活力的国际化环境中承担富有挑战性的职责,并在船舶管理行业开创自己的事业,欢迎将简历投递至我们的招聘邮箱。我们提供有竞争力的薪酬待遇、全面的培训机会和清晰的职业发展路径,助您在我们不断壮大的全球业务中实现职业目标。' },
  },

  contact: {
    title: { en: ['Contact', 'us'], zh: ['联系', '我们'] },
    offices: [
      {
        key: 'sg',
        tab: { en: 'TOP MARINE GROUP (Singapore)', zh: 'TOP MARINE GROUP(新加坡)' },
        title: { en: 'TOP MARINE GROUP PTE. LTD.', zh: 'TOP MARINE GROUP PTE. LTD.' },
        place: { en: 'Singapore', zh: '新加坡' },
        address: { en: '163 Tras Street, #09-02, Lian Huat Building, Singapore 079024', zh: '新加坡 163 Tras Street, #09-02, Lian Huat Building, 079024' },
        map: {
          embed: 'https://www.openstreetmap.org/export/embed.html?bbox=103.8408%2C1.2732%2C103.8473%2C1.2765&layer=mapnik&marker=1.27487%2C103.84404',
          link: 'https://www.openstreetmap.org/?mlat=1.27487&mlon=103.84404#map=18/1.27487/103.84404',
          google: 'https://www.google.com/maps/search/?api=1&query=163%20Tras%20Street%20%2309-02%20Lian%20Huat%20Building%20Singapore%20079024',
        },
      },
      {
        key: 'sh',
        tab: { en: 'TOP MARINE GROUP (Shanghai)', zh: 'TOP MARINE GROUP(上海)' },
        title: { en: 'TOP MARINE GROUP', zh: 'TOP MARINE GROUP' },
        place: { en: 'Shanghai, China', zh: '中国 · 上海' },
        address: { en: 'No. 7, Lane 855, West Huanhu 1st Road, Lingang New Area, China (Shanghai) Pilot Free Trade Zone, Shanghai', zh: '中国(上海)自由贸易试验区临港新片区环湖西一路 855 弄 7 号' },
        map: {
          embed: 'https://www.openstreetmap.org/export/embed.html?bbox=121.9225%2C30.8940%2C121.9335%2C30.9015&layer=mapnik&marker=30.89760%2C121.92860',
          link: 'https://www.openstreetmap.org/?mlat=30.89760&mlon=121.92860#map=17/30.89760/121.92860',
          amap: 'https://uri.amap.com/search?keyword=%E4%B8%AD%E5%9B%BD%EF%BC%88%E4%B8%8A%E6%B5%B7%EF%BC%89%E8%87%AA%E7%94%B1%E8%B4%B8%E6%98%93%E8%AF%95%E9%AA%8C%E5%8C%BA%E4%B8%B4%E6%B8%AF%E6%96%B0%E7%89%87%E5%8C%BA%E7%8E%AF%E6%B9%96%E8%A5%BF%E4%B8%80%E8%B7%AF855%E5%BC%847%E5%8F%B7&src=top-marinegroup',
        },
      },
    ],
    email: 'admin@top-marine.cn',
  },

  form: {
    name: { en: 'Full name', zh: '姓名' },
    email: { en: 'Email', zh: '邮箱' },
    phone: { en: 'Phone', zh: '电话' },
    position: { en: 'Position / rank', zh: '职位 / 职级' },
    message: { en: 'Message', zh: '留言' },
    upload: { en: 'UPLOAD CV', zh: '上传简历' },
    agree: { en: 'I agree to the', zh: '我同意' },
    privacy: { en: 'privacy notice', zh: '隐私声明' },
    submit: { en: 'SUBMIT >', zh: '提交 >' },
    thanks: { en: 'Thank you.', zh: '感谢您!' },
    thanksMsg: { en: 'Your application has been received.', zh: '您的申请已收到。' },
    err: {
      required: { en: 'Required', zh: '必填' },
      email: { en: 'Invalid email', zh: '邮箱格式不正确' },
      resume: { en: 'Attach your CV', zh: '请上传简历' },
      consent: { en: 'Consent required', zh: '请勾选同意' },
      network: { en: 'Network error', zh: '网络错误' },
      failed: { en: 'Submission failed', zh: '提交失败' },
    },
  },

  cookie: {
    text: { en: 'By using this website, you agree to our', zh: '使用本网站即表示您同意我们的' },
    policyLink: { en: 'cookies policy', zh: 'Cookie 政策' },
    confirm: { en: 'OK I CONFIRM', zh: '确认' },
    change: { en: 'CHANGE SETTINGS', zh: '更改设置' },
    settingsTitle: { en: 'Cookies settings', zh: 'Cookie 设置' },
    policyTitle: { en: 'Cookies policy', zh: 'Cookie 政策' },
    save: { en: 'SAVE', zh: '保存' },
    items: [
      { key: 'necessary', locked: true, title: { en: 'Strictly necessary & functional cookies', zh: '严格必要及功能性 Cookie' }, descr: { en: 'These cookies remember choices you make in order to make the website functional. This information is not used for advertising on other websites/services.', zh: '这些 Cookie 会记住您的选择,以使网站正常运作。此类信息不会用于在其他网站/服务上投放广告。' } },
      { key: 'statistics', locked: false, title: { en: 'Statistics', zh: '统计类' }, descr: { en: 'Statistics cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.', zh: '统计类 Cookie 通过匿名收集并报告信息,帮助网站所有者了解访客如何与网站互动。' } },
      { key: 'marketing', locked: false, title: { en: 'Marketing', zh: '营销类' }, descr: { en: 'Advertising cookies are used to track visitors across websites to display relevant and engaging ads.', zh: '广告类 Cookie 用于跨网站追踪访客,以展示相关且吸引人的广告。' } },
    ],
    policy: { en: 'We use “cookies” to facilitate the use of our website. Cookies are small text files that are stored by your browser on your device and are necessary for the use of our website. We use cookies to understand better how our website is used and to improve website navigation. The cookies we use do not store personal data or personal information that may lead to identification of the person to whom they relate and which has been collected by other means. If you do not wish us to collect information via cookies, please choose only strictly necessary and functional cookies on the cookies settings.', zh: '我们使用 “Cookie” 以方便您使用本网站。Cookie 是由您的浏览器存储在设备上的小型文本文件,是使用本网站所必需的。我们使用 Cookie 以更好地了解网站的使用情况并改进网站导航。我们使用的 Cookie 不会存储可能用于识别相关个人身份、且通过其他方式收集的个人数据或个人信息。如果您不希望我们通过 Cookie 收集信息,请在 Cookie 设置中仅选择严格必要及功能性 Cookie。' },
  },

  privacy: {
    text: { en: 'By submitting your resume, you indicate your intent to be considered for the current job opening as well as any future opportunities that align with your qualifications and skills. TOP MARINE GROUP will store your resume in our database and compare it with the requirements of future positions for a period of thirty-six (36) months from the submission date. After this time, your resume will be deleted from our records.', zh: '提交简历即表示您有意应聘当前职位以及未来与您的资历和技能相符的任何机会。TOP MARINE GROUP 将把您的简历保存在我们的数据库中,并自提交之日起的三十六(36)个月内将其与未来职位的要求进行比对。期满后,您的简历将从我们的记录中删除。' },
  },

  footer: {
    address: { en: '163 Tras Street, #09-02, Lian Huat Building, Singapore 079024', zh: '新加坡 163 Tras Street, #09-02, Lian Huat Building, 079024' },
    policy: { en: 'Cookies Policy', zh: 'Cookie 政策' },
    settings: { en: 'Cookies Settings', zh: 'Cookie 设置' },
    rights: { en: 'all rights reserved TOP MARINE GROUP © 2024 - 2025', zh: '版权所有 TOP MARINE GROUP © 2024 - 2025' },
  },
};
