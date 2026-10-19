(function(g){
'use strict';
// Small code-native pictograms: labelled in the UI, never used as a colour-only cue.
const paths={
 eye:'<path d="M8 32Q32 6 56 32Q32 58 8 32Z" fill="#fff"/><circle cx="32" cy="32" r="10" fill="#378caf"/><circle cx="32" cy="32" r="4" fill="#173c42"/>',
 book:'<path d="M32 17Q20 9 8 14V49Q20 44 32 52Q44 44 56 49V14Q44 9 32 17Z" fill="#fff1ba"/><path d="M32 17V52M14 24L25 26M14 32L25 34M39 26L50 24M39 34L50 32" fill="none"/>',
 search:'<circle cx="27" cy="27" r="18" fill="#d7eff4"/><path d="M40 40L55 55" stroke-width="8"/><path d="M19 27L25 33L35 21" fill="none" stroke="#23755e"/>',
 mic:'<rect x="23" y="7" width="18" height="31" rx="9" fill="#f5a26d"/><path d="M15 28V33A17 17 0 0 0 49 33V28M32 50V57M22 57H42" fill="none"/>',
 fish:'<path d="M8 32L2 21V43ZM8 32Q29 7 54 32Q29 57 8 32Z" fill="#ffcd58"/><circle cx="43" cy="29" r="2" fill="#173c42"/><path d="M27 23L22 30L28 36" fill="none"/><path d="M50 7V14Q50 20 55 20Q61 20 61 14" fill="none"/>',
 match:'<rect x="5" y="10" width="19" height="17" rx="4" fill="#ffdb88"/><rect x="40" y="37" width="19" height="17" rx="4" fill="#b8e1dc"/><path d="M24 19H34V46H40" fill="none"/><rect x="5" y="37" width="19" height="17" rx="4" fill="#b8e1dc"/><rect x="40" y="10" width="19" height="17" rx="4" fill="#ffdb88"/>',
 puzzle:'<path d="M8 10H26V18Q38 10 38 20Q38 28 26 23V38H41Q35 50 45 50Q55 50 49 38H57V57H8Z" fill="#ffcf6b"/><path d="M8 34H19M8 42H16"/>',
 pencil:'<path d="M11 43L40 9L53 21L24 55L8 58Z" fill="#ffcb62"/><path d="M40 9L44 5Q47 2 51 5L58 11Q62 15 58 19L53 24Z" fill="#ec8b80"/><path d="M11 43L24 55M8 58L12 47" fill="none"/>',
 heart:'<path d="M32 53L11 33C-4 15 20 2 32 18C44 2 68 15 53 33Z" fill="#f39083"/>',
 star:'<path d="M32 5L40 23L60 25L45 39L49 59L32 49L15 59L19 39L4 25L24 23Z" fill="#ffd768"/>',
 check:'<circle cx="32" cy="32" r="26" fill="#b9e2cd"/><path d="M18 32L28 43L47 21" fill="none" stroke-width="6"/>',
 cat:'<path d="M13 27L10 7L27 19H37L54 7L51 27Q60 54 32 57Q4 54 13 27Z" fill="#f4bb75"/><circle cx="23" cy="33" r="2"/><circle cx="41" cy="33" r="2"/><path d="M29 42L32 45L35 42M8 40L21 43M43 43L56 40" fill="none"/>',
 plant:'<path d="M32 40V17" fill="none"/><path d="M32 30Q9 30 12 10Q33 10 32 30ZM32 23Q51 23 54 5Q31 4 32 23Z" fill="#a6d6a8"/><path d="M15 38H49L44 59H20Z" fill="#eab28b"/>',
 picnic:'<path d="M8 26H56L51 55H13Z" fill="#ecc07e"/><path d="M17 27Q17 1 32 5Q47 1 47 27M7 34H57M25 35V51M39 35V51" fill="none"/><path d="M28 24Q18 14 25 12Q32 9 34 17Q42 11 45 17Q48 25 36 27" fill="#f28c75"/>',
 person:'<circle cx="32" cy="19" r="11" fill="#edbf96"/><path d="M12 57V47Q12 32 32 32Q52 32 52 47V57Z" fill="#a7d9d1"/>'
};
function icon(kind){return '<svg class="jm-icon35" viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="#24545a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">'+(paths[kind]||paths.book)+'</svg>';}
function readStage(state,key,completed=false){const value=state.reads?.[key];return Number.isInteger(value)&&value>=0&&value<=2?value:completed?2:0;}
function diagnosticSymbol(story){return {belang:'cat',pondok:'book',pokok:'plant',sihat:'picnic'}[story]||'book';}
const captions={belang:'Belang dan sahabatnya',pondok:'Pondok bacaan',pokok:'Kebun Tok Wan',sihat:'Bekal dan tempat berkelah'};
const stages=[['eye','Lihat gambar'],['book','Baca cerita'],['mic','Rakam bacaan']];
g.JoranFocus35={icon,readStage,diagnosticSymbol,captions,stages,version:35};
})(globalThis);
