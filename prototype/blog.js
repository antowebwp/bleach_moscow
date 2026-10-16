'use strict';
const search=document.querySelector('#journal-search');
if(search){
 const cards=[...document.querySelectorAll('.journal-card')],buttons=[...document.querySelectorAll('.journal-filters button')];let topic='';
 function filter(){const term=search.value.toLocaleLowerCase('ru').trim();let count=0;cards.forEach(card=>{const show=(!topic||card.dataset.topic===topic)&&card.dataset.title.toLocaleLowerCase('ru').includes(term);card.hidden=!show;if(show)count++;});document.querySelector('#journal-count').textContent='Найдено: '+count;document.querySelector('.journal-empty').hidden=count>0;window.ScrollTrigger?.refresh();}
 search.addEventListener('input',filter);buttons.forEach(button=>button.addEventListener('click',()=>{topic=button.dataset.topic;buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));filter();}));
 document.querySelector('[data-reset-search]').addEventListener('click',()=>{search.value='';buttons[0].click();search.focus();});
}
const articleBody=document.querySelector('.article-body');
if(articleBody){
 const headings=[...articleBody.querySelectorAll('h2')],links=[...document.querySelectorAll('.article-toc a')];
 const update=()=>{const rect=articleBody.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.3-rect.top)/Math.max(1,rect.height-innerHeight*.5)));document.querySelector('[data-read-percent]').textContent=Math.round(progress*100)+'%';document.querySelector('.article-progress>div>span').style.transform=`scaleX(${progress})`;let index=0;headings.forEach((heading,i)=>{if(heading.getBoundingClientRect().top<innerHeight*.4)index=i;});links.forEach((link,i)=>{if(i===index)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});};
 let pending=false;window.addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{update();pending=false;});},{passive:true});window.addEventListener('resize',update);update();
}
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion:no-preference)',()=>{
  gsap.from('.journal-intro h1,.article-header h1',{y:30,opacity:0,duration:1.1,ease:'power3.out'});
  document.querySelectorAll('.journal-card,.journal-feature-copy,.article-body h2,.article-end h2').forEach(el=>gsap.from(el,{y:24,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
  const cover=document.querySelector('.journal-cover img,.article-hero>img');if(cover)gsap.fromTo(cover,{scale:1.045},{scale:1,ease:'none',scrollTrigger:{trigger:cover.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}});
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
 window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
