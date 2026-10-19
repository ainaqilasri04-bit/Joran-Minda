// V45: restore original image quality; replace mismatches only.
for(const [key,sources]of Object.entries(JoranImages45.pageSources))sources.forEach((src,p)=>{
 assets[key+'-'+(p+1)]=window.JoranPreviewResources?.[src]||src;
});
const pictureBefore45=picture38;
picture38=function(id){const original=I44.images[id]?.originalId45;return original?pictureBefore44(original).replace('data-picture38="'+original+'"','data-picture38="'+safe(id)+'"'):pictureBefore45(id);};
root.dataset.version='45';$('#jm-version').textContent='Joran Minda · Versi 45 · Ilustrasi asal dan pembetulan terpilih';queue27();
