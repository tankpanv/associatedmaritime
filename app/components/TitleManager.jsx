'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { NAV } from '../lib/content';
import { useLang } from './LangProvider';

const HOME = { en: 'TOP MARINE GROUP — global ship management', zh: 'TOP MARINE GROUP — 全球船舶管理' };

// Sets <title> per route and language (pages are client components, so they
// can't export metadata themselves).
export default function TitleManager() {
  const pathname = usePathname();
  const { lang } = useLang();
  useEffect(() => {
    const nav = NAV.find((n) => n.href !== '/' && pathname.startsWith(n.href));
    document.title = (pathname === '/' || !nav) ? HOME[lang] : `${nav[lang]} — TOP MARINE GROUP`;
  }, [pathname, lang]);
  return null;
}
