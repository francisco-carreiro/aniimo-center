"""Read-only HEAD checks for source links in assets/data.js."""
from pathlib import Path
import re, urllib.request, json
text=(Path(__file__).resolve().parent.parent/'assets/data.js').read_text(encoding='utf-8')
urls=list(dict.fromkeys(re.findall(r"url:'(https?://[^']+)'",text)))
results=[]
for url in urls:
 try:
  req=urllib.request.Request(url,method='HEAD',headers={'User-Agent':'AniimoCenterSourceWatch/1.0'})
  with urllib.request.urlopen(req,timeout=12) as res: status=res.status
 except Exception as exc: status=str(exc)
 results.append({'url':url,'status':status})
print(json.dumps(results,indent=2))
