#!/usr/bin/env python3
"""Multi-breakpoint SSIM acceptance: local mirror vs live source.

Captures both sides with identical methodology (fresh context, humans cookie,
videos frozen to frame 0, cookie-bar dismissed) so SSIM reflects real layout
fidelity rather than video-frame / animation noise.
"""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image
import numpy as np
from skimage.metrics import structural_similarity as ssim

SOURCE = "http://www.associatedmaritime.com"
OURS   = "http://localhost:3037"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
# (name, live-source path, rebuilt clean route)
PAGES = [
    ("home",     "/en.html",          "/"),
    ("about",    "/en/about.html",    "/about"),
    ("services", "/en/services.html", "/services"),
    ("fleet",    "/en/fleet.html",    "/fleet"),
    ("careers",  "/en/careers.html",  "/careers"),
    ("contact",  "/en/contact.html",  "/contact"),
]
BREAKPOINTS = [("desktop", 1440, 900), ("mobile", 375, 812)]
OUT = "/tmp/am-acceptance"

FREEZE = """() => {
  document.querySelectorAll('video').forEach(v => { try { v.pause(); v.currentTime = 0; } catch(e){} });
  // hide cookie bar so it never differs in timing between the two captures
  document.querySelectorAll('.cookies-bar, [class*=cookies-bar], cookies-bar').forEach(e => e.style.display='none');
}"""

def shot(page, base, path, dst, is_source):
    # autoplay videos keep the network busy forever, so don't wait on networkidle
    page.goto(base + path, wait_until="load", timeout=45000)
    page.wait_for_timeout(2500)
    try: page.evaluate(FREEZE)
    except Exception: pass
    page.wait_for_timeout(500)
    page.screenshot(path=dst, full_page=True)

def score(a_path, b_path):
    a = Image.open(a_path).convert("L"); b = Image.open(b_path).convert("L")
    w = min(a.width, b.width)
    if a.width != w: a = a.resize((w, round(a.height*w/a.width)))
    if b.width != w: b = b.resize((w, round(b.height*w/b.width)))
    h = min(a.height, b.height)
    a = a.crop((0,0,w,h)); b = b.crop((0,0,w,h))
    A = np.asarray(a); B = np.asarray(b)
    s = ssim(A, B)
    return s, (a.width, a.height), (Image.open(a_path).height, Image.open(b_path).height)

def main():
    os.makedirs(OUT, exist_ok=True)
    rows = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for bp, W, H in BREAKPOINTS:
            for base, tag in [(SOURCE,"src"), (OURS,"our")]:
                ctx = b.new_context(user_agent=UA, viewport={"width":W,"height":H},
                                    device_scale_factor=1)
                if base == SOURCE:
                    ctx.add_cookies([{"name":"humans_21909","value":"1",
                                      "domain":"www.associatedmaritime.com","path":"/"}])
                pg = ctx.new_page()
                for name, src_path, our_path in PAGES:
                    path = src_path if base == SOURCE else our_path
                    dst = f"{OUT}/{bp}-{tag}-{name}.png"
                    try:
                        shot(pg, base, path, dst, base==SOURCE)
                    except Exception as e:
                        print(f"[warn] {tag} {bp} {name}: {e}")
                ctx.close()
        b.close()
    print(f"\n{'page':10} {'bp':8} {'SSIM':>7}   src_h  our_h")
    print("-"*44)
    agg = {}
    for bp, W, H in BREAKPOINTS:
        for name, _sp, _op in PAGES:
            sp = f"{OUT}/{bp}-src-{name}.png"; op = f"{OUT}/{bp}-our-{name}.png"
            if not (os.path.exists(sp) and os.path.exists(op)):
                print(f"{name:10} {bp:8}  MISSING"); continue
            s,(w,h),(sh,oh) = score(sp, op)
            rows.append((name,bp,s,sh,oh))
            agg.setdefault(bp,[]).append(s)
            flag = "" if s>=0.95 else (" *" if s>=0.90 else " **")
            print(f"{name:10} {bp:8} {s*100:6.2f}%  {sh:5} {oh:5}{flag}")
    print("-"*44)
    for bp, vals in agg.items():
        print(f"avg {bp:8}: {sum(vals)/len(vals)*100:6.2f}%   (n={len(vals)})")
    allv = [r[2] for r in rows]
    if allv:
        print(f"\nOVERALL avg SSIM: {sum(allv)/len(allv)*100:.2f}%")
        print(f">=95%: {sum(1 for v in allv if v>=.95)}/{len(allv)}   "
              f">=90%: {sum(1 for v in allv if v>=.90)}/{len(allv)}   "
              f">=85%: {sum(1 for v in allv if v>=.85)}/{len(allv)}")

if __name__ == "__main__":
    main()
