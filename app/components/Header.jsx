'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '../lib/content';
import { SITE_IMAGES } from '../lib/images';
import { useLang } from './LangProvider';

function LangSelect({ lang, setLang, dark }) {
  return (
    <select
      className={`lang-select${dark ? ' lang-select-dark' : ''}`}
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language"
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className={`header${scrolled ? ' page-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <div className="logo-wrapper">
          <Link href="/" className="logo-link">
            <img src={SITE_IMAGES.logo} className="logo" alt="TOP MARINE GROUP" />
          </Link>
        </div>

        <button type="button" className="btn-menu d-lg-none" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          <div className="btn-menu-lines"><span></span><span></span></div>
        </button>

        <ul className="main-menu d-lg-flex d-none">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className={isActive(n.href) ? 'active' : ''}>{n[lang]}</Link>
            </li>
          ))}
          <li className="lang-item">
            <LangSelect lang={lang} setLang={setLang} />
          </li>
        </ul>
      </header>

      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
        <ul className="mobile-menu">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className={isActive(n.href) ? 'active' : ''}>{n[lang]}</Link>
            </li>
          ))}
          <li>
            <LangSelect lang={lang} setLang={setLang} dark />
          </li>
        </ul>
      </div>
    </>
  );
}
