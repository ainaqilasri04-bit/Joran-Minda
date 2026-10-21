import {getStore} from '@netlify/blobs';
import {createDeviceHandler} from '../../server/device-service.mjs';
export default async function handler(req){
 try{
  const context=process.env.CONTEXT==='production'?'production':(process.env.CONTEXT||'local');
  return await createDeviceHandler(getStore({name:'joran-minda-v7-'+context,consistency:'strong'}))(req);
 }catch{return new Response(JSON.stringify({error:'Perkhidmatan rekod satu peranti belum tersedia. Lengkapkan penerbitan V59.'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
}
