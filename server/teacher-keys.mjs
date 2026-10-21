import {createHash,randomBytes,randomInt,timingSafeEqual} from 'node:crypto';
const digest=s=>createHash('sha256').update(s).digest('hex');
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const makeKey=()=>Array.from({length:4},()=>String.fromCharCode(65+randomInt(26))).join('');

// The short key is generated per class and never placed in public room data.
// Claiming attempt slots atomically bounds guesses across concurrent requests.
export async function issueTeacherKey63(store,room,{makeTeacherKey=makeKey}={}){
 for(let attempt=0;attempt<40;attempt++){
  const key=makeTeacherKey();
  if(!/^[A-Z]{4}$/.test(key)||key==='GURU')continue;
  const keyHash=digest(key),claim=await store.setJSON('teacher-key-claims63/'+keyHash,{code:room.code},{onlyIfNew:true});
  if(!claim.modified)continue;
  try{await store.setJSON('teacher-keys63/'+room.code,{digest:digest(room.code+':'+key),version:63});}
  catch(e){await store.delete('teacher-key-claims63/'+keyHash).catch(()=>{});throw e;}
  return key;
 }
 fail(503,'Kata kunci belum dapat dijana. Cuba sekali lagi.');
}

export async function unlockTeacher63(store,body,{now=()=>Date.now()}={}){
 const code=typeof body.code==='string'?body.code.replace(/[\s-]/g,'').toUpperCase():'';
 const key=typeof body.key==='string'?body.key.trim().toUpperCase():'';
 if(!/^(?:\d{6}|[A-F0-9]{10})$/.test(code)||!/^[A-Z]{4}$/.test(key))fail(400,'Masukkan kod kelas dan kata kunci empat huruf.');
 const room=await store.get('rooms/'+code,{type:'json'});
 if(!room||room.expires<now())fail(403,'Kod kelas atau kata kunci tidak tepat, atau kelas telah tamat.');
 const windowMs=15*60*1000,bucket=Math.floor(now()/windowMs);
 let claimed=false;
 for(let slot=0;slot<5;slot++){
  const r=await store.setJSON(`teacher-attempt63/${code}/${bucket}/${slot}`,{at:now()},{onlyIfNew:true});
  if(r.modified){claimed=true;break;}
 }
 if(!claimed){const minutes=Math.max(1,Math.ceil(((bucket+1)*windowMs-now())/60000));fail(429,'Terlalu banyak cubaan. Cuba semula dalam '+minutes+' minit, atau buka kelas yang disimpan pada peranti Guru.');}
 const stored=await store.get('teacher-keys63/'+code,{type:'json'});
 const actual=digest(code+':'+key),expected=stored?.digest;
 if(!expected||!timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(actual,'hex')))fail(403,'Kod kelas atau kata kunci tidak tepat. Semak empat huruf yang diberikan kepada Guru.');
 const token=randomBytes(32).toString('hex');
 await store.setJSON('auth/'+digest(token),{kind:'teacher',code});
 return {room,teacherToken:token};
}
