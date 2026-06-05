#!/usr/bin/env python3
"""Fetch relevant, freely-licensed maritime photos from Wikimedia Commons to
replace the original site's images. Writes to public/img/ + a CREDITS.txt with
attribution. Picks the first landscape JPEG/PNG of reasonable size per query."""
import json, os, time, urllib.parse, urllib.request, html, re

UA = "MaritimeSiteBuilder/1.0 (contact: shoaibrizwan39@gmail.com)"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
API = "https://commons.wikimedia.org/w/api.php"

# (filename, search query) — order roughly matches the site's image slots
SLOTS = [
    ("hero-home",       "oil tanker ship ocean"),
    ("hero-fleet",      "container ship ocean"),
    ("hero-careers",    "ship crew deck seafarer"),
    ("about-1",         "crude oil tanker at sea"),
    ("about-2",         "oil tanker port aerial"),
    ("ship-management", "VLCC supertanker"),
    ("technical",       "ship engine room machinery"),
    ("crewing",         "merchant ship crew deck"),
    ("operation",       "ship bridge navigation"),
    ("chartering",      "bulk carrier cargo ship sea"),
    ("procurement",     "container terminal port"),
    ("hsqe",            "ship lifebuoy safety"),
    ("sale-purchase",   "cargo ship ocean"),
    ("financial",       "office desk laptop business"),
    ("insurance",       "tanker ship harbour"),
    ("newbuilding",     "shipyard dry dock"),
    ("fsofpso",         "FPSO offshore platform"),
]
BAD = re.compile(r"(logo|map|chart|diagram|icon|flag|seal|coat of arms|\.svg)", re.I)

def api(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = r.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)

def pick(query):
    d = api({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": query, "gsrlimit": 12, "gsrnamespace": 6,
        "prop": "imageinfo", "iiprop": "url|mime|size|extmetadata", "iiurlwidth": 1600,
    })
    pages = list(d.get("query", {}).get("pages", {}).values())
    pages.sort(key=lambda p: p.get("index", 999))
    for p in pages:
        title = p.get("title", "")
        if BAD.search(title):
            continue
        ii = (p.get("imageinfo") or [{}])[0]
        if ii.get("mime") not in ("image/jpeg", "image/png"):
            continue
        tw, th = ii.get("thumbwidth", 0), ii.get("thumbheight", 1)
        if tw < 900 or tw < th * 1.15:      # landscape & big enough
            continue
        meta = ii.get("extmetadata", {})
        def m(k): return html.unescape(re.sub("<[^>]+>", "", str(meta.get(k, {}).get("value", "")))).strip()
        return {
            "thumburl": ii["thumburl"], "title": title,
            "artist": m("Artist") or "Unknown", "license": m("LicenseShortName") or "see source",
            "descurl": ii.get("descriptionurl", ""),
        }
    return None

def main():
    os.makedirs(OUT, exist_ok=True)
    credits = ["Image credits — sourced from Wikimedia Commons (freely licensed).",
               "Replaces the original site's imagery. Each line: file <- source (author, license).", ""]
    for name, query in SLOTS:
        try:
            info = pick(query)
            if not info:
                print(f"[miss] {name}: no match for '{query}'"); continue
            dest = os.path.join(OUT, name + ".jpg")
            sz = download(info["thumburl"], dest)
            print(f"[ok]   {name}.jpg  {sz//1024}KB  <- {info['title'][:55]}")
            credits.append(f"{name}.jpg  <-  {info['title']}  | {info['artist'][:60]} | {info['license']} | {info['descurl']}")
        except Exception as e:
            print(f"[err]  {name}: {e}")
        time.sleep(0.6)
    with open(os.path.join(OUT, "CREDITS.txt"), "w") as f:
        f.write("\n".join(credits) + "\n")
    print("\nwrote", OUT)

if __name__ == "__main__":
    main()
