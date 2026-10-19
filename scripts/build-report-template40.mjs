import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile,FileBlob} from '@oai/artifact-tool';
// Run in a temporary authoring directory using the primary runtime.
const old=await SpreadsheetFile.importXlsx(await FileBlob.load('before.xlsx'));
const before=await old.render({sheetName:'Kumpulan',range:'A1:F7',scale:1.3});await fs.writeFile('before.png',new Uint8Array(await before.arrayBuffer()));
const headers=['Nama murid','Kelas','Cerita','Nilai betul / 3','Objektif 1','Penerangan betul / 2','Objektif 2','Semakan awal / 3','Latihan','Betul','Jumlah soalan','Mata / 100','Sijil','Halaman bacaan','Intonasi','Jeda','Sebutan','TP PBD (guru)','Catatan guru'];
const widths=[24,14,28,17,21,20,21,18,19,12,16,16,20,23,30,30,30,18,35];
const groupHeaders=['Kumpulan',...headers];groupHeaders[5]='Objektif 1 bersama';groupHeaders[7]='Objektif 2 bersama';groupHeaders[12]='Mata bersama / 100';groupHeaders[13]='Sijil kumpulan';
const schema=[['Individu','Pencapaian individu',headers,widths],['Kumpulan','Pencapaian kumpulan dan setiap ahli',groupHeaders,[24,...widths]]];
const wb=Workbook.create();
for(const [name,title,labels,sizes] of schema){
 const sh=wb.worksheets.add(name),end=String.fromCharCode(64+labels.length);sh.showGridLines=false;sh.tabColor=name==='Kumpulan'?'#AD6520':'#235899';
 sh.getRange('A2').values=[[title]];sh.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#163E5C'};
 sh.getRange('A3').values=[[name==='Kumpulan'?'Satu baris bagi setiap ahli. Mata dan objektif kumpulan dikongsi; mata bersama tidak dijumlahkan.':'TP PBD dan catatan diisi oleh guru selepas menyemak hasil pembelajaran.']];sh.getRange('A3').format.font={name:'Arial',size:11,italic:true,color:'#45586D'};
 sh.getRange('A5:'+end+'6').format={font:{name:'Arial',size:11,color:'#19364E'},verticalAlignment:'center',wrapText:true};
 sh.getRange('A5:'+end+'5').values=[labels];sh.getRange('A5:'+end+'5').format={fill:name==='Kumpulan'?'#8C5423':'#235899',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},horizontalAlignment:'center',rowHeight:46};
 sh.getRange('A6:'+end+'6').values=[labels.map(()=>null)];sh.getRange('A6:'+end+'6').format.rowHeight=40;
 sizes.forEach((width,c)=>sh.getRangeByIndexes(4,c,2,1).format.columnWidth=width);
 labels.forEach((h,c)=>{const cell=sh.getRangeByIndexes(5,c,1,1);if(/betul|Betul|Mata|Jumlah|awal/.test(h)){cell.setNumberFormat('0');cell.format.horizontalAlignment='center';}if(/guru/.test(h)){cell.format.fill='#FFF2CC';if(h.startsWith('TP PBD'))cell.dataValidation={rule:{type:'list',values:['1','2','3','4','5','6']}}}});
 sh.freezePanes.freezeRows(5);sh.freezePanes.freezeColumns(name==='Kumpulan'?2:1);
}
wb.recalculate();
console.log((await wb.inspect({kind:'sheet',include:'id,name',maxChars:1000})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:20},maxChars:500})).ndjson);
for(const [name,,labels]of schema){console.log((await wb.inspect({kind:'table',range:name+'!A5:H6',include:'values',tableMaxRows:2,tableMaxCols:8,maxChars:1200})).ndjson);const blob=await wb.render({sheetName:name,range:'A1:'+String.fromCharCode(64+labels.length)+'7',scale:1.1});await fs.writeFile(name+'.png',new Uint8Array(await blob.arrayBuffer()));}
const xlsx=await SpreadsheetFile.exportXlsx(wb);await xlsx.save('report-template40.xlsx');await fs.writeFile('schema.json',JSON.stringify(schema));
