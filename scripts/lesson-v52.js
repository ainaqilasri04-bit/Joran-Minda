// V57: retain visible book editing; upload confirmation and its PIN are no longer required.
const reviewBar52=document.createElement('div');reviewBar52.id='jm-review-bar52';reviewBar52.hidden=true;$('.jm-location27').append(reviewBar52);
const paintBefore52=paint27;
paint27=function(){if(reviewBar52.childElementCount)reviewBar52.replaceChildren();paintBefore52();const reviewing=active27()&&view==='book'&&!aux27&&['review','book'].includes(closeStage27);
 reviewBar52.hidden=!reviewing;shell27.dataset.review52=String(reviewing);
 if(reviewing){const edit=$('#jm-edit-open31');if(edit&&edit.parentElement!==reviewBar52){reviewBar52.replaceChildren(edit);edit.setAttribute('aria-label','Baiki tajuk dan ayat halaman '+(bookPage+1));}}
 else if(reviewBar52.childElementCount)reviewBar52.replaceChildren();
};
renderSummary33();root.dataset.version='52';$('#jm-version').textContent='Joran Minda · Versi 52 · Semakan buku dan penghantaran';queue27();
