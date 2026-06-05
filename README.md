# TOP MARINE GROUP — Next.js site + inferred backend

A **real Next.js app** (React components, clean App-Router routes) for
**TOP MARINE GROUP**, a global ship-management company, plus a **standalone Node
backend** for the forms.

> Origin: this began as a 1:1 rebuild of associatedmaritime.com's layout, then was
> **rebranded to TOP MARINE GROUP** — all copy updated per the client brief, and
> **every photo/logo/hero replaced** with freely-licensed maritime images from
> Wikimedia Commons (see `public/img/CREDITS.txt`). None of the original site's
> photography or videos ship anymore. The 12 small home-grid glyphs are generic
> line icons (kept).

**Bilingual (EN / 中文).** A toggle button in the header switches the whole site
between English and Chinese; the choice persists (localStorage) and sets
`<html lang>`. All copy lives bilingually in `app/lib/content.js` (`{ en, zh }`
per string); `app/components/LangProvider.jsx` holds the active language and
`useLang()` exposes it. Backend API stays under the `/en/…` prefix regardless of
UI language.

Two tiers, mirroring the original (Vue front-end + Laravel back-end):

| Tier | Stack | Port (`.env`) |
|---|---|---|
| Frontend | Next.js 15 / React 19 (App Router) | **3037** (`FRONTEND_PORT`) |
| Backend  | Standalone Node HTTP API (inferred) | **8047** (`BACKEND_PORT`) |

The frontend proxies the API to the backend (Next `rewrites`), so client
components call relative URLs (no CORS), exactly as the original Vue code did.

---

## Quick start

```bash
npm run dev        # backend (8047, background) + frontend (3037, foreground). Ctrl-C stops both.
```

Open **http://localhost:3037/**.  Clean routes: `/` `/about` `/services`
`/fleet` `/careers` `/contact`.

One-command process management (ports come from `.env` — edit there to change):

```bash
npm run start    # start BOTH in background (health-checked)
npm run status   # up/down + health of each tier
npm run restart  # restart both
npm run stop     # stop both
npm run logs     # tail both logs   (npm run logs be | fe for one)
```

All wrap `scripts/serve.sh` (PID files + logs in `.run/`).

## 修改网站图片

所有页面图片、Logo、首页服务图标都集中配置在：

```text
app/lib/images.js
```

替换图片时只需要两步：

1. 把新图片放进 `public/img/`。如果是服务图标或 SVG 图标，也可以放进 `public/media/`。
2. 修改 `app/lib/images.js` 里对应配置项为新路径。

路径写法以 `public/` 为网站根目录。例如：

```js
export const SITE_IMAGES = {
  home: {
    leftHero: '/img/new-home-left.jpg',
    rightHero: '/img/new-home-right.jpg',
  },
};
```

如果文件实际位置是 `public/img/new-home-right.jpg`，配置里就写
`/img/new-home-right.jpg`。不要写 `public/img/...`。

### 配置项对应位置

| 配置 | 页面位置 |
|---|---|
| `SITE_IMAGES.logo` | 顶部导航 Logo |
| `SITE_IMAGES.logoWhite` | 页脚白色 Logo |
| `SITE_IMAGES.favicons.*` | 浏览器标签页图标 / Apple touch icon |
| `SITE_IMAGES.home.leftHero` | 首页左侧主图 |
| `SITE_IMAGES.home.rightHero` | 首页右侧主图 |
| `SITE_IMAGES.about.intro` | About 页面第一张图 |
| `SITE_IMAGES.about.why` | About 页面第二张图 |
| `SITE_IMAGES.fleet.hero` | Fleet 页面主图 |
| `SITE_IMAGES.careers.hero` | Careers 页面图片 |
| `SERVICE_IMAGES['service-*']` | Services 页面每个服务的大图 |
| `SERVICE_ICONS['service-*']` | 首页服务列表的小图标 |

服务 ID 与服务名称对应关系在 `app/lib/content.js` 的 `SERVICES` 中查看。
比如 `service-11` 是 Technical，`service-10` 是 Crewing。只改图片时通常不需要改
`content.js`，只改 `images.js`。

### Production / deploy

#### 纯服务器部署 + 开机自启（推荐给非 Docker 环境）

如果你就是要直接在 Linux 服务器上部署，不走 Docker，仓库里现在已经有一键脚本：

