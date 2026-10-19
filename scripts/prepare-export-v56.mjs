// Fingerprints identify only exact byte duplicates of the packaged instruction clips.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../public'),context={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'audio-ms/manifest.js'),'utf8'),context);
const normalize=text=>String(text).normalize('NFC').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const hashes={};
for(const [text,clip] of Object.entries(context.window.JoranMalayAudio.clips)){
 if(typeof clip!=='string'||!clip.startsWith('audio-ms/'))continue;
 hashes[normalize(text)]=createHash('sha256').update(await fs.readFile(path.join(root,clip))).digest('hex');
}
await fs.writeFile(path.join(root,'audio-ms/export-hashes56.js'),'window.JoranPackagedHashes56='+JSON.stringify(hashes).replace(/</g,'\\u003c')+';\n');
console.log('Prepared '+Object.keys(hashes).length+' exact instruction fingerprints for compact export.');
