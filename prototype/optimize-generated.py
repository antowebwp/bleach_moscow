"""Encode the generated photographic assets; retain source PNGs separately."""
import json, shutil
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parent
rows=json.loads((root/'generated-image-sources.json').read_text(encoding='utf-8'))
dest=root/'assets'/'generated';dest.mkdir(exist_ok=True)
originals=root.parent/'image-sources';originals.mkdir(exist_ok=True)
thumbs=[]
for row in rows:
    if not row.get('path'): continue
    name=row['id']; local=originals/(name+'.png'); src=local if local.exists() else Path(row['path'])
    if src.resolve()!=local.resolve(): shutil.copy2(src,local)
    im=Image.open(src).convert('RGBA' if row.get('transparent') else 'RGB')
    row['originalSize']=list(im.size); row['variants']=[]
    for width in [640,960,1600]:
        actual=min(width,im.width)
        small=im.resize((actual,round(im.height*actual/im.width)),Image.Resampling.LANCZOS)
        file=dest/f'{name}-{width}.webp';small.save(file,'WEBP',quality=80,method=6)
        row['variants'].append({'width':actual,'path':str(file.relative_to(root)).replace('\\','/'),'bytes':file.stat().st_size})
    thumb=ImageOps.fit(im,(400,250));ImageDraw.Draw(thumb).text((12,12),name,fill='white',stroke_width=2,stroke_fill='black');thumbs.append(thumb)
board=Image.new('RGB',(1200,((len(thumbs)+2)//3)*250),'white')
for i,thumb in enumerate(thumbs):board.paste(thumb,((i%3)*400,(i//3)*250))
board.save(root/'preview-generated-contact-sheet.jpg',quality=90)
(root/'generated-image-sources.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print('\n'.join(f"{r['id']}: "+', '.join(f"{v['width']}px {v['bytes']//1024}KB" for v in r.get('variants',[])) for r in rows))
