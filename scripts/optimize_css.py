#!/usr/bin/env python3
"""Conservatively compress CSS source for production without rewriting declarations."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
source=(root/'assets/style.css').read_text(encoding='utf-8')
# Strip block comments while respecting string literals and escaped quotes.
output=[];i=0;quote=None
while i<len(source):
 c=source[i]
 if quote:
  output.append(c)
  if c=='\\' and i+1<len(source):i+=1;output.append(source[i])
  elif c==quote:quote=None
 elif c in ('"',"'"):
  quote=c;output.append(c)
 elif source.startswith('/*',i):
  end=source.find('*/',i+2)
  if end<0:raise ValueError('Unterminated CSS comment')
  i=end+2;continue
 else:output.append(c)
 i+=1
text=''.join(output)
# The source is already compact; only trim indentation outside block declarations.
text=re.sub(r'(?m)^\\s+', '', text)
text=re.sub(r'\\n\\s*', '\\n', text)
(root/'assets/style.min.css').write_text(text,encoding='utf-8')
print(f'CSS source {len(source):,} → production {len(text):,} characters')
