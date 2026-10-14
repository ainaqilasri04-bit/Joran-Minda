import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {createHandler} from '../server/room-service.mjs';
class Store{data=new Map();async get(k){return structuredClone(this.data.get(k)||null);}async setJSON(k,v,o={}){if(o.onlyIfNew&&this.data.has(k))return{modified:false};this.data.set(k,structuredClone(v));return{modified:true};}async delete(k){this.data.delete(k);}async list({prefix}){return{blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}}
test('V31 final book saves shared edits, protects contributors and rejects stale revisions',async()=>{
 const handler=createHandler(new Store());const call=async(b,token)=>{const r=await handler(new Request('https://test.example',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(b)}));return {status:r.status,...await r.json()};};
 const created=await call({action:'create',name:'Pasukan',kelas:'3 A',story:'belang',mode:'kumpulan',lesson:true,lessonVersion:29}),code=created.room.code,users=[];
 for(const role of ['pembaca','pencari','pencatat','pemancing'])users.push(await call({action:'join',code,role,name:role,kelas:'3 A'}));
 const input={action:'book-edit',code,page:0,baseRevision:0,title:'Buku Kami',pageTitle:'Pertemuan',text:'Hana menemui anak kucing. Tok Wan membantu Hana.'};
 assert.equal((await call(input,users[1].token)).status,403);
 const saved=await call(input,users[0].token);assert.equal(saved.status,200);assert.equal(saved.bookEdit.pages[0],input.text);assert.equal(saved.bookEdit.pages[1],JoranStory.lessonText('belang',1));
 assert.equal((await call(input,users[0].token)).status,409);
 const next=await call({...input,page:1,baseRevision:1,pageTitle:'Bantuan',text:'Mereka bekerjasama menjaga Belang.'},users[1].token);assert.equal(next.status,200);assert.equal(next.bookEdit.pages[0],input.text);
 const state=await call({action:'state',code},users[2].token);assert.equal(state.bookEdit.revision,2);assert.equal(state.bookEdit.pageTitles[1],'Bantuan');
 assert.equal(JoranStory.lessonText('belang',0).includes('Hana menemui anak kucing. Tok Wan membantu Hana.'),false,'assessment story remains canonical');
});
test('V31 Excel separates group scores, excludes removed records, picks latest takes and stores formulas as text',async()=>{
 const ctx={Blob,TextEncoder,Intl,Date};ctx.window=ctx;runInNewContext(await readFile(new URL('../public/report-template.js',import.meta.url),'utf8'),ctx);runInNewContext(await readFile(new URL('../public/report-export.js',import.meta.url),'utf8'),ctx);
 const shared={role:'pembaca',mode:'kumpulan',sessionId:'test',group:'Kumpulan Ujian',kelas:'3 A',story:'belang',lessonPoints:{total:96,rows:[{label:'Induksi',points:5,max:5}]},lesson:{correct:3,explainedCorrect:2,explanations:[{value:'Kerjasama',text:'=SUM(1,2)',guidedCorrect:true},null],personalRoutes:{a:'pemulihan'},practices:[{subjectId:'a'}]},certificateEligible:true};
 const records=[{...shared,id:'a',name:'A'},{...shared,id:'b',name:'B'},{...shared,id:'c',name:'Padam',archived:true},{...shared,id:'d',name:'Sendiri',role:'kendiri',mode:'kendiri'}],takes=[{memberId:'a',story:'belang',page:0,at:1000,duration:10,name:'A'},{memberId:'a',story:'belang',page:0,at:2000,duration:20,name:'A'},{memberId:'c',story:'belang',page:0,at:3000,name:'Padam'}];
 const rows=ctx.JoranReport31.rows(records,takes,{belang:{title:'Belang'}});assert.equal(rows[0].length,1);assert.equal(rows[1].length,1);assert.equal(rows[2].length,2);assert.equal(rows[5].length,1);assert.equal(rows[5][0][4],20);assert.equal(rows[4][0][4],'=SUM(1,2)');
 const blob=ctx.JoranReport31.workbook(records,takes,{belang:{title:'Belang'}});await writeFile(new URL('../../test-v31-report.xlsx',import.meta.url),Buffer.from(await blob.arrayBuffer()));assert(blob.size>10000);
});
