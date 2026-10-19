(function(g){
'use strict';
const texts={instruction:'Semak tajuk dan nama paparan. Kemudian, tekan Muat naik buku. Guru akan menyemak buku sebelum dikongsikan.',sent:'Buku kamu berjaya dihantar. Tunggu semakan Guru sebelum buku dipaparkan dalam galeri.',noGallery:'Minta pautan permainan daripada Guru untuk menghantar buku ke galeri.'};
const validId=x=>typeof x==='string'&&/^[a-f0-9]{32}$/.test(x);
const validKey=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const link=(file,params)=>{const u=new URL(file,g.location.href);u.search='';u.hash='';for(const [k,v]of Object.entries(params))u.searchParams.set(k,v);return u.href;};
async function api(body,key){
 if(g.JoranStandalone35||!/^https?:$/.test(g.location.protocol))throw Error('Muat naik tersedia selepas projek diterbitkan ke Netlify. Pratonton ini menyimpan hasil pada peranti sahaja.');
 const r=await fetch('.netlify/functions/galeri',{method:'POST',headers:{'Content-Type':'application/json',...(key?{Authorization:'Bearer '+key}:{})},body:JSON.stringify(body)});
 let data;try{data=await r.json();}catch{throw Error('Perkhidmatan galeri belum tersedia. Terbitkan keseluruhan projek ke Netlify.');}
 if(!r.ok)throw Error(data.error||'Permintaan belum berjaya.');return data;
}
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}};
const save=(key,value)=>{localStorage.setItem(key,JSON.stringify(value));};
let selected=load('jm-gallery-pupil46',null);
const params=new URLSearchParams(g.location.search),gallery=params.get('galeri'),uploadKey=params.get('hantar');
if(validId(gallery)&&validKey(uploadKey)){selected={id:gallery,uploadKey};save('jm-gallery-pupil46',selected);}
g.JoranGallery46={texts,api,validId,validKey,load,save,link,
 get selected(){return selected;},set selected(v){selected=v;save('jm-gallery-pupil46',v);},
 parentURL:gallery=>link('galeri.html',{galeri:gallery}),
 pupilURL:config=>link('index.html',{galeri:config.id,hantar:config.uploadKey}),
 randomId:()=>{const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
};
g.JoranRequiredAudio41=[...new Set([...(g.JoranRequiredAudio41||[]),texts.instruction])];
})(window);
