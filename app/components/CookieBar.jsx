'use client';
import { useEffect, useState } from 'react';
import { C } from '../lib/content';
import { useLang } from './LangProvider';

const APILANG = 'en';

function dismissed() {
  return ('; ' + document.cookie).includes('; showCookiesBar=false');
}

export default function CookieBar() {
  const { lang } = useLang();
  const k = C.cookie;
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [prefs, setPrefs] = useState({ necessary: true, statistics: true, marketing: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setVisible(!dismissed());
    const onModal = (e) => {
      if (e.detail === 'cookies') setSettings(true);
      if (e.detail === 'policy') setPolicy(true);
    };
    window.addEventListener('rx-modal', onModal);
    return () => window.removeEventListener('rx-modal', onModal);
  }, []);

  async function save(next) {
    setBusy(true);
    try {
      const t = await fetch(`/${APILANG}/get/csrf`, { credentials: 'same-origin' }).then((r) => r.json());
      await fetch(`/${APILANG}/set/cookies/pref`, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': t._token, 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify(next),
      });
    } catch { /* offline: still dismiss */ }
    document.cookie = 'showCookiesBar=false; path=/; max-age=' + 60 * 60 * 24 * 365;
    setBusy(false); setVisible(false); setSettings(false);
  }

  const acceptAll = () => save({ necessary: true, statistics: true, marketing: true });

  return (
    <>
      {visible && (
        <div className="cookies-bar" style={{ background: '#164893' }}>
          <div className="message px-3">
            <div className="cookies-text">
              <p className="text-white mb-2">
                {k.text[lang]}{' '}
                <a className="link-white text-decoration-underline" style={{ cursor: 'pointer' }} onClick={() => setPolicy(true)}>{k.policyLink[lang]}</a>.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center" style={{ gap: 16 }}>
            <button type="button" className="btn-save-cookies" style={{ background: '#fff', color: '#164893', border: 0 }}
              disabled={busy} onClick={acceptAll}>{k.confirm[lang]}</button>
            <button type="button" className="link-white" style={{ background: 'none', border: 0, textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setSettings(true)}>{k.change[lang]}</button>
          </div>
        </div>
      )}

      {settings && (
        <div className="rx-modal-backdrop" onClick={() => setSettings(false)}>
          <div className="rx-modal p-sm-8 p-4" onClick={(e) => e.stopPropagation()}>
            <button className="btn-modal-close" onClick={() => setSettings(false)}>✕</button>
            <p className="cookies-title">{k.settingsTitle[lang]}</p>
            {k.items.map((it) => (
              <div key={it.key} className="d-flex justify-content-between align-items-start py-3 border-top">
                <div className="pe-4">
                  <p className="cookie-title mb-1">{it.title[lang]}</p>
                  <p className="cookie-descr mb-0">{it.descr[lang]}</p>
                </div>
                <label className="d-inline-flex align-items-center" style={{ cursor: it.locked ? 'not-allowed' : 'pointer' }}>
                  <input type="checkbox" checked={prefs[it.key]} disabled={it.locked}
                    onChange={(e) => setPrefs((p) => ({ ...p, [it.key]: e.target.checked }))} />
                </label>
              </div>
            ))}
            <button type="button" className="btn-save-cookies mt-4" style={{ background: '#164893', color: '#fff', border: 0 }}
              disabled={busy} onClick={() => save(prefs)}>{k.save[lang]}</button>
          </div>
        </div>
      )}

      {policy && (
        <div className="rx-modal-backdrop" onClick={() => setPolicy(false)}>
          <div className="rx-modal p-sm-8 p-4" onClick={(e) => e.stopPropagation()}>
            <button className="btn-modal-close" onClick={() => setPolicy(false)}>✕</button>
            <p className="cookies-title">{k.policyTitle[lang]}</p>
            <p className="cookie-descr">{k.policy[lang]}</p>
          </div>
        </div>
      )}
    </>
  );
}
