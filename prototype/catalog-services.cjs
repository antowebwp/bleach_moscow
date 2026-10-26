// The client-approved catalog. Order and labels are intentional.
const fs=require('node:fs');
const {esc}=require('./service-copy.cjs');
const {summary}=require('./catalog-summary.cjs');
const original=fs.readFileSync(__dirname+'/catalog-layout-template.html','utf8');
const originals=new Map([...original.matchAll(/<details class="catalog-item"[\s\S]*?<\/details>/g)].map(m=>[m[0].match(/data-title="([^"]+)"/)[1],m[0]]));
const groups={
 shoes:[
  {title:'Комплексная чистка',source:'Чистка FULL',href:'chistka_obuvi_full.html'},
  {title:'Комплексная реставрация',source:'Комплекс FULL',},
  {title:'Замена подошвы Loro Piana',source:'Замена подошвы на Loro Piana',href:'loropiana.html'},
  {title:'Сервисный центр Loro Piana',source:'Замена подошвы на Loro Piana',image:'assets/IMG_3990-_1_.jpg',href:'loropiana.html'},
  {title:'Комплекс UGG',source:'Чистка UGG'},
  {title:'Набойки / профилактика',source:'Набойки для обуви',},
  {title:'Ремонт задников',source:'Перешив задников на обуви'},
  {title:'Швейные работы',source:'Перешив задников на обуви',},
  {title:'Бренды',source:'Бренды',href:'brand.html'}
 ],
 bags:[
  {title:'Комплексная чистка сумки',source:'Чистка сумки',},
  {title:'Реставрация углов',source:'Реставрация углов сумки',},
  {title:'Покраска клатча',source:'Покраска клатча'},
  {title:'Локальная реставрация (без полной покраски)',source:'Покраска клатча',image:'assets/4.jpg',},
  {title:'Комплексная реставрация сумки',source:'Покраска сумки',image:'assets/sumka.jpg',},
  {title:'Чистка подкладки',source:'Чистка сумки',image:'assets/5.jpg',},
  {title:'Полировка фурнитуры/ гальваника',source:'Восстановление фурнитуры'},
  {title:'Перешив ручек',source:'Перешив ручек на сумке'},
  {title:'Перешив кожи на сумках Louis Vuitton',source:'Перешив кожи на сумках Louis Vuitton'},
  {title:'Реставрация / восстановление уреза',source:'Реставрация / восстановление уреза'},
  {title:'Замена молнии на сумке',source:'Замена молнии на сумке'}
 ]
};
function curate(section,id){
 const services=groups[id];if(!services)return section;
 const details=services.map((item,i)=>{
  const source=originals.get(item.source);if(!source)throw Error('Missing catalog source: '+item.source);
  item.image ||= source.match(/data-image="([^"]+)"/)[1];
  const body=summary(item.title);
  return `<details class="catalog-item" name="${id}-works" data-image="${esc(item.image)}" data-title="${esc(item.title)}"><summary><span class="work-number">${String(i+1).padStart(2,'0')}</span><span>${esc(item.title)}</span><span class="work-toggle" aria-hidden="true">+</span></summary>${body}${item.href?`<a class="text-link full-detail-link" href="${item.href}">${item.title==='Бренды'?'Бренды и примеры работ':'Подробнее об услуге'} ↗</a>`:''}</details>`;
 }).join('');
 let inserted=false;
 section=section.replace(/<details class="catalog-item"[\s\S]*?<\/details>/g,()=>{if(inserted)return '';inserted=true;return details;});
 section=section.replace(/data-photo-count>01 \/ \d+/,'data-photo-count>01 / '+String(services.length).padStart(2,'0'));
 section=section.replace(/data-photo-title>[^<]+/,'data-photo-title>'+esc(services[0].title));
 section=section.replace(/(<figure class="chapter-photo">[\s\S]*?<img\b[^>]*alt=")[^"]+"/,'$1'+esc(services[0].title)+'"');
 return section;
}
module.exports={groups,curate};
