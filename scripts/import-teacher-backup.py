"""Bundle the latest matching teacher reading for every story page.

Usage: python scripts/import-teacher-backup.py BACKUP.json
Requires node, ffmpeg and ffprobe. The input backup is never changed.
Speech/AI entries are already bundled in audio-ms and are not duplicated here.
"""
import base64
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unicodedata

project=Path(__file__).resolve().parent.parent
source=Path(sys.argv[1]).resolve()
data=json.loads(source.read_text())
assert data.get('version')==1 and data.get('format') in ('joran-minda-semua-suara','joran-minda-rakaman-guru')
assert isinstance(data.get('recordings'),list) and len(data['recordings'])<=2000
normal=lambda t:re.sub(r'\s+',' ',unicodedata.normalize('NFC',str(t))).strip()
engine="import fs from 'node:fs';import vm from 'node:vm';const c={};vm.runInNewContext(fs.readFileSync('public/story-engine.js','utf8'),c);console.log(JSON.stringify(Object.fromEntries(c.JoranStory.keys.flatMap(k=>Array.from({length:5},(_,p)=>[k+':page'+(p+1),c.JoranStory.lessonText(k,p)])))));"
canonical=json.loads(subprocess.check_output(['node','--input-type=module','-e',engine],cwd=project,text=True))
selected={}
for row in data['recordings']:
    slot=row.get('slot','')
    if slot not in canonical or normal(row.get('text',''))!=normal(canonical[slot]):
        continue
    if slot not in selected or row.get('savedAt',0)>selected[slot].get('savedAt',0):
        selected[slot]=row
missing=set(canonical)-set(selected)
assert not missing, 'Missing current teacher pages: '+', '.join(sorted(missing))
pack={'version':1,'recordings':[]}
report={'version':33,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
    'inputRecords':len(data['recordings']),'storyTakes':sum(r.get('slot','') in canonical for r in data['recordings']),
    'selection':'Newest savedAt per story/page, exact current text match',
    'audioProcessing':'MP3 64 kbps, mono, 24 kHz; no generated speech, trimming or denoising',
    'humanSpokenContentReviewed':False,'clips':[]}
with tempfile.TemporaryDirectory(prefix='joran-teacher-') as tmp:
    for slot,text in canonical.items():
        row=selected[slot]
        assert re.fullmatch(r'data:audio/[a-zA-Z0-9.+-]+(?:;[^,]*)?;base64,[A-Za-z0-9+/=]+',row.get('url',''))
        raw=base64.b64decode(row['url'].split(',',1)[1],validate=True)
        assert len(raw)>1000 and len(raw)<15*1024*1024
        source_audio=Path(tmp)/(slot.replace(':','-')+'.source')
        output=source_audio.with_suffix('.mp3');source_audio.write_bytes(raw)
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(source_audio),'-map','0:a:0',
            '-codec:a','libmp3lame','-b:a','64k','-ac','1','-ar','24000',str(output)],check=True)
        subprocess.run(['ffmpeg','-v','error','-i',str(output),'-f','null','-'],check=True,capture_output=True)
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration',
            '-of','default=noprint_wrappers=1:nokey=1',str(output)],text=True))
        assert duration>=3, 'Very short latest recording requires review: '+slot
        encoded=output.read_bytes()
        record={k:row[k] for k in ('slot','text','takeId','savedAt')}
        record.update(name='bacaan-'+slot.replace(':','-')+'.mp3',
            url='data:audio/mpeg;base64,'+base64.b64encode(encoded).decode(),storyVersion=25)
        pack['recordings'].append(record)
        report['clips'].append({'slot':slot,'text':text,'takeId':row['takeId'],'savedAt':row['savedAt'],
            'sourceBytes':len(raw),'sourceSha256':hashlib.sha256(raw).hexdigest(),
            'bytes':len(encoded),'sha256':hashlib.sha256(encoded).hexdigest(),
            'duration':duration,'currentTextMatches':True})
assert len(pack['recordings'])==20
content='// Latest teacher recordings for 20 story pages. Pupil recordings are excluded.\nwindow.JoranTeacherVoicePack='+json.dumps(pack,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n'
assert len(content.encode())<24*1024*1024
(project/'public/suara-joran-minda.js').write_text(content)
(project/'server/teacher-voice-v33.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'teacherPages':len(pack['recordings']),'scriptBytes':len(content.encode()),
    'clips':[{'slot':r['slot'],'duration':r['duration'],'matches':r['currentTextMatches']} for r in report['clips']]}))
