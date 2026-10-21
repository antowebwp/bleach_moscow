const fs=require('node:fs'),path=require('node:path');
const {gallery,marquee}=require('./brand-marks.cjs');
const root=__dirname,read=n=>fs.readFileSync(path.join(root,n),'utf8'),write=(n,s)=>fs.writeFileSync(path.join(root,n),s);
const original=read('catalog-layout-template.html');
// Restore the established image + disclosure layout, with four directions.
const specs=[['direction-1','shoes','Обувь'],['direction-3','bags','Сумки'],['direction-4','loro','Сервис Loro Piana'],['direction-5','clothes','Химчистка одежды']];
const chapters=specs.map(([old,id,title],i)=>{
 let section=original.match(new RegExp('<section id="'+old+'"[\\s\\S]*?<\\/section>'))[0];
 if(id==='shoes'){
  const restoration=original.match(/<section id="direction-2"[\s\S]*?<\/section>/)[0];
  const names=new Set([...section.matchAll(/data-title="([^"]+)"/g)].map(m=>m[1]));
  const extra=[...restoration.matchAll(/<details class="catalog-item"[\s\S]*?<\/details>/g)].map(m=>m[0]).filter(item=>!names.has(item.match(/data-title="([^"]+)"/)[1]));
  section=section.replace('</div><button class="direction-info',extra.join('')+'</div><button class="direction-info');
  let count=0;section=section.replace(/<span class="work-number">\d+<\/span>/g,()=>'<span class="work-number">'+String(++count).padStart(2,'0')+'</span>');
  section=section.replace(/data-photo-count>01 \/ \d+/, 'data-photo-count>01 / '+String(count).padStart(2,'0'));
  section=section.replaceAll('name="direction-2-works"','name="direction-1-works"');
 }
 section=section.replace(new RegExp('(<h2 id="'+old+'-title">)[^<]+'), '$1'+title).replace(/class="chapter-number">\d+ \/ 07/,'class="chapter-number">0'+(i+1)+' / 04');
 section=section.replaceAll(old,id);
 if(id==='loro')section=section.replace(/href="https:\/\/bleach.moscow\/[Ll]oro_[Pp]iana\/"/g,'href="loropiana.html"');
 if(id==='clothes'){
  const items=JSON.parse(read('clothing-services.json'));
  section=section.replace('href="https://bleach.moscow/himchistka/"','href="himchistka_s_besplatnoy_dostavkoy.html"');
  section=section.replace(/<figure class="chapter-photo">[\s\S]*?<\/figure>/,`<figure class="chapter-photo"><img draggable="false" src="${items[0].image}" alt="${items[0].alt}" loading="lazy" width="1000" height="1100"><figcaption><span data-photo-title>${items[0].title}</span><span data-photo-count>01 / 03</span></figcaption></figure>`);
  section=section.replace(/<details class="catalog-item"[\s\S]*?<\/details>/,items.map((item,index)=>`<details class="catalog-item" name="clothes-works" data-image="${item.image}" data-title="${item.title}" data-alt="${item.alt}"><summary><span class="work-number">0${index+1}</span><span>${item.title}</span><span class="work-toggle" aria-hidden="true">+</span></summary><p>${item.description}</p><a class="text-link full-detail-link" href="himchistka_s_besplatnoy_dostavkoy.html">Подробнее о химчистке одежды ↗</a></details>`).join(''));
  // The original single-service section did not have gallery controls.
  if(!section.includes('data-prev'))section=section.replace('</figure>','</figure><div class="chapter-controls"><span class="small muted">Уход за гардеробом</span><div><button class="icon-button" data-prev aria-label="Предыдущая услуга: Химчистка одежды">←</button><button class="icon-button" data-next aria-label="Следующая услуга: Химчистка одежды">→</button></div></div>');
 }
 return section;
});
let main=original.slice(original.indexOf('<main'),original.indexOf('<nav class="catalog-index"')).replace('Услуги премиальной<br>мастерской','Услуги мастерской').replace('КАТАЛОГ УСЛУГ ПО РЕМОНТУ','КАТАЛОГ УСЛУГ');
main+='<nav class="catalog-index" aria-label="Направления мастерской">'+specs.map(([,id,title],i)=>`<a href="#${id}"><span>0${i+1}</span>${title}</a>`).join('')+'</nav><div id="catalog" class="catalog-chapters">'+chapters.join('')+'</div>'+gallery()+'</main>';
let current=read('uslugi.html');current=current.slice(0,current.indexOf('<main'))+main+current.slice(current.indexOf('</main>')+7);
current=current.replace('src="service-menu.js"','src="services.js"');
if(!current.includes('href="services.css"'))current=current.replace('href="service-menu.css"','href="services.css"><link rel="stylesheet" href="service-menu.css"');
write('uslugi.html',current);
let home=read('index.html');const insert=home.indexOf('<div class="home-directions"');
if(!home.includes('class="care-stack"'))home=home.slice(0,insert)+`<section class="section home-offer" aria-label="Сервис мастерской">${read('home-offer.html')}</section>`+read('home-about.html')+home.slice(insert);
home=home.replace(/<section class="maker-brands[\s\S]*?<\/section>/,gallery());write('index.html',home);
let brand=read('brand.html');let index=0;brand=brand.replace(/(<div class="brand-marquee-set"(?: aria-hidden="true")?>)[\s\S]*?<\/div>/g,(_,start)=>start+marquee('strip-'+index++)+'</div>');write('brand.html',brand);
console.log('Restored 4 home scenes, offer marquee, 4 illustrated catalog directions, 10 brands.');
