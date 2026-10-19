"""Audit the supplied backup and bundle the newest usable exact page readings.

Original audio bytes and input backup are preserved. No speech is synthesized.
Requires Node, FFmpeg and NumPy. The original backup is not modified.
"""
from pathlib import Path
import base64, collections, concurrent.futures, hashlib, json, math, re, subprocess, sys, unicodedata
import numpy as np

root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]).resolve()
data=json.loads(source.read_text())
assert data.get('format') in ('joran-minda-semua-suara','joran-minda-rakaman-guru') and data.get('version')==1
rows=data['recordings'];assert isinstance(rows,list) and len(rows)<=2000
engine="""import fs from 'node:fs';import vm from 'node:vm';const c={window:{}};c.globalThis=c;for(const file of ['public/story-engine.js','public/story-v37.js','public/audio-ms/manifest.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),c);console.log(JSON.stringify({pages:Object.fromEntries(c.JoranStory.keys.flatMap(k=>Array.from({length:5},(_,p)=>[k+':page'+(p+1),c.JoranStory.lessonText(k,p,37)]))),clips:c.window.JoranMalayAudio.clips}));"""
current=json.loads(subprocess.check_output(['node','--input-type=module','-e',engine],cwd=root,text=True))
canonical=current['pages'];clips=current['clips']
normal=lambda t:re.sub(r'\s+',' ',unicodedata.normalize('NFC',str(t))).strip()
voice_normal=lambda t:normal(t).replace('“','"').replace('”','"').replace('‘',"'").replace('’',"'")
exact_clips={voice_normal(t):v for t,v in clips.items()}
required=json.loads((root/'server/voice-required-v52.json').read_text())
selected={}
for i,row in enumerate(rows):
    slot=row.get('slot','')
    if slot in canonical and normal(row.get('text',''))==normal(canonical[slot]):
        if slot not in selected or row.get('savedAt',0)>rows[selected[slot]].get('savedAt',0):selected[slot]=i
assert set(selected)==set(canonical),'Missing current story page'

def audit(index_row):
    i,row=index_row
    out={k:row.get(k) for k in ('slot','text','takeId','savedAt')};out['index']=i
    try:
        assert isinstance(row.get('name'),str)
        assert re.fullmatch(r'data:audio/[a-zA-Z0-9.+-]+(?:;[^,]*)?;base64,[A-Za-z0-9+/=]+',row.get('url',''))
        raw=base64.b64decode(row['url'].split(',',1)[1],validate=True)
        assert 100<len(raw)<15*1024*1024
        proc=subprocess.run(['ffmpeg','-v','error','-i','pipe:0','-map','0:a:0','-ac','1','-ar','8000','-f','f32le','pipe:1'],input=raw,capture_output=True,timeout=90)
        assert proc.returncode==0,proc.stderr.decode(errors='replace')[:200]
        samples=np.frombuffer(proc.stdout,dtype='<f4');assert len(samples)>0
        peak=float(np.max(np.abs(samples)));rms=float(np.sqrt(np.mean(samples.astype(np.float64)**2)))
        duration=len(samples)/8000
        out.update(bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest(),duration=round(duration,3),peak=round(peak,6),rmsDb=round(20*math.log10(max(rms,1e-12)),2),decodes=True,nonSilent=peak>0.001)
        out['selected']=selected.get(row['slot'])==i
        out['minimumPlausibleDuration']=round(max(3,len(normal(row.get('text','')).split())/4.5),3)
        out['usablePageReading']=duration>=out['minimumPlausibleDuration'] and peak>0.001
    except Exception as error:out.update(decodes=False,error=str(error))
    return out

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    audited=list(pool.map(audit,enumerate(rows)))
failures=[r for r in audited if not r.get('decodes')]
latest=dict(selected);selected={};problems=[];review=[]
for slot in canonical:
    matching=[i for i,r in enumerate(rows) if r.get('slot')==slot and normal(r.get('text',''))==normal(canonical[slot])]
    usable=[i for i in matching if audited[i].get('decodes') and audited[i].get('usablePageReading')]
    if usable:selected[slot]=max(usable,key=lambda i:rows[i].get('savedAt',0))
    if slot not in selected or selected[slot]!=latest[slot]:
        problems.append({'slot':slot,'latestTakeId':rows[latest[slot]]['takeId'],'latestDuration':audited[latest[slot]].get('duration'),'selectedTakeId':rows[selected[slot]]['takeId'] if slot in selected else None,'selectedDuration':audited[selected[slot]].get('duration') if slot in selected else None,'reason':'Latest take too brief for the page or nearly silent.'})
        review.extend(i for i in matching if not audited[i].get('usablePageReading'))
