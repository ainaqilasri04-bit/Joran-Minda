import { getStore } from '@netlify/blobs';
import { createHandler } from '../../server/room-service.mjs';
export default async function handler(req){
 const context=process.env.CONTEXT==='production'?'production':(process.env.CONTEXT||'local');
 const store=getStore({name:'joran-minda-v7-'+context,consistency:'strong'});
 return createHandler(store)(req);
}
