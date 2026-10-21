const marks=[
 {id:'loro-piana',name:'Loro Piana',src:'assets/mark-loro-piana.png'},
 {id:'chanel',name:'Chanel',src:'assets/mark-chanel.svg'},
 {id:'gucci',name:'Gucci',src:'assets/mark-gucci.svg'},
 {id:'dior',name:'Dior',src:'assets/mark-dior.svg'},
 {id:'yeezy',name:'Yeezy',src:'assets/case-IMG_9499.png',size:1280,box:'790 235 410 150'},
 {id:'santoni',name:'Santoni',src:'assets/case-IMG-8571.png',size:1280,box:'820 240 350 95'},
 {id:'prada',name:'Prada',src:'assets/case-IMG-2449.jpg',size:1440,box:'800 240 560 140'},
 {id:'louis-vuitton',name:'Louis Vuitton',src:'assets/case-IMG-1808.jpg',size:2400,box:'1580 360 520 570'},
 {id:'brunello-cucinelli',name:'Brunello Cucinelli',src:'assets/case-IMG_7376.png',size:1280,box:'790 105 420 390'},
 {id:'ugg',name:'UGG',src:'assets/case-274342370_6624108282.jpg',size:1440,box:'725 170 625 310'}
];
function mark(m,prefix){
 if(!m.box)return `<img draggable="false" src="${m.src}" alt="${m.name}" loading="lazy" width="180" height="70">`;
 const id=prefix+'-'+m.id;
 const [x,y,width,height]=m.box.split(' ');
 // Display the original logo already present in the workshop's case image.
 // The SVG viewport isolates it; the source photo is never modified.
 return `<svg viewBox="${m.box}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${m.name}" focusable="false"><defs><clipPath id="${id}-crop"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath><filter id="${id}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -.333 -.333 -.333 0 1"/><feComponentTransfer><feFuncA type="linear" slope="1.5" intercept="-.12"/></feComponentTransfer></filter></defs><g clip-path="url(#${id}-crop)"><image href="${m.src}" width="${m.size}" height="${m.size}" filter="url(#${id})"/></g></svg>`;
}
const gallery=()=>`<section class="maker-brands section" aria-labelledby="maker-brands-title"><div><p class="menu-label">Бренды из портфолио мастерской</p><h2 id="maker-brands-title">Внимание к каждому бренду.</h2></div><div class="maker-logo-grid">${marks.map(m=>`<a href="brand.html?brand=${encodeURIComponent(m.name)}" aria-label="Примеры работ: ${m.name}">${mark(m,'grid')}</a>`).join('')}</div><a class="text-link" href="brand.html">Все бренды и примеры работ ↗</a></section>`;
const marquee=prefix=>marks.map(m=>'<span>'+mark(m,prefix)+'</span>').join('');
module.exports={marks,gallery,marquee};