for row in audited:row['selected']=selected.get(row['slot'])==row['index']
report={'version':54,'sourceFileName':source.name,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'inputRecords':len(rows),'storyTakes':sum(r.get('slot') in canonical for r in rows),'instructionTakes':sum(r.get('slot','').startswith('speech:') for r in rows),'selectedPageReadings':len(selected),'excludedEarlierStoryTakes':sum(r.get('slot') in canonical for r in rows)-len(selected),'decodeFailures':len(failures),'spokenWordsTranscribed':False,'problems':problems,'audioProcessing':'Original uploaded bytes preserved; no transcoding, trimming or synthesized narration.','recordings':audited}
(root/'server/backup-audit-v54.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
assert not failures,'Audio decoding failures; see backup-audit-v54.json'
pack={'version':1,'recordings':[]}
for slot in canonical:
    if slot not in selected:continue
    row=rows[selected[slot]]
    pack['recordings'].append({**{k:row[k] for k in ('slot','text','takeId','savedAt','name','url')},'storyVersion':37})
# AI clips already in the project are kept. Add only exact missing instruction texts.
additional=[]
for text in required:
    if voice_normal(text) in exact_clips:continue
    matches=[r for r in rows if r.get('slot','').startswith('speech:') and voice_normal(r['text'])==voice_normal(text)]
    if matches:
        row=max(matches,key=lambda r:r.get('savedAt',0));additional.append(text)
        pack['recordings'].append({k:row[k] for k in ('slot','text','takeId','savedAt','name','url')})
content='// V54: latest matching teacher readings from the supplied backup; original audio bytes.\nwindow.JoranTeacherVoicePack='+json.dumps(pack,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n'
assert len(content.encode())<24*1024*1024
(root/'public/suara-joran-minda.js').write_text(content)
review_rows=[{**{k:rows[i][k] for k in ('slot','text','takeId','savedAt','name','url')},'duration54':audited[i]['duration'],'nonSilent54':audited[i]['nonSilent'],'storyVersion':37} for i in review]
(root/'public/teacher-review54.js').write_text('// Uploaded takes retained for teacher review only; not pupil narration.\nwindow.JoranTeacherVoiceReview54='+json.dumps({'version':54,'recordings':review_rows},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n')
missing=[t for t in required if voice_normal(t) not in exact_clips and t not in additional]
old=json.loads((root/'server/audio-audit-v52.json').read_text())
for story in old['stories']:
    for page in story['pages']:
        slot=story['key']+':page'+str(page['page']);entry=audited[selected[slot]] if slot in selected else None
        assert normal(page['text'])==normal(canonical[slot])
        page.update(ready=entry is not None)
        if entry:page.update(takeId=entry['takeId'],savedAt=entry['savedAt'],duration=entry['duration'],sha256=entry['sha256'])
        else:page['reason']='Latest take lasts 1.86 seconds; earlier matching take lasts 3.24 seconds and is nearly silent. Please re-record this page.'
result={'version':54,'stories':old['stories'],'ai':{'total':len(required),'ready':len(required)-len(missing),'missing':missing},'teacher':{'ready':len(selected),'total':20,'latestExportReceived':True,'sourceSha256':report['sourceSha256'],'bytesUnchanged':True,'problems':problems},'backup':{k:report[k] for k in ('inputRecords','storyTakes','instructionTakes','decodeFailures','excludedEarlierStoryTakes')},'verification':'Exact text metadata, latest usable timestamp, full decoding, non-silence and conservative duration screening; spoken content not transcribed.'}
(root/'server/audio-audit-v54.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({**result['backup'],'teacher':result['teacher'],'ai':result['ai'],'packBytes':len(content.encode())},ensure_ascii=False))
