"""Bundle the local-device game for review. Does not deploy or emulate room APIs."""
from pathlib import Path
import base64, json, mimetypes, re, sys

root = Path(__file__).resolve().parents[1]
public = root / 'public'
out = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else root.parent / 'Joran-Minda-Cuba-Dahulu.html'
assets = {}
for path in sorted(public.rglob('*')):
    if not path.is_file() or path.suffix.lower() not in {'.png', '.webp', '.jpg', '.jpeg', '.mp3', '.woff2'}:
        continue
    if 'hand' in path.relative_to(public).parts:
        continue
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    assets[path.relative_to(public).as_posix()] = 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()

bootstrap = '''
window.JoranStandalone35=true;
window.JoranPreviewResources=RESOURCES;
window.JoranPreviewResolve35=function(parent){
 const apply=el=>{for(const attr of ['src','href']){const value=el.getAttribute?.(attr);const data=window.JoranPreviewResources[value];if(data)el.setAttribute(attr,data);}};
 if(parent?.nodeType===1)apply(parent);
 parent?.querySelectorAll?.('img[src],image[href],audio[src],source[src]').forEach(apply);
};
new MutationObserver(records=>{for(const r of records){if(r.type==='attributes')window.JoranPreviewResolve35(r.target);else r.addedNodes.forEach(window.JoranPreviewResolve35);}}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['src','href']});
'''.replace('RESOURCES', json.dumps(assets, separators=(',', ':')))
html = (public / 'index.html').read_text()
html = html.replace('</head>', '<script>' + bootstrap + '</script></head>', 1)

def stylesheet(m):
    path = public / m.group(1)
    if not path.is_file():
        raise RuntimeError('Missing stylesheet: ' + str(path))
    return '<style>' + path.read_text() + '</style>'

def script(m):
    path = public / m.group(1)
    if not path.is_file():
        raise RuntimeError('Missing script: ' + str(path))
    content = path.read_text().replace('</script', '<\\/script')
    if m.group(1) == 'audio-ms/manifest.js':
        content += '''
for(const [text,clip] of Object.entries(window.JoranMalayAudio.clips)){
 if(typeof clip==='string')window.JoranMalayAudio.clips[text]=window.JoranPreviewResources[clip]||clip;
 else clip.src=window.JoranPreviewResources[clip.src]||clip.src;
}
'''
    return '<script>\n' + content + '\n</script>'

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', stylesheet, html)
html = re.sub(r'<script src="([^"]+)"></script>', script, html)
html = html.replace("const root=document.getElementById('jm19');", "window.JoranPreviewResolve35(document);\nconst root=document.getElementById('jm19');", 1)
preview_guard = '''
// Review copy: room access remains a real server feature, never a local simulation.
const apiOnline35=api;
api=async function(){throw Error('Pratonton ini untuk satu peranti. Buka laman Netlify yang telah dikemas kini untuk menggunakan bilik dalam talian.');};
const access35=$('#jm-session-access');
if(access35){access35.value='device';for(const o of access35.options)if(o.value!=='device')o.disabled=true;}
const previewNote35=document.createElement('p');previewNote35.className='jm-pdp-notice';previewNote35.textContent='Pratonton V57 · Individu atau kumpulan pada satu peranti. Gunakan klik atau sentuhan untuk memancing. Bilik dalam talian tersedia dalam projek penuh.';homeHelp37.append(previewNote35);
'''
html = html.replace('/* END_PDP_UI */', preview_guard + '\n/* END_PDP_UI */')
html = re.sub(r'<title>[^<]*</title>', '<title>Joran Minda V57 — Cuba Dahulu</title>', html, count=1)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html)
print(json.dumps({'file': str(out), 'bytes': out.stat().st_size, 'embedded_resources': len(assets), 'online_rooms': False, 'camera': False}))
