// One audited source of pictures for reading, recording, replay, choices and completed book.
const I44=JoranImages44;
for(const [key,ids]of Object.entries(I44.pages))ids.forEach((id,p)=>{const src=I44.images[id].src;assets[key+'-'+(p+1)]=window.JoranPreviewResources?.[src]||src;});
const pictureBefore44=picture38;
picture38=function(id){const item=I44.images[id];return item?.v44?'<span class="jm-picture38 jm-picture44" data-picture38="'+safe(id)+'"><img src="'+safe(item.src)+'" alt="'+safe(item.alt)+'" draggable="false"></span>':pictureBefore44(id);};
choiceImage39=text=>I44.lookup(storyKey,text);
// Do not silently attach an unrelated page picture to unknown/new free text.
decorateChoice39=function(el){
 const copy=el.cloneNode(true);copy.querySelectorAll('.jm-choice-image39,.jm-picture38,.jm-audio-pair37,input').forEach(n=>n.remove());
 for(const b of copy.querySelectorAll('b'))if(/^\s*[1-9A-C][.)]?\s*$/.test(b.textContent))b.remove();
 const id=choiceImage39(copy.textContent),old=el.querySelector(':scope > .jm-choice-image39');
 if(!id){old?.remove();return;}
 if(old?.dataset.image44===id)return;
 const span=document.createElement('span');span.className='jm-choice-image39';span.dataset.image44=id;span.innerHTML=picture38(id);if(old)old.replaceWith(span);else el.prepend(span);
};
// Separate artist attribution is in the source package; child-facing copy stays concise.
root.dataset.version='44';$('#jm-version').textContent='Joran Minda · Versi 44 · Gambar sepadan dengan cerita';queue27();
