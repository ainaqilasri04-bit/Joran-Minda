import {readFile,writeFile} from 'node:fs/promises';
const path=new URL('../public/index.html',import.meta.url),html=await readFile(path,'utf8'),source=(await readFile(new URL('./lesson-ui.js',import.meta.url),'utf8'))+'\n'+(await readFile(new URL('./lesson-v25.js',import.meta.url),'utf8'))+'\n'+(await readFile(new URL('./lesson-v26.js',import.meta.url),'utf8'))+'\n'+(await readFile(new URL('./lesson-v27.js',import.meta.url),'utf8'))+'\n'+(await readFile(new URL('./lesson-v28.js',import.meta.url),'utf8'))+'\n'+(await readFile(new URL('./lesson-v29.js',import.meta.url),'utf8'));
const finalSource=source+'\n'+await readFile(new URL('./lesson-v30.js',import.meta.url),'utf8')+'\n'+await readFile(new URL('./lesson-v31.js',import.meta.url),'utf8')+'\n'+await readFile(new URL('./lesson-v32.js',import.meta.url),'utf8')+'\n'+await readFile(new URL('./lesson-v33.js',import.meta.url),'utf8')+'\n'+await readFile(new URL('./lesson-v34.js',import.meta.url),'utf8');
const start='/* BEGIN_PDP_UI */',end='/* END_PDP_UI */',a=html.indexOf(start),b=html.indexOf(end);
if(a<0||b<a||html.indexOf(start,a+start.length)>=0||html.indexOf(end,b+end.length)>=0)throw Error('PdP insertion markers missing or duplicated');
await writeFile(path,html.slice(0,a)+start+'\n'+finalSource+'\n'+end+html.slice(b+end.length));
console.log('PdP UI source synchronized.');
