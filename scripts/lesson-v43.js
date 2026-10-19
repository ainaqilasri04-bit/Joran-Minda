// A value answer is assessed independently of the earlier proof selection.
function showIdentification43(check,item){
 const result=JoranFeedback43.identification(check,item);
 feedback36(result.title,result.parts,go24);
 response28.dataset.valueCorrect43=String(result.valueCorrect);
 response28.dataset.proofCorrect43=String(result.proofCorrect);
 response28.dataset.deduction43=String(result.deduction);
}
// Remove obsolete camera prompts from the teacher's active voice checklist too.
for(const [key,row] of voiceCatalog33)if(JoranFeedback43.retiredCamera(row.text))voiceCatalog33.delete(key);
root.dataset.version='43';
$('#jm-version').textContent='Joran Minda · Versi 43 · Pancing dan belajar';
queue27();
