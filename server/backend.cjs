'use strict';
/*
 * Standalone backend for TOP MARINE GROUP — inferred replacement for the
 * original (dead) Laravel API. Runs on BACKEND_PORT (default 8047). Storage is
 * node:sqlite (data/topmarine.db); resume files live on disk under data/careers.
 *
 *   GET  /{lang}/get/csrf         -> { _token }  (+ httpOnly xsrf_token cookie)
 *   POST /{lang}/set/cookies/pref -> save cookie consent
 *   POST /{lang}/career           -> resume submission + admin notify + applicant ack
 *   GET  /admin/login | POST      -> session login
 *   GET  /admin                   -> submissions (login required)
 *   GET  /admin/cv/:id            -> download a stored resume (login required)
 *   GET  /admin/logout            -> clear session
 *   GET  /health                  -> { ok: true }
 */
const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const Busboy = require('busboy');
const { DatabaseSync } = require('node:sqlite');
const { sendMail } = require('./mailer.cjs');

const PORT = parseInt(process.env.BACKEND_PORT || '8047', 10);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUTBOX = path.join(DATA_DIR, 'outbox');
const CSRF_COOKIE = 'xsrf_token';
const SESSION_COOKIE = 'tmg_admin';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'tmg-admin';
const ADMIN_SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update('tmg-session::' + ADMIN_PASS).digest('hex');
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8h
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_BYTES = 8 * 1024 * 1024;

const SMTP = {
  host: process.env.SMTP_HOST || '', port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: (process.env.SMTP_SECURE || 'true') === 'true',
  user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '',
  from: process.env.MAIL_FROM || 'no-reply@top-marine.cn',
  to: process.env.MAIL_TO || 'admin@top-marine.cn',
};

// applicant acknowledgement copy, by submission language
const ACK = {
  en: (name) => ({
    subject: 'Thank you for your application — TOP MARINE GROUP',
    text: `Dear ${name || 'Applicant'},\n\nThank you for applying to TOP MARINE GROUP. We have received your application and resume, and our recruitment team will review it carefully.\n\nIf your profile matches a current or future opportunity, we will be in touch. We keep your resume on file for thirty-six (36) months.\n\nBest regards,\nTOP MARINE GROUP Recruitment\nadmin@top-marine.cn`,
  }),
  zh: (name) => ({
    subject: '感谢您的应聘 — TOP MARINE GROUP',
    text: `尊敬的 ${name || '应聘者'}:\n\n感谢您应聘 TOP MARINE GROUP。我们已收到您的申请及简历,招聘团队将认真评估。\n\n如果您的背景与当前或未来的职位相匹配,我们会主动与您联系。您的简历将在我们这里保存三十六(36)个月。\n\n此致\nTOP MARINE GROUP 招聘团队\nadmin@top-marine.cn`,
  }),
};

// ---- db --------------------------------------------------------------------
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'topmarine.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, lang TEXT, name TEXT, email TEXT,
    phone TEXT, position TEXT, message TEXT, resume TEXT, resume_name TEXT,
    resume_type TEXT, resume_size INTEGER, ip TEXT
  );
  CREATE TABLE IF NOT EXISTS cookie_consent (
    id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, lang TEXT, prefs TEXT, ip TEXT, ua TEXT
  );
`);

// ---- helpers ---------------------------------------------------------------
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function verifyCsrf(req) {
  const c = parseCookies(req)[CSRF_COOKIE];
  const h = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'] || '';
  if (!c || !h) return false;
  const a = Buffer.from(c), b = Buffer.from(String(h));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}
function htmlRes(res, status, body, headers = {}) { res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers }); res.end(body); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function readBody(req) { return new Promise((r, j) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => r(d)); req.on('error', j); }); }

// ---- admin session ---------------------------------------------------------
function signSession() {
  const payload = Buffer.from(JSON.stringify({ u: ADMIN_USER, exp: Date.now() + SESSION_TTL })).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  return payload + '.' + sig;
}
function isAuthed(req) {
  const tok = parseCookies(req)[SESSION_COOKIE] || '';
  const [payload, sig] = tok.split('.');
  if (!payload || !sig) return false;
  const expect = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
function safeEqual(a, b) { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); }

function loginForm(res, error) {
  htmlRes(res, error ? 401 : 200, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>TMG admin · login</title>
    <style>body{font-family:system-ui,Arial;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#0c336d}
    form{background:#fff;padding:32px;border-radius:8px;width:300px}h1{font-size:18px;color:#0c336d;margin:0 0 18px}
    input{width:100%;box-sizing:border-box;padding:10px;margin-bottom:12px;border:1px solid #ccd;border-radius:4px}
    button{width:100%;padding:11px;background:#0c336d;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:15px}
    .err{color:#ce0000;font-size:13px;margin-bottom:10px}</style></head>
    <body><form method="post" action="/admin/login"><h1>TOP MARINE GROUP — admin</h1>
    ${error ? '<div class="err">Invalid credentials</div>' : ''}
    <input name="user" placeholder="user" autocomplete="username" autofocus>
    <input name="pass" type="password" placeholder="password" autocomplete="current-password">
    <button type="submit">Sign in</button></form></body></html>`);
}

