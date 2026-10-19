import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const schema=[
 ['Individu','Pencapaian individu',['Nama murid','Kelas','Cerita','Nilai betul / 3','Objektif 1','Penerangan betul / 2','Objektif 2','Semakan awal / 3','Latihan','Betul','Jumlah soalan','Mata / 100','Sijil','Halaman bacaan','Intonasi','Jeda','Sebutan','TP PBD (guru)','Catatan guru'],[24,16,28,17,23,20,23,18,19,12,16,15,18,23,32,32,32,18,35]],
 ['Kumpulan','Pencapaian bersama kumpulan',['Kumpulan','Kelas','Cerita','Nama ahli','Nilai betul / 3','Objektif 1 bersama','Penerangan betul / 2','Objektif 2 bersama','Mata bersama / 100','Sijil kumpulan','Catatan guru'],[25,16,28,36,18,25,21,25,22,22,35]],
 ['Ahli Kumpulan','Bukti pembelajaran setiap ahli',['Kumpulan','Nama murid','Kelas','Cerita','Semakan awal / 3','Latihan','Betul','Jumlah soalan','Halaman bacaan','Intonasi','Jeda','Sebutan','TP PBD (guru)','Catatan guru'],[25,24,16,28,18,19,12,16,23,32,32,32,18,35]]
];
const wb=Workbook.create();
for(const [name,title,headers,widths]of schema){
 const sh=wb.worksheets.add(name),end=String.fromCharCode(64+headers.length);sh.showGridLines=false;sh.tabColor=name==='Kumpulan'?'#AD6520':'#235899';
 sh.getRange('A2').values=[[title]];sh.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#163E5C'};
 sh.getRange('A3').values=[[name==='Kumpulan'?'Mata dan objektif ini dikongsi oleh kumpulan. Nilai PBD setiap murid menggunakan helaian Ahli Kumpulan.':'TP PBD dan catatan ialah ruangan guru. Mata permainan tidak ditukar secara automatik kepada TP.']];sh.getRange('A3').format.font={name:'Arial',size:11,italic:true,color:'#45586D'};
 sh.getRange('A5:'+end+'6').format={font:{name:'Arial',size:11,color:'#19364E'},verticalAlignment:'center',wrapText:true};
 sh.getRange('A5:'+end+'5').values=[headers];sh.getRange('A5:'+end+'5').format={fill:'#235899',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},horizontalAlignment:'center',rowHeight:44};
 sh.getRange('A6:'+end+'6').values=[headers.map(()=>null)];sh.getRange('A6:'+end+'6').format.rowHeight=38;
 widths.forEach((width,c)=>sh.getRangeByIndexes(4,c,2,1).format.columnWidth=width);
 headers.forEach((h,c)=>{const range=sh.getRangeByIndexes(5,c,1,1);if(/betul|Betul|Mata|Jumlah|awal/.test(h))range.setNumberFormat('0');if(/guru/.test(h)){range.format.fill='#FFF2CC';if(h.startsWith('TP PBD'))range.dataValidation={rule:{type:'list',values:['1','2','3','4','5','6']}}}});
 sh.freezePanes.freezeRows(5);sh.freezePanes.freezeColumns(2);
}
wb.recalculate();
console.log((await wb.inspect({kind:'sheet',include:'id,name',maxChars:1500})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:20},maxChars:1000})).ndjson);
for(const [name,,headers]of schema){console.log((await wb.inspect({kind:'table',range:name+'!A5:F6',include:'values,formulas',tableMaxRows:2,tableMaxCols:6,maxChars:1000})).ndjson);const blob=await wb.render({sheetName:name,range:'A1:'+String.fromCharCode(64+headers.length)+'7',scale:1.3});await fs.writeFile(name.replaceAll(' ','-')+'.png',new Uint8Array(await blob.arrayBuffer()));}
const xlsx=await SpreadsheetFile.exportXlsx(wb);await xlsx.save('report-template39.xlsx');await fs.writeFile('schema.json',JSON.stringify(schema));
