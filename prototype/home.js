'use strict';
document.querySelectorAll('.image-open').forEach(button=>button.addEventListener('click',()=>{const image=button.querySelector('img'),dialog=document.querySelector('#image-dialog');dialog.querySelector('img').src=image.src;dialog.querySelector('img').alt=image.alt;dialog.showModal();}));
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);const motion=gsap.matchMedia();
 motion.add('(prefers-reduced-motion:no-preference)',()=>{
  const cleanups=[];
  const stack=document.querySelector('.care-stack');
  if(stack&&innerHeight>=540){
   const panels=[...stack.querySelectorAll('.care-panel')],segments=Math.max(1,panels.length-1),controls=stack.querySelector('.scene-controls'),buttons=[...controls.querySelectorAll('button')];
   stack.classList.add('is-cinematic');controls.hidden=false;gsap.set(panels,{zIndex:i=>i+1});gsap.set(panels.slice(1),{clipPath:'inset(100% 0 0 0)'});let current=-1;
   const select=index=>{if(index===current)return;current=index;panels.forEach((panel,i)=>{panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index));});buttons.forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));};select(0);
   const timeline=gsap.timeline({paused:true});
   panels.slice(1).forEach((panel,i)=>timeline.to(panel,{clipPath:'inset(0% 0 0 0)',duration:1,ease:'power2.inOut'},i).fromTo(panel.querySelector('img'),{scale:1.15,yPercent:7},{scale:1,yPercent:0,duration:1,ease:'none'},i).fromTo(panel.querySelector('.care-copy'),{y:60,opacity:.2},{y:0,opacity:1,duration:.7,ease:'power2.out'},i+.3).to(panels[i].querySelector('img'),{scale:1.08,yPercent:-5,duration:1,ease:'none'},i));
   const trigger=ScrollTrigger.create({animation:timeline,trigger:stack,start:()=> 'top top+='+document.querySelector('.header').offsetHeight,end:()=>'+='+stack.offsetHeight*segments,pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:self=>select(Math.min(panels.length-1,Math.round(self.progress*segments)))});
   const handlers=buttons.map((button,index)=>{const handler=()=>window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*(index===0?0:Math.min(1,(index-.02)/segments)),behavior:'smooth'});button.addEventListener('click',handler);return handler;});
   cleanups.push(()=>{buttons.forEach((button,i)=>button.removeEventListener('click',handlers[i]));panels.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden');});controls.hidden=true;stack.classList.remove('is-cinematic');});
  }
  const offer=document.querySelector('.offer-strip');
  if(offer){
   offer.classList.remove('is-static');const track=offer.querySelector('.offer-track'),pause=offer.querySelector('.offer-pause');let userPaused=false;
   const tween=gsap.to(track,{x:()=>-offer.querySelector('.offer-group').offsetWidth,duration:38,repeat:-1,ease:'none'});
   const sync=()=>{if(userPaused||document.hidden||offer.matches(':hover')||offer.contains(document.activeElement))tween.pause();else tween.play();};
   const toggle=()=>{userPaused=!userPaused;pause.setAttribute('aria-pressed',String(userPaused));pause.setAttribute('aria-label',userPaused?'Продолжить бегущую строку':'Приостановить бегущую строку');pause.textContent=userPaused?'▷':'Ⅱ';sync();};
   pause.addEventListener('click',toggle);['pointerenter','pointerleave','focusin','focusout'].forEach(name=>offer.addEventListener(name,sync));document.addEventListener('visibilitychange',sync);
   const resize=new ResizeObserver(()=>{const progress=tween.progress();tween.invalidate().progress(progress);});resize.observe(offer);
   cleanups.push(()=>{resize.disconnect();pause.removeEventListener('click',toggle);['pointerenter','pointerleave','focusin','focusout'].forEach(name=>offer.removeEventListener(name,sync));document.removeEventListener('visibilitychange',sync);offer.classList.add('is-static');});
  }
  gsap.timeline({defaults:{ease:'power3.out'}}).from('.hero-photo img',{scale:1.1,opacity:0,duration:1.3}).from('.hero-eyebrow',{y:12,opacity:0,duration:.7},.15).from('.title-line>span',{yPercent:110,duration:1,stagger:.12},.2).from('.hero-categories,.hero-description,.hero-buttons',{y:18,opacity:0,duration:.8,stagger:.1},.5);
  // Observe actual visibility so anchor jumps across the pinned scenes remain reliable.
  // Content stays visible until its own reveal starts; stale scroll offsets cannot hide it.
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;revealObserver.unobserve(entry.target);gsap.from(entry.target,{y:24,opacity:0,duration:.85,ease:'power3.out',overwrite:'auto'});}),{rootMargin:'0px 0px -5% 0px',threshold:.05});
  document.querySelectorAll('.direction-title,.mini-service,.maker-logo-grid a,.reveal').forEach(el=>revealObserver.observe(el));
  cleanups.push(()=>revealObserver.disconnect());
  gsap.to('.process-progress span',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.process',start:'top 75%',end:'bottom 45%',scrub:true}});
  document.querySelectorAll('.steps li').forEach((step,i)=>gsap.to(step,{'--step-progress':1,ease:'none',scrollTrigger:{trigger:innerWidth>700?'.steps':step,start:innerWidth>700?'top '+(80-i*15)+'%':'top 80%',end:innerWidth>700?'bottom '+(65-i*15)+'%':'bottom 65%',scrub:true,onUpdate:self=>step.classList.toggle('is-complete',self.progress>=.5)}}));
  return()=>cleanups.reverse().forEach(cleanup=>cleanup());
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
if(matchMedia('(prefers-reduced-motion:reduce)').matches)document.querySelectorAll('.steps li').forEach(step=>step.classList.add('is-complete'));
