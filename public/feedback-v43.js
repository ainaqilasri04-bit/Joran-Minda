(function(g){
 const texts={
  valueRight:'Nilai murni yang kamu pilih tepat.',
  valueWrong:'Nilai murni yang kamu pilih belum tepat.',
  bothRight:'Ayat bukti kamu juga tepat.',
  proofWrong:'Ayat bukti pada langkah Cari belum tepat. Dua mata ditolak untuk ayat bukti sahaja.',
  onlyValueWrong:'Ayat bukti kamu tepat. Dua mata ditolak untuk pilihan nilai sahaja.',
  bothWrong:'Ayat bukti dan pilihan nilai belum tepat. Empat mata ditolak.'
 };
 function identification(check,item){
  const valueCorrect=check.answer===item.answer,proofCorrect=check.evidenceCorrect===true;
  return {valueCorrect,proofCorrect,deduction:(Number(!valueCorrect)+Number(!proofCorrect))*2,
   title:valueCorrect?'Tahniah! Nilai tepat.':'Jawapan belum tepat.',
   parts:[valueCorrect?texts.valueRight:texts.valueWrong,item.value+': '+item.action,
    valueCorrect?(proofCorrect?texts.bothRight:texts.proofWrong):(proofCorrect?texts.onlyValueWrong:texts.bothWrong)]};
 }
 const retiredCamera=text=>/kamera|mod tangan|jari telunjuk|ibu jari|pengesan tangan|tangan kelihatan|angkat tangan|gerakan tangan|tunjukkan seluruh tangan/i.test(text);
 g.JoranFeedback43={texts,identification,retiredCamera};
})(globalThis);
