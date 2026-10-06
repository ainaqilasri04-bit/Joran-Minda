import '../public/story-engine.js';
export const roleOrder=['pembaca','pencari','pencatat','pemancing'];
export function groupState(actions=[]){
 const ordered=actions.slice().sort((a,b)=>a.sequence-b.sequence),choices=[],notes=[];let sequence=0,bonusNotes='';
 for(const a of ordered){if(a.sequence!==sequence)break;if(a.kind==='choice')choices.push(a.choice);if(a.kind==='note')notes[a.page]=a.text;if(a.kind==='bonus-note')bonusNotes=a.text;sequence++;}
 return{sequence,page:Math.min(4,Math.floor(sequence/4)),step:sequence<20?sequence%4:sequence<22?4:5,choices,notes,bonusNotes,finished:sequence>=22,bonusReady:sequence===21,role:sequence<20?roleOrder[sequence%4]:sequence===20?'pencatat':sequence===21?'pemancing':'semua'};
}
export function validateAction(story,state,body){
 const expected=state.sequence<20?['read','evidence','note','choice'][state.step]:state.sequence===20?'bonus-note':'bonus';
 if(body.kind!==expected||body.sequence!==state.sequence)return{error:'Giliran telah berubah. Semak paparan terkini.',status:409};
 const event={kind:expected,sequence:state.sequence,page:state.page};
 if(expected==='evidence'||expected==='choice'||expected==='bonus'){
  const max=2;if(!Number.isInteger(body.choice)||body.choice<0||body.choice>max)return{error:'Pilihan tidak sah.',status:400};
  event.choice=body.choice;
  event.correct=expected==='choice'?null:body.choice===(expected==='bonus'?0:globalThis.JoranStory.make(story,state.page,state.choices).evidence);
 }
 if(expected==='note'||expected==='bonus-note'){event.text=typeof body.text==='string'?body.text.trim().slice(0,600):'';if(!event.text)return{error:'Catat satu sebab pilihan kumpulan dahulu.',status:400};}
 return{event,advance:event.correct!==false};
}
