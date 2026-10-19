"""Extract reviewed panels from generated production sprite sheets; no semantic editing."""
from pathlib import Path
import json, subprocess
p=Path(__file__).resolve().parents[1]
code="const fs=require('fs'),vm=require('vm');const c={};c.globalThis=c;for(const f of ['questions-v34','story-engine','story-v37','lesson-core','inclusive36','practice-v38','practice-v39','questions-v40','images-v44'])vm.runInNewContext(fs.readFileSync('public/'+f+'.js','utf8'),c);console.log(JSON.stringify(c.JoranImages44.groups));"
groups=json.loads(subprocess.check_output(['node','-e',code],cwd=p,text=True))
bounds={'objects44':([0,418,836,1254],[0,418,805,1254]),'actions-pondok44':([0,418,836,1254],[0,418,825,1254]),'actions-care44':([0,416,839,1254],[0,393,797,1254]),'actions-extra44':([0,418,838,1254],[0,365,790,1254]),'actions-diagnostic44':([0,416,837,1254],[0,414,814,1254])}
for sheet,ids in groups.items():
 xs,ys=bounds.get(sheet,([0,512,1024,1536],[0,513,1024]))
 for cell,id in enumerate(ids):
  col,row=cell%3,cell//3
  row_xs=[0,517,836,1254] if sheet=='actions-extra44' and row>0 else xs
  x,y=row_xs[col]+4,ys[row]+4;w,h=row_xs[col+1]-x-4,ys[row+1]-y-4
  subprocess.run(['convert',str(p/'artwork/v44'/f'{sheet}.png'),'-crop',f'{w}x{h}+{x}+{y}','+repage','-quality','94',str(p/'public/assets/v44'/f'{id}.webp')],check=True)
# The original paths are still consumed by puzzle, cover preview and legacy room views.
for key,prefix in [('belang','b'),('pondok','p'),('pokok','k'),('sihat','s')]:
 for n in range(1,6):(p/f'public/assets/{key}-{n}.webp').write_bytes((p/f'public/assets/v44/{prefix}{n}.webp').read_bytes())
 subprocess.run(['convert',str(p/f'public/assets/v44/{prefix}1.webp'),str(p/f'public/assets/focus35/{key}-situasi.png')],check=True)
print('Prepared',sum(map(len,groups.values())),'panels; 20 story paths and 4 puzzle/context paths updated.')
