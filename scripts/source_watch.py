#!/usr/bin/env python3
"""Read-only check of cited guides. Does not scrape personal data or alter recommendations.

Can run locally or through GitHub Actions. Network access is required.
No data is copied into the site; human review is required before changing builds.
"""
import datetime as dt
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JAVASCRIPT = (ROOT / 'assets' / 'data.js').read_text(encoding='utf-8')
SOURCES = re.findall(r"\{id:'([^']+)',name:'([^']+)',url:'([^']+)',date:'([^']+)'", JAVASCRIPT)
REPORT = ROOT / 'docs' / 'source-watch-report.md'


def check(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'AniimoCenterSourceWatch/1.0 (+personal fan project; manual review)', 'Accept': 'text/html'})
    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            body = response.read(100_000)
            title = re.search(rb'<title[^>]*>(.*?)</title>', body, flags=re.I | re.S)
            return str(response.status), response.headers.get('Last-Modified', 'not supplied'), (
                re.sub(r'\s+', ' ', title.group(1).decode('utf-8', 'replace'))[:110] if title else 'not extracted')
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return 'ERROR', '-', str(exc).replace('|', '/')[:110]


def main():
    now = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    lines = ['# ANIIMO CENTER — source availability watch', '', f'Checked: {now}', '',
             'Read-only link availability check. **It does not verify recommendations or automatically update builds.**', '',
             '| Source | Snapshot review | HTTP status | Last-Modified | Page title / error |',
             '|---|---|---:|---|---|']
    failed = []
    for ident, label, url, review in SOURCES:
        status, modified, detail = check(url)
        if status != '200':
            failed.append(ident)
        lines.append(f'| [{label}]({url}) | {review} | {status} | {modified} | {detail.replace("|", "/")} |')
        print(f'{status}: {ident}: {url}', flush=True)
    lines += ['', f'Checked {len(SOURCES)} curated sources; {len(failed)} unavailable or non-200.', '',
              '## Manual review procedure', '',
              '1. Open each changed source and check the relevant game patch / publication date.',
              '2. Verify game-data facts against the current in-game client where possible.',
              '3. Update the exact `assets/data.js` records and their source dates.',
              '4. Test the team and build interfaces before deploying.', '']
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Report: {REPORT}', flush=True)
    # Network/transient failures should not permanently block static deployment.
    return 0


if __name__ == '__main__':
    sys.exit(main())
