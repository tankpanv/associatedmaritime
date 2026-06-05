// Per-route, per-language <title>/description for server-side generateMetadata.
const T = {
  home: {
    en: { title: 'TOP MARINE GROUP — global ship management', desc: 'TOP MARINE GROUP is a global ship management company operating a fleet of crude/product tankers and containerships.' },
    zh: { title: 'TOP MARINE GROUP — 全球船舶管理', desc: 'TOP MARINE GROUP 是一家全球性船舶管理公司,运营原油/成品油轮及集装箱船船队。' },
  },
  about: {
    en: { title: 'About — TOP MARINE GROUP', desc: 'About TOP MARINE GROUP, a global ship management company based in Singapore, Hong Kong and Shanghai.' },
    zh: { title: '关于我们 — TOP MARINE GROUP', desc: '关于 TOP MARINE GROUP——一家总部位于新加坡、香港、上海的全球性船舶管理公司。' },
  },
  services: {
    en: { title: 'Services — TOP MARINE GROUP', desc: 'Ship management, technical, crewing, operation, chartering, procurement, HSQE and more.' },
    zh: { title: '服务 — TOP MARINE GROUP', desc: '船舶管理、技术管理、船员管理、运营、租船、采购、HSQE 等全方位服务。' },
  },
  fleet: {
    en: { title: 'Fleet — TOP MARINE GROUP', desc: 'Oil and chemical tankers from 30,000 to 320,000 DWT and container ships from 1,000 to 4,200 TEU.' },
    zh: { title: '船队 — TOP MARINE GROUP', desc: '30,000 至 320,000 DWT 的油轮、化学品船,以及 1,000 至 4,200 TEU 的集装箱船。' },
  },
  careers: {
    en: { title: 'Careers — TOP MARINE GROUP', desc: 'Build your career in ship management with TOP MARINE GROUP.' },
    zh: { title: '招聘 — TOP MARINE GROUP', desc: '加入 TOP MARINE GROUP,在船舶管理行业开创您的事业。' },
  },
  contact: {
    en: { title: 'Contact — TOP MARINE GROUP', desc: 'Contact TOP MARINE GROUP — Singapore and Shanghai offices.' },
    zh: { title: '联系我们 — TOP MARINE GROUP', desc: '联系 TOP MARINE GROUP——新加坡与上海办公室。' },
  },
};

export function titleFor(key, cookieStore) {
  const zh = cookieStore.get('tmg-lang')?.value === 'zh';
  const m = T[key][zh ? 'zh' : 'en'];
  return { title: m.title, description: m.desc };
}
