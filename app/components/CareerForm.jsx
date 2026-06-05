'use client';
import { useEffect, useRef, useState } from 'react';
import { C } from '../lib/content';
import { useLang } from './LangProvider';

const APILANG = 'en'; // backend route prefix (/{lang}/career) — fixed
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CareerForm() {
  const { lang } = useLang();
  const f = C.form;
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetch(`/${APILANG}/get/csrf`, { credentials: 'same-origin' })
      .then((r) => r.json()).then((d) => setToken(d._token)).catch(() => {});
  }, []);

  function validate(form) {
    const e = {};
    if (!form.name.value.trim()) e.name = f.err.required[lang];
    const email = form.email.value.trim();
    if (!email) e.email = f.err.required[lang];
    else if (!EMAIL_RE.test(email)) e.email = f.err.email[lang];
    if (!form.resume.files[0]) e.resume = f.err.resume[lang];
    if (!form.consent.checked) e.consent = f.err.consent[lang];
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const form = formRef.current;
    if (!validate(form)) return;
    setLoading(true);
    try {
      let t = token;
      if (!t) { t = (await fetch(`/${APILANG}/get/csrf`, { credentials: 'same-origin' }).then((r) => r.json()))._token; setToken(t); }
      const res = await fetch(`/${APILANG}/career`, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'X-CSRF-TOKEN': t, 'X-Requested-With': 'XMLHttpRequest' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (res.status === 200 && data.success) setDone(true);
      else if (res.status === 422 && data.errors) setErrors(data.errors);
      else setErrors({ name: f.err.failed[lang] });
    } catch {
      setErrors({ name: f.err.network[lang] });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="p-4 text-white" style={{ background: '#33c91b' }}>
        <strong>{f.thanks[lang]}</strong> {f.thanksMsg[lang]}
      </div>
    );
  }

  const Err = ({ name }) => errors[name]
    ? <span className="error-msg" style={{ display: 'block' }}>{errors[name]}</span> : null;

  return (
    <form ref={formRef} className="career-form" noValidate onSubmit={onSubmit}>
      {[['name', f.name], ['email', f.email, 'email'], ['phone', f.phone], ['position', f.position], ['message', f.message]].map(([n, label, type]) => (
        <div className="input-wrapper" key={n}>
          <label htmlFor={`cf-${n}`}>{label[lang]}</label>
          <input type={type || 'text'} id={`cf-${n}`} name={n} />
          <Err name={n} />
        </div>
      ))}

      <div className="input-wrapper">
        <div className="file-wrapper">
          <input className="input" type="file" id="cf-resume" name="resume" accept=".pdf,.doc,.docx"
            onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
          <label className="input-btn" htmlFor="cf-resume"><span>{f.upload[lang]}</span></label>
          <span className="filename">{fileName}</span>
          <Err name="resume" />
        </div>
      </div>

      <div className="input-wrapper">
        <label className="checkbox-wrapper">
          <input type="checkbox" name="consent" id="cf-consent" />
          <span className="checkbox"></span>
          <span style={{ paddingLeft: 6 }}>
            {f.agree[lang]}{' '}
            <a style={{ cursor: 'pointer' }} onClick={() => window.dispatchEvent(new CustomEvent('rx-modal', { detail: 'privacy' }))}>{f.privacy[lang]}</a>
          </span>
        </label>
        <Err name="consent" />
      </div>

      <button type="submit" className={`btn-submit mt-6${loading ? ' loading' : ''}`} disabled={loading}>
        <span>{f.submit[lang]}</span><span className="loader"></span>
      </button>
    </form>
  );
}
