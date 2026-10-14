(function(g){
'use strict';
// One request chain at a time. A save arriving during the first read asks for
// one fresh read afterwards; timer ticks cannot create an unbounded queue.
g.JoranRoomSync={coalesce(work){
 let active=null,again=false,pass=0;
 return function(){
  if(active){if(pass===0)again=true;return active;}
  again=false;pass=0;
  active=Promise.resolve().then(work).then(async()=>{if(again){pass=1;await work();}}).finally(()=>{active=null;again=false;});
  return active;
 };
}};
})(globalThis);
