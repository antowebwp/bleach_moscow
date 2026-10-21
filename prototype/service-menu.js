'use strict';
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);const motion=gsap.matchMedia();
 motion.add('(prefers-reduced-motion:no-preference)',()=>{
  gsap.from('.service-menu-intro h1',{y:26,opacity:0,duration:1,ease:'power3.out'});
  document.querySelectorAll('.service-menu-group').forEach(group=>{
   gsap.from(group.querySelector('.service-menu-heading'),{y:24,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:group,start:'top 90%',once:true}});
   group.querySelectorAll('li').forEach((row,i)=>gsap.from(row,{y:20,opacity:0,duration:.65,delay:Math.min(i*.035,.2),ease:'power3.out',scrollTrigger:{trigger:row,start:'top 96%',once:true}}));
  });
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
