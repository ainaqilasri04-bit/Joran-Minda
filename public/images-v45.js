(function(g){
'use strict';
const I=g.JoranImages44;
// Reading/recording/replay/book pages share the full original landscape assets.
// Answer cards retain their exact semantic mappings; a page overview is not
// automatically substituted for a specific action such as sharing paper.
const pageSources={};
for(const [story,ids]of Object.entries(I.pages)){
 pageSources[story]=ids.map((_,i)=>'assets/'+story+'-'+(i+1)+'.webp');
}
const corrected=['b1','b2','p2','k3','k4','s3','s5','p6','pWipe','pRepair'];
for(const id of corrected){I.images[id]={...I.images[id],src:'assets/v45/'+id+'.webp',v44:true};}
// Reuse matching high-resolution originals without regenerating them.
for(const [id,file,alt]of [
 ['b3','belang-3','Hana menenangkan Belang dan Iman menyediakan air bersih.'],
 ['b5','belang-5','Belang yang sihat bermain bersama Hana dan Iman.'],
 ['p5','pondok-5','Hana, Iman dan Tok Wan membaca bersama-sama.'],
 ['k1','pokok-1','Hana dan Iman melihat anak pokok yang layu bersama Tok Wan.'],
 ['k2','pokok-2','Hana dan Iman membantu Tok Wan menyiram anak pokok.'],
 ['s1','sihat-1','Hana, Iman dan Tok Wan menyediakan bekal untuk berkelah.'],
 ['s2','sihat-2','Hana dan Iman membasuh tangan dengan sabun.'],
 ['s4','sihat-4','Hana dan Iman mengumpulkan sampah selepas berkelah.']
 ])I.images[id]={...I.images[id],src:'assets/'+file+'.webp',alt,v44:true};
// This original paper-sharing card already matched the answer; preserve it.
I.images.p3={...g.JoranPractice38.images.books2,src:'assets/actions-books-v38.png',originalId45:'books2'};
g.JoranImages45={version:45,pageSources,corrected};
})(globalThis);
