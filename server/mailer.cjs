'use strict';
// Minimal SMTP sender + durable fallback. When SMTP env is configured it sends;
// either way it writes the message as a .eml to data/outbox so there is always a
// durable record (and so the feature works without credentials).
const net = require('node:net');
const tls = require('node:tls');
const fsp = require('node:fs/promises');
const path = require('node:path');

function b64(s) { return Buffer.from(String(s)).toString('base64'); }

// Talk SMTP. Supports implicit TLS (secure=true, e.g. 465) and STARTTLS (587).
// `recipients` is the comma-separated RCPT list (defaults to cfg.to).
function smtpConverse(cfg, raw, recipients) {
  return new Promise((resolve, reject) => {
    let sock = cfg.secure
      ? tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host })
      : net.connect({ host: cfg.host, port: cfg.port });
    let buf = '';
    let resolver = null;
    const reply = () => new Promise((r) => { resolver = r; });
    const cmd = (line) => sock.write(line + '\r\n');
    const attach = (s) => {
      s.setTimeout(15000);
      s.on('timeout', () => { s.destroy(); reject(new Error('smtp timeout')); });
      s.on('error', reject);
      s.on('data', (d) => {
        buf += d.toString('utf8');
        const lines = buf.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (/^\d{3} /.test(lines[i])) {
            const code = parseInt(lines[i].slice(0, 3), 10);
            buf = lines.slice(i + 1).join('\n');
            if (resolver) { const r = resolver; resolver = null; r(code); }
            break;
          }
        }
      });
    };
    (async () => {
      try {
        let code = await reply(); if (code !== 220) throw new Error('greeting ' + code);
        cmd('EHLO topmarine.cn'); code = await reply(); if (code !== 250) throw new Error('ehlo ' + code);
        if (!cfg.secure) {
          cmd('STARTTLS'); code = await reply(); if (code !== 220) throw new Error('starttls ' + code);
          const sec = tls.connect({ socket: sock, servername: cfg.host });
          await new Promise((res, rej) => { sec.once('secureConnect', res); sec.once('error', rej); });
          sock = sec; attach(sock);
          cmd('EHLO topmarine.cn'); code = await reply(); if (code !== 250) throw new Error('ehlo2 ' + code);
        }
        cmd('AUTH LOGIN'); code = await reply(); if (code !== 334) throw new Error('auth ' + code);
        cmd(b64(cfg.user)); code = await reply(); if (code !== 334) throw new Error('user ' + code);
        cmd(b64(cfg.pass)); code = await reply(); if (code !== 235) throw new Error('pass ' + code);
        cmd('MAIL FROM:<' + cfg.from + '>'); code = await reply(); if (code !== 250) throw new Error('from ' + code);
        for (const rcpt of String(recipients || cfg.to).split(',').map((s) => s.trim()).filter(Boolean)) {
          cmd('RCPT TO:<' + rcpt + '>'); code = await reply();
          if (code !== 250 && code !== 251) throw new Error('rcpt ' + code);
        }
        cmd('DATA'); code = await reply(); if (code !== 354) throw new Error('data ' + code);
        sock.write(raw.replace(/\r?\n\./g, '\r\n..') + '\r\n.\r\n');
        code = await reply(); if (code !== 250) throw new Error('send ' + code);
        cmd('QUIT'); sock.end(); resolve(true);
      } catch (e) { try { sock.end(); } catch {} reject(e); }
    })();
    attach(sock);
  });
}

function buildRaw({ from, to, subject, text }) {
  const date = new Date().toUTCString();
  const enc = '=?UTF-8?B?' + b64(subject) + '?=';
  return [
    `From: TOP MARINE GROUP <${from}>`,
    `To: ${to}`,
    `Subject: ${enc}`,
    `Date: ${date}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(text).replace(/(.{76})/g, '$1\r\n'),
  ].join('\r\n');
}

// cfg: {host,port,secure,user,pass,from,to}; mail: {to?,subject,text,stamp}
// mail.to overrides cfg.to (e.g. the applicant acknowledgement).
async function sendMail(cfg, mail, outboxDir) {
  const to = mail.to || cfg.to || 'admin@top-marine.cn';
  const raw = buildRaw({ from: cfg.from || 'no-reply@top-marine.cn', to, subject: mail.subject, text: mail.text });
  await fsp.mkdir(outboxDir, { recursive: true });
  const file = path.join(outboxDir, mail.stamp + '.eml');
  await fsp.writeFile(file, raw);
  if (cfg.host && cfg.user && cfg.pass && to) {
    try { await smtpConverse(cfg, raw, to); return { sent: true, file }; }
    catch (e) { return { sent: false, error: String(e && e.message || e), file }; }
  }
  return { sent: false, skipped: true, file };
}

module.exports = { sendMail };
