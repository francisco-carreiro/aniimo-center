#!/usr/bin/env python3
"""Create a portable file that can run via file:// without ES module imports."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
css = (root/'assets/style.css').read_text(encoding='utf-8')
data = (root/'assets/data.js').read_text(encoding='utf-8')
app = (root/'assets/app.js').read_text(encoding='utf-8')
live = (root/'assets/live-data.js').read_text(encoding='utf-8')
for label in ('export const ', 'export function ', 'export async function '):
    data = data.replace(label, label.replace('export ', ''))
    live = live.replace(label, label.replace('export ', ''))
app = app[app.index('const STORAGE='):]
app = app.replace('</script>', '<\\/script>')
page = '''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#080e1a"><title>ANIIMO CENTER — Portable Edition</title><style>'''+css+'''</style></head><body><div id="app"></div><script>'''+data+'\n'+live+'\n'+app+'''</script></body></html>'''
out = root/'ANIIMO-CENTER-standalone.html'
out.write_text(page, encoding='utf-8')
print('Created', out, len(page), 'characters')
