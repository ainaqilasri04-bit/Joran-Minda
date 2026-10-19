import {randomBytes,createHash} from 'node:crypto';
const digest=s=>createHash('sha256').update(s).digest('hex');
const token=()=>randomBytes(32).toString('hex');
const id=()=>randomBytes(16).toString('hex');
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const text=(v,max,label)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail(400,label+' tidak lengkap atau terlalu panjang.');return v.trim();};
const idOK=x=>typeof x==='string'&&/^[a-f0-9]{32}$/.test(x);
const publicInfo=g=>({id:g.id,title:g.title,linktree:g.linktree||''});
const publicBook=b=>({id:b.id,title:b.title,displayName:b.displayName,mode:b.mode,story:b.story,pages:b.pages,pageTitles:b.pageTitles,created:b.created,updated:b.updated,status:b.status});
function linktree(value){if(!value)return '';try{const u=new URL(value);if(u.protocol==='https:'&&u.hostname==='linktr.ee'&&u.pathname!=='/'&&!u.username&&!u.password)return u.href;}catch{}fail(400,'Gunakan pautan https://linktr.ee/nama anda.');}
export function createGalleryHandler(store,{now=()=>Date.now()}={}){
 const get=k=>store.get(k,{type:'json'});
 const all=async (gallery,collection='books')=>{const {blobs}=await store.list({prefix:collection+'/'+gallery+'/'});return (await Promise.all(blobs.map(b=>get(b.key)))).filter(Boolean).sort((a,b)=>b.updated-a.updated);};
 return async req=>{try{
  if(req.method!=='POST')fail(405,'Gunakan POST.');
  const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)fail(403,'Permintaan tidak dibenarkan.');
  const raw=await req.text();if(raw.length>15000)fail(413,'Buku terlalu besar.');
  let b;try{b=JSON.parse(raw);}catch{fail(400,'Maklumat tidak sah.');}if(!b||typeof b!=='object'||Array.isArray(b))fail(400,'Maklumat tidak sah.');
  if(b.action==='create'){
   const adminKey=token(),uploadKey=token(),gallery={id:id(),title:text(b.title,80,'Nama galeri'),linktree:linktree(b.linktree),adminHash:digest(adminKey),uploadHash:digest(uploadKey),created:now()};
   await store.setJSON('galleries/'+gallery.id,gallery,{onlyIfNew:true});
   return json({gallery:publicInfo(gallery),adminKey,uploadKey},201);
  }
  if(!idOK(b.gallery))fail(400,'Pautan galeri tidak sah.');
  const g=await get('galleries/'+b.gallery);if(!g)fail(404,'Galeri tidak ditemui. Minta pautan daripada Guru.');
  const key=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
  const admin=/^[a-f0-9]{64}$/.test(key)&&digest(key)===g.adminHash;
  const upload=/^[a-f0-9]{64}$/.test(key)&&digest(key)===g.uploadHash;
  if(b.action==='list')return json({gallery:publicInfo(g),books:(await all(g.id,'published')).map(publicBook)});
  if(b.action==='info')return json({gallery:publicInfo(g),canUpload:upload||admin});
  if(b.action==='submit'){
   if(!upload&&!admin)fail(403,'Buka pautan murid yang diberikan oleh Guru untuk menghantar buku.');
   if(!idOK(b.submission))fail(400,'Kod penghantaran tidak sah.');
   if(!['belang','pondok','pokok','sihat'].includes(b.story)||!['individu','kumpulan'].includes(b.mode))fail(400,'Cerita atau mod tidak sah.');
   if(!Array.isArray(b.pages)||b.pages.length!==5||!Array.isArray(b.pageTitles)||b.pageTitles.length!==5)fail(400,'Lengkapkan kelima-lima halaman buku.');
   const path='books/'+g.id+'/'+b.submission,previous=await get(path);
   if(!previous&&(await all(g.id)).length>=150)fail(409,'Galeri penuh. Guru boleh mencipta galeri baharu.');
   const book={id:b.submission,title:text(b.title,70,'Tajuk buku'),displayName:text(b.displayName,80,'Nama paparan'),mode:b.mode,story:b.story,pages:b.pages.map(p=>text(p,600,'Ayat halaman')),pageTitles:b.pageTitles.map(t=>text(t,70,'Tajuk halaman')),created:previous?.created||now(),updated:now(),status:'pending',revision:(previous?.revision||0)+1};
   await store.setJSON(path,book);await store.delete('published/'+g.id+'/'+book.id);return json({ok:true,id:book.id,status:book.status,revision:book.revision},previous?200:201);
  }
  if(!admin)fail(403,'Hanya pemilik galeri boleh menyemak atau memadam buku.');
  if(b.action==='review'){const approved=new Map((await all(g.id,'published')).map(x=>[x.id,x.revision]));return json({gallery:publicInfo(g),books:(await all(g.id)).map(x=>({...publicBook(x),status:approved.get(x.id)===x.revision?'published':'pending',revision:x.revision}))});}
  if(b.action==='settings'){g.title=text(b.title,80,'Nama galeri');g.linktree=linktree(b.linktree);await store.setJSON('galleries/'+g.id,g);return json({gallery:publicInfo(g)});}
  if(!idOK(b.book))fail(400,'Buku tidak sah.');const path='books/'+g.id+'/'+b.book,book=await get(path);if(!book)fail(404,'Buku tidak ditemui.');
  if(b.action==='publish'||b.action==='unpublish'){
   if(b.revision!==book.revision)fail(409,'Buku telah dikemas kini. Muat semula dan semak versi terbaharu.');
   const pub='published/'+g.id+'/'+book.id;
   if(b.action==='publish')await store.setJSON(pub,{...book,status:'published'});else await store.delete(pub);
   return json({ok:true,status:b.action==='publish'?'published':'pending'});
  }
  if(b.action==='delete'){await store.delete('published/'+g.id+'/'+book.id);await store.delete(path);return json({ok:true});}
  fail(400,'Tindakan tidak dikenali.');
 }catch(e){return json({error:e.status?e.message:'Galeri belum dapat diakses. Sila cuba lagi.'},e.status||500);}};
}
