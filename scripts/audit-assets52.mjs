import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..'),previous=path.resolve(root,'../../joran-v51/joran-minda');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'public/audio-ms/manifest.js'),'utf8'),context);
const files=[...new Set(Object.values(context.window.JoranMalayAudio.clips).map(c=>typeof c==='string'?c:c.src))],failures=[];
for(const rel of files){const current=fs.readFileSync(path.join(root,'public',rel)),before=fs.readFileSync(path.join(previous,'public',rel));if(current.length<1000||!current.equals(before))failures.push(rel);}
const teacher='public/suara-joran-minda.js',current=fs.readFileSync(path.join(root,teacher)),before=fs.readFileSync(path.join(previous,teacher));if(!current.equals(before))failures.push(teacher);
vm.runInNewContext(current.toString(),context);
const report={aiUniqueFiles:files.length,existingAudioUnchanged:!failures.length,teacherStoredTakes:context.window.JoranTeacherVoicePack.recordings.length,teacherPackSha256:crypto.createHash('sha256').update(current).digest('hex'),failures,checks:'All mapped files exist, are nonempty and byte-identical to V51. Exact text match assessed by runtime audit. Not a human listening test.'};
fs.writeFileSync(path.join(root,'server/audio-files-v52.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(failures.length)process.exitCode=1;
