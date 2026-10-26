// All editorial images share the same responsive source contract.
const rows=require('./generated-image-sources.json');
const photo=(id,alt,extra='',prefix='')=>enhance(`<img draggable="false" src="${prefix}assets/generated/${id}-1600.webp" alt="${alt}" ${extra}>`);
function enhance(html){return html.replace(/<img\b[^>]*src="((?:\.\.\/)?assets\/generated\/([\w-]+)-1600\.webp)"[^>]*>/g,(tag,src,id,offset)=>{
 const row=rows.find(r=>r.id===id);if(!row)return tag;const prefix=src.startsWith('../')?'../':'';
 tag=tag.replace(/\s(?:srcset|sizes|width|height)="[^"]*"/g,'');
 const largest=row.variants.at(-1),height=Math.round(row.originalSize[1]*largest.width/row.originalSize[0]);
 const context=html.slice(Math.max(0,offset-180),offset);
 const sizes=context.includes('journal-card-photo')?'(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw':context.includes('catalog-hero-art')||context.includes('uniq-hero-media')?'(max-width:700px) 100vw, 50vw':'100vw';
 return tag.replace(/>$/,` srcset="${row.variants.map(v=>prefix+v.path+' '+v.width+'w').join(', ')}" sizes="${sizes}" width="${largest.width}" height="${height}">`);
});}
module.exports={photo,enhance};