async function handleLogin(req, res) {
  const body = await readBody(req);
  const p = new URLSearchParams(body);
  if (safeEqual(p.get('user') || '', ADMIN_USER) && safeEqual(p.get('pass') || '', ADMIN_PASS)) {
    res.writeHead(302, { Location: '/admin', 'Set-Cookie': `${SESSION_COOKIE}=${signSession()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL / 1000}` });
    return res.end();
  }
  loginForm(res, true);
}

function adminPage(res) {
  const careers = db.prepare('SELECT * FROM careers ORDER BY id DESC LIMIT 500').all();
  const cookies = db.prepare('SELECT COUNT(*) c FROM cookie_consent').get();
  const rows = careers.map((r) => `<tr>
    <td>${r.id}</td><td>${esc(r.at)}</td><td>${esc(r.lang)}</td><td>${esc(r.name)}</td>
    <td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td><td>${esc(r.phone)}</td>
    <td>${esc(r.position)}</td>
    <td>${r.resume ? `<a href="/admin/cv/${r.id}">${esc(r.resume_name || 'download')}</a>` : ''}</td></tr>`).join('');
  htmlRes(res, 200, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>TMG admin</title>
    <style>body{font-family:system-ui,Arial;margin:24px;color:#0c336d}h1{font-size:20px;display:inline-block}
    a.logout{float:right;font-size:13px}table{border-collapse:collapse;width:100%;font-size:13px}
    td,th{border:1px solid #ccd;padding:6px 8px;text-align:left}th{background:#0c336d;color:#fff}tr:nth-child(even){background:#f4f6fb}</style></head>
    <body><a class="logout" href="/admin/logout">log out</a><h1>TOP MARINE GROUP — submissions</h1>
    <p>${careers.length} career applications · ${cookies.c} cookie-consent records</p>
    <table><thead><tr><th>#</th><th>at</th><th>lang</th><th>name</th><th>email</th><th>phone</th><th>position</th><th>CV</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="8">none yet</td></tr>'}</tbody></table></body></html>`);
}

function downloadCv(res, id) {
  const row = db.prepare('SELECT resume, resume_name, resume_type FROM careers WHERE id=?').get(Number(id));
  if (!row || !row.resume) return htmlRes(res, 404, '<h1>404</h1>');
  const abs = path.resolve(DATA_DIR, row.resume);
  if (!abs.startsWith(path.resolve(DATA_DIR) + path.sep) || !fs.existsSync(abs)) return htmlRes(res, 404, '<h1>404</h1>');
  const name = encodeURIComponent(row.resume_name || path.basename(abs));
  res.writeHead(200, {
    'Content-Type': row.resume_type || 'application/octet-stream',
    'Content-Disposition': `attachment; filename*=UTF-8''${name}`,
  });
  fs.createReadStream(abs).pipe(res);
}

// ---- multipart -------------------------------------------------------------
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    let bb;
    try { bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_BYTES + 1, files: 1 } }); }
    catch (e) { return reject(e); }
    const fields = {}; let file = null, truncated = false;
    bb.on('field', (n, v) => { fields[n] = v; });
    bb.on('file', (_n, stream, info) => {
      const chunks = [];
      stream.on('data', (c) => chunks.push(c));
      stream.on('limit', () => { truncated = true; });
      stream.on('end', () => { file = { name: info.filename, type: info.mimeType, buffer: Buffer.concat(chunks) }; });
    });
    bb.on('error', reject);
    bb.on('close', () => resolve({ fields, file, truncated }));
    req.pipe(bb);
  });
}

// ---- handlers --------------------------------------------------------------
function handleCsrf(req, res) {
  const token = crypto.randomBytes(32).toString('hex');
  send(res, 200, { _token: token }, { 'Set-Cookie': `${CSRF_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200` });
}

async function handleCookiesPref(req, res, lang) {
  if (!verifyCsrf(req)) return send(res, 419, { success: false, message: 'CSRF token mismatch' });
  let prefs = {};
  try {
    const ct = req.headers['content-type'] || '';
    const raw = await readBody(req);
    if (ct.includes('application/json')) prefs = JSON.parse(raw || '{}');
    else new URLSearchParams(raw).forEach((v, k) => { prefs[k] = v === 'true' || v === '1'; });
  } catch { prefs = {}; }
  prefs = { necessary: true, ...prefs };
  db.prepare('INSERT INTO cookie_consent (at, lang, prefs, ip, ua) VALUES (?,?,?,?,?)')
    .run(new Date().toISOString(), lang, JSON.stringify(prefs), req.socket.remoteAddress, req.headers['user-agent'] || null);
  const yr = 60 * 60 * 24 * 365;
  send(res, 200, { success: true, prefs }, {
    'Set-Cookie': [
      `showCookiesBar=false; Path=/; Max-Age=${yr}; SameSite=Lax`,
      `consent=${encodeURIComponent(JSON.stringify(prefs))}; Path=/; Max-Age=${yr}; SameSite=Lax`,
    ],
  });
}

