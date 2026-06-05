'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const LangCtx = createContext({ lang: 'en', setLang: () => {} });
const YEAR = 60 * 60 * 24 * 365;

export function LangProvider({ children, initialLang = 'en' }) {
  const [lang, setLangState] = useState(initialLang);

  // Reconcile with localStorage on mount (cookie already drove the SSR initial).
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('tmg-lang'); } catch {}
    if ((saved === 'zh' || saved === 'en') && saved !== lang) {
      setLangState(saved);
      document.documentElement.lang = saved === 'zh' ? 'zh-CN' : 'en';
      document.cookie = `tmg-lang=${saved}; path=/; max-age=${YEAR}; samesite=lax`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('tmg-lang', l); } catch {}
    document.cookie = `tmg-lang=${l}; path=/; max-age=${YEAR}; samesite=lax`;
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  };

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
