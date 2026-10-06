import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
// File-backed local adapter for development; production uses Netlify Blobs.
export class LocalStore{
 constructor(directory){this.directory=directory;this.locks=new Map();}
 file(key){return join(this.directory,Buffer.from(key).toString('base64url')+'.json');}
 async get(key){try{return JSON.parse(await readFile(this.file(key),'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}}
 async setJSON(key,value,options={}){await mkdir(this.directory,{recursive:true});try{await writeFile(this.file(key),JSON.stringify(value),{flag:options.onlyIfNew?'wx':'w'});return{modified:true};}catch(e){if(e.code==='EEXIST')return{modified:false};throw e;}}
 async list({prefix=''}){let names;try{names=await readdir(this.directory);}catch(e){if(e.code==='ENOENT')return{blobs:[]};throw e;}return{blobs:names.filter(n=>n.endsWith('.json')).map(n=>({key:Buffer.from(n.slice(0,-5),'base64url').toString()})).filter(b=>b.key.startsWith(prefix))};}
}
