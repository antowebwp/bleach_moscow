'use strict';
// Native details keep every service description available without JavaScript.
const directionDialog = document.querySelector('#direction-dialog');
document.querySelectorAll('[data-direction-info]').forEach(button => {
  button.addEventListener('click', () => {
    directionDialog.querySelector('h2').textContent = button.dataset.directionTitle;
    directionDialog.querySelector('[data-direction-description]').textContent = button.nextElementSibling.textContent;
    directionDialog.showModal();
  });
});
directionDialog.querySelector('.dialog-close').addEventListener('click', () => directionDialog.close());
directionDialog.addEventListener('click', event => { if (event.target === directionDialog) directionDialog.close(); });
directionDialog.querySelector('[data-contact]').addEventListener('click', () => directionDialog.close());
document.querySelectorAll('[data-direction]').forEach(chapter => {
  const items = [...chapter.querySelectorAll('.catalog-item')];
  const photo = chapter.querySelector('.chapter-photo img');
  const title = chapter.querySelector('[data-photo-title]');
  const count = chapter.querySelector('[data-photo-count]');
  const status = document.createElement('p');
  status.className = 'small muted'; status.setAttribute('role','status');
  chapter.querySelector('.chapter-visual').append(status);
  let selected = 0, revision = 0;
  function show(index) {
    selected = index;
    const item = items[index], request = ++revision;
    count.textContent = String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
    const preload = new Image(); preload.src = item.dataset.image;
    preload.decode().then(() => {
      if(request !== revision) return;
      photo.src = preload.src; photo.alt = item.dataset.alt || item.dataset.title;
      title.textContent = item.dataset.title; status.textContent = '';
      if(window.gsap && !matchMedia('(prefers-reduced-motion:reduce)').matches)
        gsap.fromTo(photo,{clipPath:'inset(0 0 12% 0)',scale:1.065,opacity:.4},{clipPath:'inset(0 0 0% 0)',scale:1,opacity:1,duration:.85,ease:'power3.out',overwrite:true});
    }).catch(() => {
      if(request === revision) status.textContent = 'Фотография недоступна. Описание услуги доступно справа.';
    });
  }
  items.forEach((item,index) => item.addEventListener('disclosure:change', event => {
    if(!event.detail.open) return;
    show(index);
  }));
  function move(direction) {
    const index = (selected+direction+items.length)%items.length;
    if(items[index].dataset.expanded === 'true') show(index); else setDisclosureOpen(items[index], true);
  }
  chapter.querySelector('[data-prev]')?.addEventListener('click',()=>move(-1));
  chapter.querySelector('[data-next]')?.addEventListener('click',()=>move(1));
});
if(window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion:no-preference)',()=>{
    gsap.timeline({defaults:{ease:'power3.out'}})
      .from('.catalog-intro > *',{y:24,opacity:0,duration:.9,stagger:.1})
      .from('.catalog-hero-art',{clipPath:'inset(0 0 100% 0)',duration:1.2},.15)
      .from('.catalog-hero-art img',{scale:1.15,duration:1.5},.15);
    document.querySelectorAll('.catalog-chapter').forEach(chapter=>{
      const trigger={trigger:chapter,start:'top 88%',toggleActions:'play none none none'};
      gsap.from(chapter.querySelector('.chapter-heading'),{y:24,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:trigger});
      gsap.from(chapter.querySelector('.chapter-photo'),{clipPath:'inset(0 0 12% 0)',opacity:.5,duration:1.1,ease:'power2.out',scrollTrigger:trigger});
      gsap.from(chapter.querySelector('.chapter-lede'),{y:24,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:trigger});
    });
  });
  let frame=0;
  const refresh=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>ScrollTrigger.refresh(true));};
  document.fonts.ready.then(refresh);
  window.addEventListener('load',refresh,{once:true});
}