```bash
git clone <your-repo-url>
cd associatedmaritime
bash scripts/deploy-server.sh install
```

这条命令会自动完成：

- 安装 Node.js 22（Ubuntu / Debian）
- 生成 `.env.server`
- 自动生成随机 `ADMIN_PASS` 和 `ADMIN_SECRET`
- 执行 `npm ci`
- 执行 `npm run build`
- 注册 `systemd` 服务
- 设置开机自启
- 启动前后端并做健康检查

服务名：

- `associatedmaritime-backend.service`
- `associatedmaritime-frontend.service`

常用命令：

```bash
bash scripts/deploy-server.sh status
bash scripts/deploy-server.sh logs
bash scripts/deploy-server.sh restart
bash scripts/deploy-server.sh rebuild
bash scripts/deploy-server.sh stop
```

如果你想直接用 `systemctl`：

```bash
sudo systemctl status associatedmaritime-backend
sudo systemctl status associatedmaritime-frontend
sudo systemctl restart associatedmaritime-backend associatedmaritime-frontend
sudo journalctl -u associatedmaritime-backend -u associatedmaritime-frontend -f
```

服务器环境变量文件是：

```bash
.env.server
```

模板在：

```bash
.env.server.example
```

最重要的是这些配置项：

- `FRONTEND_PORT`: 网站端口，默认 `3037`
- `BACKEND_PORT`: 后端和 `/admin` 端口，默认 `8047`
- `BACKEND_URL`: 前端构建时代理到后端的地址，默认 `http://127.0.0.1:8047`
- `ADMIN_USER` / `ADMIN_PASS`: 管理后台账号密码
- `ADMIN_SECRET`: 管理后台 session 签名密钥
- `SMTP_*` / `MAIL_*`: 邮件通知配置，不填则只写入 `data/outbox/`

#### 一键生产部署（推荐）

新服务器上推荐直接用 Docker 部署，这样不需要先装 Node、npm 或任何项目依赖。

```bash
git clone <your-repo-url>
cd associatedmaritime
bash scripts/deploy-prod.sh
```

这个脚本会自动完成下面几件事：

- 安装 Docker 和 Docker Compose（Ubuntu / Debian）
- 自动生成 `.env.production`
- 自动生成随机 `ADMIN_PASS` 和 `ADMIN_SECRET`
- 构建前后端镜像
- 后台启动服务
- 做健康检查，确认前后端都可访问

常用命令：

```bash
bash scripts/deploy-prod.sh status
bash scripts/deploy-prod.sh logs
bash scripts/deploy-prod.sh restart
bash scripts/deploy-prod.sh down
```

首次执行后，记得检查并按需修改：

```bash
.env.production
```

重点是这些配置项：

- `FRONTEND_PORT`: 网站对外端口，默认 `3037`
- `BACKEND_PORT`: 后端和管理后台端口，默认 `8047`
- `ADMIN_USER` / `ADMIN_PASS`: `/admin` 登录账号密码
- `ADMIN_SECRET`: 管理后台会话签名密钥，必须足够随机
- `SMTP_*` / `MAIL_*`: 邮件通知配置，不填则只把邮件落到 `data/outbox/`

**Docker (recommended)** — two services (frontend + backend), shared `./data` volume:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production up -d --build
```

Edit `.env.production` to set the admin credentials and (optionally) the
`SMTP_*` / `MAIL_*` vars for email. The frontend proxies the API to the backend
over the compose network (`BACKEND_URL=http://backend:8047`, baked at build).

**Bare metal:**

```bash
npm run build      # next build -> .next/standalone
npm run prod       # backend (8047) + Next standalone server (3037)
```

The backend stores submissions in `data/topmarine.db` (SQLite) + resume files in
`data/careers/`. Review them at **`/admin`** (on :8047) — a login page protects it
(`ADMIN_USER` / `ADMIN_PASS`, default `admin` / `tmg-admin`; set `ADMIN_SECRET` to
a long random string in production). Each row links to the stored CV for download.
On every submit the backend also emails the recruitment inbox **and sends the
applicant a bilingual acknowledgement** (EN/中文 by their submission language).

### Email notification (optional)

