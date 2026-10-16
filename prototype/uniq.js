'use strict';
document.querySelectorAll('.uniq-image-open,.image-open').forEach(button=>button.addEventListener('click',()=>{const source=button.querySelector('img');const modal=document.querySelector('#image-dialog');modal.querySelector('img').src=source.src;modal.querySelector('img').alt=source.alt;modal.showModal();}));
document.querySelectorAll('[data-video]').forEach(region=>region.querySelector('button').addEventListener('click',()=>{const frame=document.createElement('iframe');frame.title='Технология замены подошвы Loro Piana';frame.src='https://player.vimeo.com/video/'+region.dataset.video+'?title=0';frame.allow='fullscreen; picture-in-picture';frame.allowFullscreen=true;region.querySelector('button').replaceWith(frame);requestAnimationFrame(()=>window.ScrollTrigger?.refresh(true));frame.addEventListener('load',()=>window.ScrollTrigger?.refresh(true),{once:true});}));
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const motion=gsap.matchMedia();
 motion.add('(prefers-reduced-motion:no-preference)',()=>{
  gsap.from('.uniq-hero h1,.uniq-lead',{y:28,opacity:0,duration:1.1,stagger:.15,ease:'power3.out'});
  gsap.from('.uniq-hero-media',{clipPath:'inset(0 0 100% 0)',duration:1.3,ease:'power3.inOut'});
  gsap.to('.uniq-hero-media img',{scale:1.06,yPercent:4,ease:'none',scrollTrigger:{trigger:'.uniq-hero',start:'top top',end:'bottom top',scrub:1.1}});
  document.querySelectorAll('.uniq-heading h2,.uniq-object-heading h2,.uniq-flow-intro,.uniq-gallery button,.review-layout>*').forEach(el=>gsap.from(el,{y:32,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none none'}}));
  document.querySelectorAll('[data-count]').forEach(el=>{const state={value:0};gsap.to(state,{value:Number(el.dataset.count),duration:1.2,ease:'power2.out',onUpdate:()=>{el.textContent=String(Math.round(state.value)).padStart(2,'0');},scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none none'}});});
  document.querySelectorAll('.delivery-sequence article,.uniq-service-list article').forEach(el=>{
   const number=el.querySelector('.uniq-step,.uniq-service-no');const title=el.querySelector('h3');
   gsap.timeline({scrollTrigger:{trigger:el,start:'top 84%',end:'top 58%',scrub:.65}})
    .fromTo(title,{y:18,color:'var(--text-secondary)'},{y:0,color:'var(--text-primary)',ease:'none'},0)
    .to(number,{backgroundColor:'var(--accent)',borderColor:'var(--accent)',color:'var(--text-on-dark)',ease:'none'},0);
  });
  document.querySelectorAll('.uniq-flow-track').forEach(track=>gsap.to(track.firstElementChild,{scaleY:1,ease:'none',scrollTrigger:{trigger:track.parentElement,start:'top 65%',end:'bottom 65%',scrub:.7}}));
  const stage=document.querySelector('.uniq-object-stage');const float=stage?.querySelector('.uniq-object-float');
  let cleanupPointer=()=>{};
  if(stage&&float){
  gsap.fromTo(float.querySelector('img'),{rotation:-7,y:65,scale:.84},{rotation:3,y:-16,scale:1.04,ease:'none',scrollTrigger:{trigger:stage,start:'top bottom',end:'bottom 25%',scrub:1.25}});
  gsap.fromTo(stage.querySelector('.uniq-object-word'),{xPercent:5},{xPercent:-5,ease:'none',scrollTrigger:{trigger:stage,start:'top bottom',end:'bottom top',scrub:1.4}});
  const pointerMedia=matchMedia('(hover:hover) and (pointer:fine)');
  const x=gsap.quickTo(float,'x',{duration:.8,ease:'power3.out'}),y=gsap.quickTo(float,'y',{duration:.8,ease:'power3.out'}),rx=gsap.quickTo(float,'rotationX',{duration:.8,ease:'power3.out'}),ry=gsap.quickTo(float,'rotationY',{duration:.8,ease:'power3.out'});
  const move=e=>{if(!pointerMedia.matches)return;const box=stage.getBoundingClientRect();const px=(e.clientX-box.left)/box.width-.5,py=(e.clientY-box.top)/box.height-.5;x(px*20);y(py*14);rx(-py*8);ry(px*12);};
  const reset=()=>{x(0);y(0);rx(0);ry(0);};stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',reset);
  cleanupPointer=()=>{stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',reset);};
  }
  const compare=document.querySelector('.uniq-compare');if(compare)gsap.from(compare,{clipPath:'inset(0 0 100% 0)',duration:1.2,ease:'power3.inOut',scrollTrigger:{trigger:compare,start:'top 88%'}});
  return()=>{cleanupPointer();document.querySelectorAll('[data-count]').forEach(el=>{el.textContent=el.dataset.count.padStart(2,'0');});};
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh(true));
 window.addEventListener('load',()=>ScrollTrigger.refresh(true),{once:true});
}
