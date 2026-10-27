"""Build the self-contained ANIIMO CENTER HTML from local static assets."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parent.parent
css=(ROOT/'assets/style.css').read_text(encoding='utf-8')
data=(ROOT/'assets/data.js').read_text(encoding='utf-8')
app=(ROOT/'assets/app.js').read_text(encoding='utf-8')
data=re.sub(r'\nexport \{[^}]+\};\s*$', '', data)
app=re.sub(r'^import \{[^}]+\} from [\'\"]\./data\.js[\'\"];?\s*', '', app)
index=(ROOT/'index.html').read_text(encoding='utf-8')
index=re.sub(r'<link rel="stylesheet" href="\./assets/style\.css">', '<style>'+css+'</style>', index)
index=re.sub(r'<script type="module" src="\./assets/app\.js"></script>', '<script>'+data+'\n'+app+'</script>',index)
index=re.sub(r'<link rel="icon"[^>]+>', '', index)
(ROOT/'ANIIMO-CENTER-standalone.html').write_text(index,encoding='utf-8')
print('Generated standalone HTML')
