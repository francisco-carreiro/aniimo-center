#!/usr/bin/env python3
"""Create a portable one-file Wildbook, keeping all modules in dependency order."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
css=(root/'assets/style.css').read_text(encoding='utf-8')
modules=['data.js','live-data.js','wildbook-core.js','battle-data.js','battle-core.js','explorer-core.js']
chunks=[]
for name in modules:
    content=(root/'assets'/name).read_text(encoding='utf-8')
    content=re.sub(r'(?m)^import\s+\{[^}]+\}\s+from\s+[\'"][^\'\"]+[\'"];?\s*','',content)
    content=re.sub(r'\bexport\s+(?=(?:const|let|var|function|async\s+function|class)\b)','',content)
    chunks.append(content)
app=(root/'assets/app.js').read_text(encoding='utf-8')
assert 'const STORAGE=' in app
app=app[app.index('const STORAGE='):]
body='\n'.join(chunks)+'\nObject.assign(BUILDS,ADDITIONAL_BUILDS);\n'+app
body=body.replace('</script>','<\\/script>')
page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#eff8fa"><title>Aniimo Wildbook — Portable Edition</title><style>'''+css+'''</style></head><body><div id="app"></div><script>'''+body+'''</script></body></html>'''
out=root/'ANIIMO-WILDBOOK.html'
out.write_text(page,encoding='utf-8')
legacy=root/'ANIIMO-CENTER-standalone.html'
legacy.write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=ANIIMO-WILDBOOK.html"><title>Aniimo Wildbook</title><p><a href="ANIIMO-WILDBOOK.html">Open Aniimo Wildbook</a></p></html>',encoding='utf-8')
print(f'Created {out.name}: {len(page):,} characters')