async function handleCareer(req, res, lang) {
  if (!verifyCsrf(req)) return send(res, 419, { success: false, message: 'CSRF token mismatch' });
  let parsed;
  try { parsed = await parseMultipart(req); }
  catch { return send(res, 400, { success: false, message: 'Expected multipart/form-data' }); }
  const f = parsed.fields;
  const name = (f.name || '').trim(), email = (f.email || '').trim();
  const consent = ['true', '1', 'on', 'yes'].includes((f.consent || '').toLowerCase());
  const resume = parsed.file;
  const errors = {};
  if (!name) errors.name = 'Required';
  if (!email) errors.email = 'Required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email';
  if (!consent) errors.consent = 'Consent required';
  if (!resume || !resume.buffer || !resume.buffer.length) errors.resume = 'Resume file required';
  else if (parsed.truncated || resume.buffer.length > MAX_BYTES) errors.resume = 'File too large (max 8 MB)';
  else if (resume.type && !ALLOWED.includes(resume.type)) errors.resume = 'Only PDF / DOC / DOCX allowed';
  if (Object.keys(errors).length) return send(res, 422, { success: false, errors });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safe = (resume.name || 'cv').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  await fsp.mkdir(path.join(DATA_DIR, 'careers'), { recursive: true });
  const rel = path.join('careers', `${stamp}__${safe}`);
  await fsp.writeFile(path.join(DATA_DIR, rel), resume.buffer);

  const rec = {
    at: new Date().toISOString(), lang, name, email,
    phone: (f.phone || '').trim(), position: (f.position || '').trim(), message: (f.message || '').trim(),
    resume: rel, resumeName: resume.name || null, resumeType: resume.type || null, resumeSize: resume.buffer.length,
    ip: req.socket.remoteAddress,
  };
  db.prepare(`INSERT INTO careers (at,lang,name,email,phone,position,message,resume,resume_name,resume_type,resume_size,ip)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(rec.at, rec.lang, rec.name, rec.email, rec.phone, rec.position, rec.message, rec.resume, rec.resumeName, rec.resumeType, rec.resumeSize, rec.ip);

  // 1) notify recruitment inbox  2) acknowledge the applicant (in their language)
  sendMail(SMTP, {
    stamp: stamp + '__notify',
    subject: `New CV application — ${name}`,
    text: `New resume submission on TOP MARINE GROUP careers.\n\n` +
      `Name: ${name}\nEmail: ${email}\nPhone: ${rec.phone}\nPosition: ${rec.position}\n` +
      `Message: ${rec.message}\nResume: ${rec.resumeName} (${rec.resumeType}, ${rec.resumeSize} bytes)\n` +
      `Stored: data/${rel}\nReceived: ${rec.at}\n`,
  }, OUTBOX).then((r) => console.log('[mail] notify', r.sent ? 'sent' : (r.skipped ? 'queued' : 'FAILED ' + r.error)))
    .catch((e) => console.error('[mail] notify error', e));

  const ack = (ACK[lang] || ACK.en)(name);
  sendMail(SMTP, { to: email, stamp: stamp + '__ack', subject: ack.subject, text: ack.text }, OUTBOX)
    .then((r) => console.log('[mail] ack', r.sent ? 'sent' : (r.skipped ? 'queued' : 'FAILED ' + r.error)))
    .catch((e) => console.error('[mail] ack error', e));

  send(res, 200, { success: true, message: 'Thank you — your application has been received.' });
}

// ---- router ----------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const p = url.pathname;
    if (req.method === 'GET' && p === '/health') return send(res, 200, { ok: true, port: PORT, db: 'sqlite' });

    // admin (session-protected)
    if (p === '/admin/login') {
      if (req.method === 'POST') return handleLogin(req, res);
      return loginForm(res, false);
    }
    if (p === '/admin/logout') {
      res.writeHead(302, { Location: '/admin/login', 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0` });
      return res.end();
    }
    if (p === '/admin' || p.startsWith('/admin/cv/')) {
      if (!isAuthed(req)) { res.writeHead(302, { Location: '/admin/login' }); return res.end(); }
      if (p === '/admin') return adminPage(res);
      return downloadCv(res, p.slice('/admin/cv/'.length));
    }

    const parts = p.split('/').filter(Boolean);
    const lang = parts[0] || 'en';
    const rest = parts.slice(1).join('/');
    if (req.method === 'GET' && rest === 'get/csrf') return handleCsrf(req, res);
    if (req.method === 'POST' && rest === 'set/cookies/pref') return handleCookiesPref(req, res, lang);
    if (req.method === 'POST' && rest === 'career') return handleCareer(req, res, lang);
    send(res, 404, { success: false, message: 'Not found' });
  } catch (e) {
    console.error('[backend]', e);
    send(res, 500, { success: false, message: 'Internal error' });
  }
});

server.listen(PORT, () => {
  console.log(`[backend] TOP MARINE GROUP API on http://localhost:${PORT}  (sqlite; SMTP ${SMTP.host ? 'configured' : 'queue-only'}; admin login as "${ADMIN_USER}")`);
});
