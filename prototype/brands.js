'use strict';
const archiveCards=[...document.querySelectorAll('.work-card')];
const archiveSearch=document.querySelector('#work-search');
const archiveCount=document.querySelector('#archive-count');
const archiveEmpty=document.querySelector('#archive-empty');
const archiveBrand=document.querySelector('#brand-filter');
const workGrid=document.querySelector('.work-grid');
const projectAssembly=[];
function layoutProjects(){
  if(!workGrid)return;
  const visible=archiveCards.filter(card=>!card.hidden);
  const fragment=document.createDocumentFragment();
  for(let i=0;i<visible.length;i+=10){
    const group=document.createElement('div');
    group.className='project-pattern';
    const items=visible.slice(i,i+10);group.dataset.size=items.length;
    // A complete cycle occupies a 4 × 4 square; the last group uses a balanced grid.
    items.forEach(card=>group.append(card));fragment.append(group);
  }
  archiveCards.filter(card=>card.hidden).forEach(card=>fragment.append(card));
  workGrid.replaceChildren(fragment);
  requestAnimationFrame(()=>window.ScrollTrigger?.refresh(true));
}
let chosenCategory='',chosenBrand='',searchFrame;
const normalize=value=>value.normalize('NFKC').toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/[+–—-]/g,' ').replace(/\s+/g,' ').trim();
function filterWorks(){
  const words=normalize(archiveSearch.value).split(' ').filter(Boolean);
  let count=0;
  archiveCards.forEach(card=>{
    const match=(!chosenCategory||card.dataset.category===chosenCategory)&&(!chosenBrand||card.dataset.brand===chosenBrand)&&words.every(word=>normalize(card.dataset.search).includes(word));
    card.hidden=!match;if(match)count++;
  });
  projectAssembly.forEach(animation=>{animation.scrollTrigger?.kill();animation.kill();});
  projectAssembly.length=0;
  if(window.gsap)gsap.set(archiveCards.map(card=>card.querySelector('.work-project-link')),{clearProps:'transform'});
  layoutProjects();
  archiveCount.textContent='Найдено работ: '+count+' / '+archiveCards.length;
  archiveEmpty.hidden=count!==0;
  document.querySelector('#clear-search').hidden=!archiveSearch.value;
  document.querySelectorAll('[data-category-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.categoryFilter===chosenCategory)));
  document.querySelectorAll('[data-brand-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.brandFilter===chosenBrand)));
  document.querySelector('#brand-filter-label').textContent=chosenBrand||'Все бренды';
  if(window.gsap&&!reducedUI.matches){gsap.killTweensOf(archiveCards);gsap.fromTo(archiveCards.filter(card=>!card.hidden),{opacity:.5,y:16},{opacity:1,y:0,duration:.45,stagger:.015,ease:'power2.out',overwrite:true});}
}
if(archiveSearch){
  archiveSearch.addEventListener('input',()=>{clearTimeout(searchFrame);searchFrame=setTimeout(filterWorks,120);});
  document.querySelector('#clear-search').addEventListener('click',()=>{archiveSearch.value='';filterWorks();archiveSearch.focus();});
  document.querySelectorAll('[data-category-filter]').forEach(button=>button.addEventListener('click',()=>{chosenCategory=button.dataset.categoryFilter;filterWorks();}));
  document.querySelectorAll('[data-brand-filter]').forEach(button=>button.addEventListener('click',()=>{chosenBrand=button.dataset.brandFilter;filterWorks();setDisclosureOpen(archiveBrand,false);archiveBrand.querySelector('summary').focus();}));
  document.querySelector('#reset-filters').addEventListener('click',()=>{chosenCategory='';chosenBrand='';archiveSearch.value='';filterWorks();archiveSearch.focus();});
  filterWorks();
}
if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  const motion=gsap.matchMedia();
  motion.add('(prefers-reduced-motion:no-preference) and (min-width:701px) and (pointer:fine)',()=>{
    if(workGrid&&!chosenCategory&&!chosenBrand&&!archiveSearch.value){
      archiveCards.slice(0,12).forEach((card,index)=>{
        const assembly=gsap.fromTo(card.querySelector('.work-project-link'),
          {scale:.82,x:index%2?-28:28,y:48},
          {scale:1,x:0,y:0,ease:'none',scrollTrigger:{trigger:card,start:'top 98%',end:'top 62%',scrub:.8,invalidateOnRefresh:true}});
        projectAssembly.push(assembly);
      });
    }
    return()=>{projectAssembly.length=0;};
  });
  motion.add('(prefers-reduced-motion:no-preference)',()=>{
    const hero=document.querySelector('.brands-hero,.case-hero');
    if(hero)gsap.from(hero.children,{opacity:0,y:28,duration:1,ease:'power3.out',stagger:.12});
    document.querySelectorAll('[data-count-to]').forEach(el=>{
      const target=Number(el.dataset.countTo);if(!Number.isFinite(target))return;
      const state={value:0};
      gsap.to(state,{value:target,duration:1.8,ease:'power2.out',onUpdate:()=>{el.textContent=Math.round(state.value).toLocaleString('ru-RU');},scrollTrigger:{trigger:el,start:'top 95%',toggleActions:'play none none none'}});
    });
    const story=document.querySelector('.case-story');
    if(story){
      gsap.from(story.querySelector('h2'),{y:36,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:story,start:'top 82%'}});
      gsap.from(story.querySelector('.case-detail-mark span'),{scaleX:0,transformOrigin:'left',duration:1.3,ease:'power2.out',scrollTrigger:{trigger:story,start:'top 75%'}});
      document.querySelectorAll('.case-tasks li').forEach(el=>{
        gsap.from(el,{opacity:0,y:28,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});
        gsap.from(el,{ '--task-progress':0,ease:'none',scrollTrigger:{trigger:el,start:'top 85%',end:'top 55%',scrub:.5}});
      });
      gsap.from(story.querySelector('.case-total'),{opacity:0,y:24,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.case-total',start:'top 90%'}});
    }
    const track=document.querySelector('.brand-marquee-track');
    if(track){
      const pause=document.querySelector('.marquee-pause');
      const tween=gsap.to(track,{xPercent:-50,duration:55,ease:'none',repeat:-1});
      let manualPause=false;
      const sync=()=>{const region=track.parentElement;tween.paused(manualPause||region.matches(':hover')||region.contains(document.activeElement)||document.hidden);};
      pause.addEventListener('click',()=>{manualPause=!manualPause;pause.setAttribute('aria-pressed',String(manualPause));pause.setAttribute('aria-label',manualPause?'Продолжить бегущую строку':'Приостановить бегущую строку');pause.textContent=manualPause?'▶':'Ⅱ';sync();});
      ['pointerenter','pointerleave','focusin','focusout'].forEach(type=>track.parentElement.addEventListener(type,sync));
      document.addEventListener('visibilitychange',sync);
      return()=>{document.removeEventListener('visibilitychange',sync);};
    }
  });
  document.fonts.ready.then(()=>ScrollTrigger.refresh(true));
  window.addEventListener('load',()=>ScrollTrigger.refresh(true),{once:true});
}