On each CV submit the backend writes a `.eml` to `data/outbox/` and, **if SMTP is
configured**, also sends it. Set in `.env` (or compose):
`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (`true`=implicit TLS/465, `false`=STARTTLS/587),
`SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`. Unset → notifications just queue as `.eml`.

> `node_modules` is symlinked to a cached Next 15.3.5 / React 19 (the npm
> registry was unreachable in the build env). Run `npm install` to refresh.

---

## How it was built

This started as a pixel-perfect **static mirror** (the `site-replicate` skill,
≈99 % SSIM) and was then, on request, **rebuilt into a real Next.js app**:

- Every page is a React component under `app/` with a clean route — no `.html`
  URLs.
- The original site CSS (`vuebaca` / `layout` / `styles`) and all assets
  (logo, icon font, photos, videos) are reused verbatim, loaded via `<link>`
  in the layout, so the look matches without re-styling.
- The original is a Vue app whose **lazy component chunks, Typekit fonts and
  whole Laravel backend are dead on the live host** (chunks/fonts 404, API 500).
  Several effects depended on GSAP/Vue that no longer run there, so on the live
  site the home service tiles, section photos and the careers form are blank.
  **This rebuild restores all of them** — it is intentionally more complete than
  the broken original.

### What was reconstructed vs. the live site

| Area | Live site | This rebuild |
|---|---|---|
| Home 12-service grid | invisible (`opacity:0`, reveal JS dead) | visible, data-driven |
| About / Services photos | blank (dead `<bg-image>` component) | rendered |
| Service titles & copy | invisible (GSAP reveal dead) | visible |
| Scroll-reveal animations | dead (GSAP/vendor.js gone) | re-implemented (IntersectionObserver) |
| Careers form | blank (lazy chunk 404) | working React form → backend |
| Cookie consent bar | can't save (API 500) | working → backend |

Scroll reveals (fade/slide-in, the masked word-by-word title wipe, the underline
grow, staggered service tiles) are re-created in `app/components/Reveal.jsx` —
an `IntersectionObserver` that adds `.rx-in` as elements enter the viewport
(`app/globals.css` holds the before/after states), with a 1.8 s safety fallback
so content can never stay hidden.

---

## Layout

```
.
├── .env                       FRONTEND_PORT / BACKEND_PORT / BACKEND_URL
├── app/
│   ├── layout.jsx             html shell, loads original CSS, mounts globals
│   ├── globals.css            helpers + un-hiding the GSAP-animated content
│   ├── page.jsx               /          (home: hero video + 12-service grid)
│   ├── about|services|fleet|careers|contact/page.jsx
│   ├── components/            Header, Footer, CookieBar, PrivacyModal, CareerForm
│   └── lib/                   content.js (copy/nav/services), images.js (all image paths)
├── server/backend.cjs         standalone inferred backend (CSRF, cookies, careers)
├── next.config.js             API rewrites → backend (8047)
├── public/                    reused assets: site/navias/dist (css/js/fonts/img), media, videos
├── scripts/
│   ├── serve.sh               start/stop/restart/status/logs/dev
│   └── acceptance_ssim.py     SSIM harness (rebuilt routes vs live source)
├── data/                      submissions (NDJSON + uploaded CVs)   [gitignored]
└── .run/                      pid files + logs                       [gitignored]
```

---

## Inferred / restored backend (`server/backend.cjs`, port 8047)

Pure `node:http` + `busboy` (multipart). Endpoints are language-prefixed
(`/en/…`) exactly as the original Vue expects, with the same Laravel-style CSRF
handshake: `GET /{lang}/get/csrf` issues a token (+ httpOnly `xsrf_token`
cookie); mutating requests echo it in the `X-CSRF-TOKEN` header.

| Method & path | Purpose |
|---|---|
| `GET  /{lang}/get/csrf` | issue CSRF token |
| `POST /{lang}/set/cookies/pref` | save cookie consent → `data/cookie-consent.ndjson` |
| `POST /{lang}/career` | resume submission — multipart, validates (email, consent, PDF/DOC/DOCX ≤ 8 MB), stores CV under `data/careers/` + record in `data/careers.ndjson` |
| `GET  /health` | liveness probe |

CSRF enforced (missing/invalid → **419**); validation failures → **422** with
per-field messages the form renders inline.

---

## Notes

- The target is gated by a JS cookie challenge (`humans_21909=1`); the SSIM
  harness sends it when capturing the live source.
- SSIM vs the *live* site is only a rough gauge now: the rebuild deliberately
  shows content the broken live site hides, so pages like about/services score
  lower by design. Run `python3 scripts/acceptance_ssim.py` to recompute.
# associatedmaritime
