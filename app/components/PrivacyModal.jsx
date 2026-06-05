'use client';
import { useEffect, useState } from 'react';
import { C } from '../lib/content';
import { useLang } from './LangProvider';

export default function PrivacyModal() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onModal = (e) => { if (e.detail === 'privacy') setOpen(true); };
    window.addEventListener('rx-modal', onModal);
    return () => window.removeEventListener('rx-modal', onModal);
  }, []);
  if (!open) return null;
  return (
    <div className="rx-modal-backdrop" onClick={() => setOpen(false)}>
      <div className="rx-modal p-sm-8 p-4" onClick={(e) => e.stopPropagation()}>
        <button className="btn-modal-close" onClick={() => setOpen(false)}>✕</button>
        <div className="text-terms mt-4"><p>{C.privacy.text[lang]}</p></div>
      </div>
    </div>
  );
}
