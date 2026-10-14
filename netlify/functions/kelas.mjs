import { getStore } from '@netlify/blobs';
import { createHandler } from '../../server/room-service.mjs';
export default async function handler(req){
 try{
  const context=process.env.CONTEXT==='production'?'production':(process.env.CONTEXT||'local');
  const store=getStore({name:'joran-minda-v7-'+context,consistency:'strong'});
  return await createHandler(store)(req);
 }catch{
  return new Response(JSON.stringify({error:'Perkhidmatan bilik belum tersedia pada laman ini. Guru perlu menyemak penerbitan fungsi bilik di Netlify.',code:'ROOM_SERVICE_UNAVAILABLE'}),{status:503,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
 }
}
