"""Split an ordered TTSMaker batch at its three-second pauses.

Usage: python scripts/import-tts-batch.py INPUT.mp3 MAP.json OUTPUT.json
Requires ffmpeg and ffprobe. MAP.json contains batch and clips [{id, text}].
Rejects missing/extra separators before updating the website audio catalogue.
"""
import base64
import hashlib
import json
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.parse import quote

project = Path(__file__).resolve().parent.parent
source, mapping_path, backup_path = map(Path, sys.argv[1:4])
mapping = json.loads(mapping_path.read_text())
clips = mapping['clips']
assert clips and len({c['id'] for c in clips}) == len(clips)
assert all(re.fullmatch(r'[a-z0-9-]+', c['id']) and c['text'].strip() for c in clips)

def duration(path):
    value = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
        'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(path)], text=True)
    return float(value)

analysis = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(source), '-af',
    'silencedetect=noise=-40dB:d=2.4', '-f', 'null', '-'], capture_output=True, text=True, check=True)
gaps = [(float(a), float(b)) for a, b in re.findall(
    r'silence_start: ([\d.]+).*?silence_end: ([\d.]+)', analysis.stderr, re.S)]
total = duration(source)
gaps = [(a, b) for a, b in gaps if a > .5 and b < total - .5]
if len(gaps) != len(clips) - 1:
    raise SystemExit(f'No files installed: expected {len(clips)-1} pauses, found {len(gaps)}.')
assert all(2.7 <= b-a <= 4.1 for a, b in gaps), 'Unexpected separator duration; inspect the source.'
bounds = [(0 if i == 0 else max(0, gaps[i-1][1]-.15),
           total if i == len(clips)-1 else min(total, gaps[i][0]+.20))
          for i in range(len(clips))]
audio_dir = project / 'public/audio-ms/clips'
audio_dir.mkdir(exist_ok=True)
manifest_path = project / 'public/audio-ms/manifest.js'
manifest = json.loads(manifest_path.read_text().split('=', 1)[1].strip().removesuffix(';'))
records, audit = [], []
saved_at = int(time.time()*1000)
with tempfile.TemporaryDirectory() as folder:
    staged = []
    for index, (clip, (start, end)) in enumerate(zip(clips, bounds), 1):
        target = Path(folder) / (clip['id']+'.mp3')
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(source), '-ss', str(start),
            '-t', str(end-start), '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame',
            '-b:a', '64k', '-map_metadata', '-1', '-y', str(target)], check=True)
        actual = duration(target)
        assert .3 < actual < 120 and abs(actual-(end-start)) < .2
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(target), '-f', 'null', '-'], check=True)
        normalized = re.sub(r'\s+', ' ', clip['text'].replace('“','"').replace('”','"')
                            .replace('‘', "'").replace('’', "'")).strip()
        name = f"{mapping['batch']}-{index:02d}.mp3"
        records.append({'slot':'speech:'+quote(normalized, safe="-_.!~*'()"),
            'text':normalized, 'name':name, 'takeId':mapping['batch']+'-'+clip['id'],
            'savedAt':saved_at, 'url':'data:audio/mpeg;base64,'+base64.b64encode(target.read_bytes()).decode()})
        staged.append((target, audio_dir/target.name))
        manifest['clips'][normalized] = 'audio-ms/clips/'+target.name
        audit.append({**clip, 'order':index, 'start':round(start,6), 'end':round(end,6),
                      'duration':actual, 'file':target.name})
    # All cuts must decode successfully before any website file is installed.
    for temporary, target in staged:
        target.write_bytes(temporary.read_bytes())
manifest['batchSources'] = [x for x in manifest.get('batchSources', []) if x['batch'] != mapping['batch']]
manifest['batchSources'].append({'batch':mapping['batch'], 'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
    'clips':len(clips), 'checked':'pause-count, duration and decoding', 'spokenContentReviewed':False})
manifest_path.write_text('window.JoranMalayAudio='+json.dumps(manifest, ensure_ascii=False, separators=(',',':'))+';\n')
backup_path.write_text(json.dumps({'format':'joran-minda-semua-suara','version':1,'recordings':records},
                                ensure_ascii=False, separators=(',',':')))
report = {**mapping, 'sourceFile':source.name, 'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
          'sourceDuration':total, 'separatorCount':len(gaps), 'clips':audit,
          'spokenContentReviewed':False}
mapping_path.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'installedClips':len(clips),'backup':str(backup_path), 'catalogueClips':len(manifest['clips']),
                  'audioDurations':[r['duration'] for r in audit]}))
