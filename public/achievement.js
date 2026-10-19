(function(global){
 'use strict';
 const PAGE_COUNT=5;
 const validPage=p=>Number.isInteger(p)&&p>=0&&p<PAGE_COUNT;
 const order=e=>(e||[]).slice().sort((a,b)=>(a.at||0)-(b.at||0)||((a.sequence??999)-(b.sequence??999)));
 function normalize(e){return {...e,type:e.type||(e.kind==='evidence'?'page-evidence':e.kind==='choice'?'story-choice':e.kind==='bonus-note'?'note':e.kind),round:e.round||(e.kind==='bonus-note'?'bonus':'main')};}
 function assess(events=[],personal=[]){
  const core=order(events.map(normalize)),own=order(personal.map(normalize));
  const pages=type=>new Set(core.filter(e=>e.type===type&&(e.correct!==false||e.version>=28&&e.resolved===true)&&validPage(e.page)).map(e=>e.page));
  const read=pages('read'),proof=new Set(core.filter(e=>e.type==='page-evidence'&&(e.correct||e.version>=28&&e.resolved===true)&&validPage(e.page)).map(e=>e.page));
  const written=new Set(core.filter(e=>e.type==='note'&&e.round!=='bonus'&&validPage(e.page)&&String(e.text||'').trim()).map(e=>e.page));
  const choices=pages('story-choice'),bonusNote=core.some(e=>e.type==='note'&&e.round==='bonus'&&String(e.text||'').trim()),bonus=core.some(e=>e.type==='bonus'&&(e.correct||e.version>=28&&e.resolved===true));
  const review=new Set(own.filter(e=>e.type==='review-page'&&validPage(e.page)).map(e=>e.page)),reflection=own.filter(e=>e.type==='reflection'&&String(e.text||'').trim()).at(-1)?.text||'';
  const tasks=[
   {id:'read',label:'Baca cerita',done:read.size,total:5,points:read.size*2,max:10},
   {id:'proof',label:'Cari bukti tepat',done:proof.size,total:5,points:proof.size*5,max:25},
   {id:'written',label:'Simpan jawapan',done:written.size,total:5,points:written.size*5,max:25},
   {id:'choices',label:'Pancing jawapan',done:choices.size,total:5,points:choices.size*2,max:10},
   {id:'proverb',label:'Catat dan pancing maksud peribahasa',done:Number(bonusNote)+Number(bonus),total:2,points:(bonusNote?5:0)+(bonus?5:0),max:10},
   {id:'review',label:'Semak buku sendiri',done:review.size,total:5,points:review.size*2,max:10},
   {id:'reflection',label:'Hantar refleksi sendiri',done:reflection?1:0,total:1,points:reflection?10:0,max:10}
  ];
  const coreComplete=tasks.slice(0,5).every(t=>t.done===t.total),complete=tasks.every(t=>t.done===t.total);
  let firstCorrect=0,answered=0,attempts=0;
  for(let p=0;p<6;p++){
   const trials=core.filter(e=>p===5?e.type==='bonus':e.type==='page-evidence'&&e.page===p);
   const success=trials.findIndex(e=>e.correct);
   attempts+=success<0?trials.length:success+1;
   if(success>=0){answered++;if(trials[0].correct)firstCorrect++;}
  }
  const errorKeys=new Set(core.filter(e=>e.version>=28&&e.resolved&&e.correct===false).map(e=>e.type+':'+(e.type==='bonus'?'bonus':e.page)));
  return {errors:errorKeys.size,tasks,points:tasks.reduce((sum,t)=>sum+t.points,0),corePoints:tasks.slice(0,5).reduce((sum,t)=>sum+t.points,0),max:100,coreComplete,complete,firstCorrect,answered,attempts,reviewPages:[...review],reflection,
   level:!coreComplete?'Sedang belajar':firstCorrect===6?'Tepat pada cubaan pertama':firstCorrect>=3?'Semakin mahir':'Berjaya dengan latihan',
   pending:tasks.filter(t=>t.done<t.total).map(t=>`${t.label}: ${t.done}/${t.total}`)};
 }
 function reportMember(member,events,members,mode){
  const all=events.map(normalize),own=all.filter(e=>e.memberId===member.id),common=mode==='kendiri'?own:all;
  const achievement=assess(common,own),contribution=assess(own,own);
  const groupComplete=mode==='kendiri'?achievement.complete:members.length===4&&members.every(m=>assess(all,all.filter(e=>e.memberId===m.id)).complete);
  return {achievement,contribution,certificateEligible:achievement.complete&&groupComplete};
 }
 global.JoranAchievement={assess,reportMember,normalize,version:23};
})(globalThis);
