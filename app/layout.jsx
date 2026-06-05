import './globals.css';
import { cookies } from 'next/headers';
import { LangProvider } from './components/LangProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBar from './components/CookieBar';
import PrivacyModal from './components/PrivacyModal';
import Reveal from './components/Reveal';
import TitleManager from './components/TitleManager';
import { SITE_IMAGES } from './lib/images';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000',
};

export async function generateMetadata() {
  const zh = (await cookies()).get('tmg-lang')?.value === 'zh';
  return {
    title: zh ? 'TOP MARINE GROUP — 全球船舶管理' : 'TOP MARINE GROUP — global ship management',
    description: zh
      ? 'TOP MARINE GROUP 是一家全球性船舶管理公司,运营原油/成品油轮及集装箱船船队。'
      : 'TOP MARINE GROUP is a global ship management company operating a fleet of crude/product tankers and containerships',
    icons: {
      icon: [
        { url: SITE_IMAGES.favicons.icon32, sizes: '32x32' },
        { url: SITE_IMAGES.favicons.icon96, sizes: '96x96' },
      ],
      apple: SITE_IMAGES.favicons.apple152,
    },
  };
}

export default async function RootLayout({ children }) {
  const lang = (await cookies()).get('tmg-lang')?.value === 'zh' ? 'zh' : 'en';
  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'} translate="no">
      <head>
        {/* Original site stylesheets — served from /public so their relative
            url(../fonts/…) references keep resolving. */}
        <link rel="stylesheet" href="/site/navias/dist/css/vuebaca.css" />
        <link rel="stylesheet" href="/site/navias/dist/css/layoutcc7b.css" />
        <link rel="stylesheet" href="/site/navias/dist/css/styles94e5.css" />
      </head>
      <body>
        <LangProvider initialLang={lang}>
          <div className="page-wrapper">
            <Header />
            {children}
            <Footer />
          </div>
          <CookieBar />
          <PrivacyModal />
          <Reveal />
          <TitleManager />
        </LangProvider>
      </body>
    </html>
  );
}
