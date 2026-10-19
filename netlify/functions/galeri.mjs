import {getStore} from '@netlify/blobs';
import {createGalleryHandler} from '../../server/gallery-service.mjs';
export default async function handler(req){
 try{return await createGalleryHandler(getStore({name:'joran-minda-gallery-v46-'+(process.env.CONTEXT||'local'),consistency:'strong'}))(req);}
 catch{return new Response(JSON.stringify({error:'Galeri belum tersedia. Terbitkan projek lengkap melalui GitHub ke Netlify dahulu.'}),{status:503,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});}
}
