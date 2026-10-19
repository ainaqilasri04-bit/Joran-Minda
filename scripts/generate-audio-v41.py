"""Generate missing exact-text Malay clips using edge-tts 7.3.1.

Install: python -m pip install edge-tts==7.3.1
Run: python scripts/generate-audio-v41.py
Requires ffmpeg/ffprobe. Existing audio and teacher recordings are preserved.
The Edge client is an independent open-source package, not an Azure API.
"""
import asyncio
import hashlib
import html
import json
import os
import re
import ssl
import subprocess
from pathlib import Path

import edge_tts
import edge_tts.communicate as communication

project = Path(__file__).resolve().parent.parent
manifest_path = project / 'public/audio-ms/manifest.js'
manifest = json.loads(manifest_path.read_text().split('=', 1)[1].strip().removesuffix(';'))
catalogue = json.loads((project / 'server/voice-new-v41.json').read_text())
pending = catalogue['clips']  # Verify retained files too; fetch only missing files.
work = project.parent / 'audio-auto-work-v41'
work.mkdir(exist_ok=True)
target_dir = project / 'public/audio-ms/clips'
target_dir.mkdir(exist_ok=True)
if os.environ.get('SSL_CERT_FILE'):
    # Trust the CA supplied by the runtime; retain TLS and hostname checks.
    communication._SSL_CTX.load_verify_locations(cafile=ssl.get_default_verify_paths().cafile)

def words(text):
    return re.sub(r'[^\w]', '', html.unescape(text).lower())

def inspect_audio(file):
    info = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
        'format=duration,size','-of','json',str(file)], text=True))['format']
    if float(info['duration']) <= .15 or int(info['size']) <= 1000:
        raise ValueError('Empty or truncated audio')
    subprocess.run(['ffmpeg','-v','error','-i',str(file),'-f','null','-'],check=True,capture_output=True)
    return float(info['duration'])

async def main():
    semaphore = asyncio.Semaphore(8)
    result = {}
    async def one(clip):
        async with semaphore:
            target = target_dir / (clip['id']+'.mp3')
            metadata = work / (clip['id']+'.jsonl')
            temporary = work / (clip['id']+'.part.mp3')
            if not target.exists() or not metadata.exists():
                for attempt in range(3):
                    try:
                        speech = edge_tts.Communicate(clip['text'],'ms-MY-YasminNeural',rate='-3%')
                        await asyncio.wait_for(speech.save(str(temporary),str(metadata)),timeout=65)
                        await asyncio.to_thread(inspect_audio,temporary)
                        temporary.replace(target)
                        break
                    except Exception as error:
                        if getattr(error,'status',None) in (401,403,429) or attempt == 2:
                            raise RuntimeError(f"Audio request failed for {clip['id']}: {type(error).__name__}") from error
                        await asyncio.sleep(2*(attempt+1))
            duration = await asyncio.to_thread(inspect_audio,target)
            boundaries = [json.loads(line) for line in metadata.read_text().splitlines() if line.strip()]
            spoken = ' '.join(x['text'] for x in boundaries)
            result[clip['id']] = {**clip,'path':'audio-ms/clips/'+target.name,
                'duration':duration,'bytes':target.stat().st_size,
                'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
                'boundaryText':spoken,'textMatched':words(spoken)==words(clip['text'])}
            if len(result)%10==0 or len(result)==len(pending):
                print(json.dumps({'ready':len(result),'total':len(pending)},ensure_ascii=False),flush=True)
            (work/'progress.json').write_text(json.dumps({'completed':list(result.values()),'expected':len(pending)},ensure_ascii=False))
    await asyncio.gather(*(one(c) for c in pending))
    report = {'version':41,'provider':'Microsoft Edge online TTS via edge-tts 7.3.1',
        'voice':'ms-MY-YasminNeural','rate':'-3%','includesTeacherStoryNarration':False,
        'clips':[result[c['id']] for c in pending]}
    (project/'server/voice-autogen-v41.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    mismatches = [r['id'] for r in report['clips'] if not r['textMatched']]
    if mismatches:
        print(json.dumps({'metadataMismatches':mismatches}),flush=True)
        raise SystemExit('Audio generated but not installed: inspect text metadata mismatches first.')
    for row in report['clips']:
        manifest['clips'].setdefault(row['text'], row['path'])
    manifest['automaticGeneration'] = {'voice':report['voice'],'rate':report['rate'],'clips':len(report['clips']),
        'checks':['decoding','duration','provider boundary text matches input'],'humanPronunciationReviewed':False}
    manifest_path.write_text('window.JoranMalayAudio='+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+';\n')
    print(json.dumps({'installed':len(report['clips']),'catalogueReady':len(manifest['clips'])}),flush=True)

asyncio.run(main())
