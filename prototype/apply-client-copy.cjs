const fs=require('node:fs');
const {clean,restoration,sole,render,esc}=require('./service-copy.cjs');
const read=n=>fs.readFileSync(__dirname+'/'+n,'utf8'),write=(n,s)=>fs.writeFileSync(__dirname+'/'+n,s);
// The supplied chat is source copy; layout remains the approved illustrated catalog.
const pasted=read('client-service-copy.txt');
const messages=pasted.split(/\[22\.10\.2026 \d{2}:\d{2}\] Эдуард: /).filter(s=>s.trim());
function rich(text){
 const blocks=text.trim().split(/\r?\n\s*\r?\n/);let html='';
 for(const block of blocks){const lines=block.trim().split(/\r?\n/);html+=lines.every(l=>l.startsWith('• '))?'<ul>'+lines.map(l=>'<li>'+esc(l.slice(2))+'</li>').join('')+'</ul>':'<p>'+esc(block).replace(/\r?\n/g,'<br>')+'</p>';}
 return '<div class="service-copy">'+html+'</div>';
}
const supplied=messages.slice(0,7).map(rich);
const bagClean={title:'Комплексная чистка сумки',html:supplied[2]};
const corner={title:'Реставрация углов сумки',html:supplied[3]};
const local={title:'Локальное окрашивание сумки без полной покраски',html:supplied[4]};
const lining={title:'Чистка подкладки сумки',html:supplied[5]};
const copyMap={'Чистка FULL':clean,'Комплекс FULL':restoration,'Замена подошвы на Loro Piana':sole,'Чистка обуви Loro Piana':clean,'Восстановление цвета обуви Loro Piana':restoration,'Чистка сумки':bagClean,'Реставрация углов сумки':corner,'Покраска клатча':local,'Набойки для обуви':{title:'Набойки / профилактика',html:supplied[1]}};
function catalog(html){
 html=html.replace(/<details class="catalog-item"[\s\S]*?<\/details>/g,item=>{
  const old=item.match(/data-title="([^"]+)"/)?.[1],data=copyMap[old];if(!data)return item;
  const title=(old==='Чистка обуви Loro Piana'?clean.title+' Loro Piana':old==='Восстановление цвета обуви Loro Piana'?'Комплексная реставрация Loro Piana':data.title);
  item=item.replace('data-title="'+old+'"','data-title="'+title+'"').replace('<span>'+old+'</span>','<span>'+title+'</span>');
  return item.slice(0,item.indexOf('</summary>')+10)+(data.html||render(data))+(old==='Чистка FULL'?'<a class="text-link full-detail-link" href="chistka_obuvi_full.html">Подробнее о комплексной чистке ↗</a>':'')+'</details>';
 });
 // Keep the initial image caption aligned with the renamed first item.
 html=html.replace('data-photo-title>Чистка FULL','data-photo-title>Комплексная чистка').replace('data-photo-title>Чистка сумки','data-photo-title>Комплексная чистка сумки').replace('data-photo-title>Замена подошвы на Loro Piana','data-photo-title>Замена подошвы Loro Piana');
 const bagsStart=html.indexOf('<section id="bags"'),bagsEnd=html.indexOf('</section>',bagsStart);
 let bags=html.slice(bagsStart,bagsEnd);
 if(!bags.includes('data-title="Чистка подкладки сумки"')){
  const item=`<details class="catalog-item" name="bags-works" data-image="assets/5.jpg" data-title="Чистка подкладки сумки"><summary><span class="work-number">17</span><span>Чистка подкладки сумки</span><span class="work-toggle" aria-hidden="true">+</span></summary>${lining.html}</details>`;
  bags=bags.replace('</div><button class="direction-info',item+'</div><button class="direction-info').replace('01 / 16','01 / 17');html=html.slice(0,bagsStart)+bags+html.slice(bagsEnd);
 }
 const loroStart=html.indexOf('<section id="loro"'),loroEnd=html.indexOf('</section>',loroStart);
 if(loroStart!==-1){let section=html.slice(loroStart,loroEnd);section=section.replace(/(<div class="direction-description-source"[^>]*>)[\s\S]*?(<\/div>\s*<div class="chapter-action")/,'$1'+supplied[0]+'$2');html=html.slice(0,loroStart)+section+html.slice(loroEnd);}
 return html;
}
module.exports={catalog,rich,loroIntro:supplied[0],clean,restoration,sole};
if(require.main===module){
 let about=read('home-about.html');
 const panels=[...about.matchAll(/<article class="care-panel">[\s\S]*?<\/article>/g)].map(m=>m[0]);
 if(panels.length===4){let i=0;about=about.replace(/<article class="care-panel">[\s\S]*?<\/article>/g,()=>{const n=i++;return n===1||n===3?panels[n]:'';});}
 let number=0;about=about.replace(/<span class="care-index">\d+ \/ \d+<\/span>/g,()=>`<span class="care-index">0${++number} / 02</span>`);
 about=about.replace(/<nav class="scene-controls"[\s\S]*?<\/nav>/,'<nav class="scene-controls" aria-label="Сцены о мастерской" hidden><button aria-label="Оценка по фотографии" aria-current="true">01</button><button aria-label="Бесплатная доставка">02</button></nav>');
 about=about.replace(/<p class="section-intro reveal">[\s\S]*?<\/p>/,'<p class="section-intro reveal">Восстановление обуви и сумок премиальных брендов стоит доверять только мастерской с безупречной репутацией.<br><br>Такие изделия требуют не просто ухода, а деликатного подхода, глубокого понимания материалов и ювелирной точности в работе.</p>');
 write('home-about.html',about);
 let home=read('index.html').replace(/<section class="third-slide section about"[\s\S]*?<\/section>/,about).replaceAll('Покраска клатча','Локальное окрашивание сумки без полной покраски');
 home=home.replace(/(<div class="direction-title">[\s\S]*?)(<\/div>)/g,(all,start,end)=>start.includes('data-contact="consultation"')?all:start+'<button class="button button-dark direction-consultation" data-contact="consultation">Бесплатная консультация <span aria-hidden="true">↗</span></button>'+end);
 write('index.html',home);
 let data=JSON.parse(read('service-menu-data.json'));data[1].items[2][0]='Локальное окрашивание сумки без полной покраски';write('service-menu-data.json',JSON.stringify(data,null,2));
 let full=read('chistka_obuvi_full.html').replace(/<p class="service-copy full-care-result">[\s\S]*?<\/p>/g,'').replace(/<p class="full-description">[\s\S]*?<\/p>/,'<p class="full-description">'+clean.description+'</p>').replace(/<ol class="full-tasks">[\s\S]*?<\/ol>/,'<ol class="full-tasks">'+clean.steps.map((s,i)=>`<li><span class="full-task-number">0${i+1}</span><h3>${esc(s)}</h3></li>`).join('')+'</ol><p class="service-copy full-care-result"><strong>Результат:</strong> '+clean.result+'</p>').replace('data-count="6" aria-hidden="true">06','data-count="8" aria-hidden="true">08').replace('6 этапов ухода','8 этапов ухода');
 write('chistka_obuvi_full.html',full);
 console.log('Updated approved home and full-care copy.');
}
