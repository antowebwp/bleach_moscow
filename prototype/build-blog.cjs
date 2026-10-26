// Static editorial templates. Data and ordered content blocks can later come from WP/ACF.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const base=fs.readFileSync(path.join(root,'brand.html'),'utf8');
const shell=base.slice(0,base.indexOf('<main')).replace('brands.css','blog.css').replace('brands.js','blog.js').replace(/ aria-current="page"/g,'').replaceAll('href="blog.html"','href="blog.html" aria-current="page"');
const tail=base.slice(base.indexOf('</main>')+7).replace(/<p class="muted small">\s*Локальный прототип\.[\s\S]*?<\/p>/,'');
const slug='kak-chistit-i-sushit-futbolnye-butsy';
const local='blog/'+slug+'.html';
const source=fs.readFileSync(path.join(root,'article-source.html'),'utf8');
const archive=fs.readFileSync(path.join(root,'blog-source.html'),'utf8');
const title=plain(source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]);
let body=source.match(/<div class="text-block black">([\s\S]*?)<\/div>\s*<\/div>\s*<\/article>/)[1];
let number=0;const headings=[];
body=body.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g,(_,text)=>{const id='chapter-'+(++number);headings.push({id,title:plain(text)});return `<h2 id="${id}">${text}</h2>`;});
body=body.replace(/<table\b[\s\S]*?<\/table>/g,table=>`<div class="article-table" tabindex="0" role="region" aria-label="Таблица: прокрутите по горизонтали">${table}</div>`);
const published=source.match(/property="article:published_time" content="([^"]+)"/)?.[1]||'';
const date=published?new Date(published).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}):'';
const read=Math.ceil(plain(body).split(/\s+/).length/180);
const cover='https://bleach.moscow/assets/generated/football-1600.webp';
const posts=[{title,href:local,image:cover,category:'Уход за обувью',excerpt:'Грунт, крошка, влага. Что сделать после матча, чтобы сохранить пару.',featured:true}];
for(const match of archive.matchAll(/<article class="post-card">([\s\S]*?)<\/article>/g)){
 const html=match[1],href=html.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
 const name=html.match(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/)?.[1];
 const photo=html.match(/data-lzl-src="([^"]+)"/)?.[1]||html.match(/<img[^>]*src="(https:[^"]+)"/)?.[1];
 if(!href||!name||!photo||href.includes(slug))continue;
 posts.push({title:plain(name),href,image:photo,category:/ремонт|набоек|подошвы/i.test(plain(name))?'Ремонт и реставрация':'Уход за обувью'});
}
// Show a small, varied archive preview. Only the featured article is implemented locally.
const selection=[...posts.slice(1).filter(p=>p.category==='Уход за обувью').slice(0,4),...posts.slice(1).filter(p=>p.category==='Ремонт и реставрация').slice(0,2)];
posts.splice(1,posts.length-1,...selection);
function page(main,pageTitle,description){return require('./generated-photos.cjs').enhance(shell.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(pageTitle)} · BLEACH MOSCOW</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(description)}">`)+main+tail);}
function meta(post){return `<span>${post.category}</span><span aria-hidden="true">↗</span>`;}
async function build(){
 const photoIds=['football','hygiene','workboots','riding','skates','climbing','repair'];
 for(const [i,post]of posts.entries())post.image='assets/generated/'+photoIds[i]+'-1600.webp';
 const feature=posts[0];
 const intro=`<section class="journal-intro section"><p class="journal-label">Блог / Журнал мастерской</p><div><h1>Вещи надолго.<br><em>Знания — тоже.</em></h1><p>О материалах, уходе и деталях,<br>которые продлевают жизнь любимых вещей.</p></div></section>`;
 const featured=`<section class="journal-feature section" aria-label="Выбор редакции"><a href="${local}"><div class="journal-cover"><img draggable="false" src="${feature.image}" alt="Чистка футбольных бутс после игры" fetchpriority="high"></div><div class="journal-feature-copy"><p class="journal-label">В фокусе / Уход за обувью</p><h2>${title}</h2><p>${feature.excerpt}</p><span class="journal-read">Читать статью <span aria-hidden="true">↗</span></span><span class="journal-meta">${read} мин чтения${date?' · '+date:''}</span></div></a></section>`;
 const catalogue=`<section class="journal-library section" id="articles"><div class="journal-toolbar"><h2>Полезно знать.</h2><label class="journal-search"><span class="sr-only">Поиск статей</span><input type="search" id="journal-search" placeholder="Найти статью" autocomplete="off"><span aria-hidden="true">⌕</span></label></div><div class="journal-filters" role="group" aria-label="Темы статей">${['Все статьи','Уход за обувью','Ремонт и реставрация'].map((name,i)=>`<button data-topic="${i?name:''}" aria-pressed="${!i}">${name}</button>`).join('')}<span role="status" id="journal-count">${posts.length} материалов</span></div><div class="journal-grid">${posts.map((post,i)=>`<article class="journal-card" data-topic="${post.category}" data-title="${esc(post.title)}"><a href="${esc(post.href)}"><div class="journal-card-photo"><img draggable="false" src="${post.image}" alt="${esc(post.title)}" loading="lazy"></div><div class="journal-card-meta">${meta(post)}</div><h3>${post.title}</h3></a></article>`).join('')}</div><div class="journal-empty" hidden><h3>Статья пока не нашлась.</h3><p>Попробуйте другую тему или формулировку.</p><button class="text-link" data-reset-search>Показать все статьи</button></div></section>`;
 fs.writeFileSync(path.join(root,'blog.html'),page(`<main id="main" class="journal-main">${intro+featured+catalogue}</main>`,'Блог: уход и восстановление вещей','Журнал мастерской BLEACH MOSCOW: уход за обувью, материалы, чистка и реставрация.'));
 const toc=headings.map((h,i)=>`<a href="#${h.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(h.title)}</a>`).join('');
 const article=`<main id="main" class="journal-main"><article><header class="article-header section"><nav class="article-crumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span>/</span><a href="blog.html">Блог</a><span>/</span><span>Уход за обувью</span></nav><p class="journal-label">Уход за обувью / Практика</p><h1>${title}</h1><div class="article-byline"><span>Редакция BLEACH MOSCOW</span>${published?`<time datetime="${published}">${date}</time>`:''}<span>${read} мин чтения</span></div></header><figure class="article-hero"><img draggable="false" src="${feature.image}" alt="Бережная чистка футбольных бутс в мастерской" fetchpriority="high"><figcaption>После игры — время позаботиться о паре.</figcaption></figure><div class="article-layout section"><aside class="article-sidebar"><details class="article-toc" open><summary>В этой статье <span aria-hidden="true">+</span></summary><nav aria-label="Содержание статьи">${toc}</nav></details><div class="article-progress"><span>Вы читаете</span><span data-read-percent aria-hidden="true">0%</span><div aria-hidden="true"><span></span></div></div></aside><div class="article-body">${body}</div></div><section class="article-end section"><p class="journal-label">Нужна помощь с вашей парой?</p><h2>Бережный уход.<br><em>В руках мастера.</em></h2><div><button class="button button-dark" data-contact="consultation">Получить оценку <span aria-hidden="true">↗</span></button><a class="text-link" href="uslugi.html">Услуги мастерской ↗</a></div></section></article><section class="article-back section"><a class="text-link" href="blog.html">← Все статьи журнала</a><span>Вещи надолго. BLEACH MOSCOW.</span></section></main>`;
 const structured={"@context":"https://schema.org","@type":"BlogPosting",headline:title,datePublished:published,image:cover,inLanguage:'ru-RU',publisher:{'@type':'Organization',name:'BLEACH MOSCOW'},mainEntityOfPage:'https://bleach.moscow/blog/'+slug+'/'};
 const html=page(article,title,'Как чистить и сушить футбольные бутсы после матча, убрать грунт и крошку, проверить шипы и понять, когда подошве нужен ремонт.').replace('</head>',`<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:image" content="${cover}"><script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script></head>`).replaceAll('href="assets/','href="../assets/').replaceAll('src="assets/','src="../assets/').replaceAll('src="vendor/','src="../vendor/').replace(/href="(styles|full-font|blog)\.css"/g,'href="../$1.css"').replace(/src="(ui|blog)\.js"/g,'src="../$1.js"').replace(/href="(index|uslugi|brand|blog)\.html/g,'href="../$1.html');
 fs.mkdirSync(path.join(root,'blog'),{recursive:true});fs.writeFileSync(path.join(root,local),require('./generated-photos.cjs').enhance(html));
 const sections=body.split(/(?=<h2 id="chapter-)/).map((html,i)=>({type:i?'section':'intro',id:i?headings[i-1].id:'intro',heading:i?headings[i-1].title:'',bodyHtml:i?html.replace(/^<h2[^>]*>[\s\S]*?<\/h2>/,''):html}));
 fs.writeFileSync(path.join(root,'blog-data.json'),JSON.stringify({article:{slug,title,published,readMinutes:read,cover:feature.image,source:'https://bleach.moscow/blog/'+slug+'/',blocks:sections,headings},posts},null,2));
 console.log('Built blog archive and article; '+headings.length+' sections, '+posts.length+' cards.');
}
build().catch(error=>{console.error(error);process.exitCode=1;});
