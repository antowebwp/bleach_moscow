const fullImageDialog = document.querySelector('#image-dialog');
document.querySelectorAll('.full-image-open').forEach(button => {
  button.addEventListener('click', () => {
    const photo = button.querySelector('img');
    const target = fullImageDialog.querySelector('img');
    target.src = photo.src;
    target.alt = photo.alt;
    fullImageDialog.showModal();
  });
});
fullImageDialog.querySelector('.dialog-close').addEventListener('click', () => fullImageDialog.close());
fullImageDialog.addEventListener('click', event => { if (event.target === fullImageDialog) fullImageDialog.close(); });
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const count = document.querySelector('[data-count]');
    const counterState = { value: 0 };
    let counted = false;
    const counter = gsap.to(counterState, {
      value: Number(count.dataset.count), duration: .95, ease: 'power2.out', paused: true,
      onUpdate: () => { count.textContent = String(Math.round(counterState.value)).padStart(2, '0'); }
    });
    ScrollTrigger.create({ trigger: '.care-stat', start: 'top 90%', onEnter: () => {
      if (counted) return;
      counted = true;
      count.textContent = '00';
      counter.play();
    } });
    gsap.from('.full-hero-copy > :not(.full-booking)', { y: 24, autoAlpha: 0, stagger: .09, duration: 1, ease: 'power3.out' });
    gsap.from('.full-hero-image', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut' });
    gsap.to('.full-hero-image img', { yPercent: 5, scale: 1.07, ease: 'none', scrollTrigger: { trigger: '.full-hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    document.querySelectorAll('.full-fit h2,.full-included-title,.full-results-heading,.full-final h2,.contacts .reveal').forEach(element => {
      gsap.from(element, { y: 30, autoAlpha: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', toggleActions: 'play none none none' } });
    });
    const shoe = document.querySelector('.material-shoe');
    const shoeFloat = shoe.querySelector('.material-shoe-float');
    gsap.fromTo(shoe.querySelector('img'), { y: 65, rotation: -8, scale: .78 }, {
      y: -20, rotation: 3, scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: shoe, start: 'top bottom', end: 'bottom 20%', scrub: 1.2 }
    });
    gsap.fromTo('.material-word', { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: {
      trigger: shoe, start: 'top bottom', end: 'bottom top', scrub: 1.4
    } });
    document.querySelectorAll('.material-list li').forEach((element, index) => {
      gsap.from(element, { y: 14, opacity: 0, delay: index * .1, duration: .65, ease: 'power3.out',
        scrollTrigger: { trigger: '.material-footer', start: 'top 93%', toggleActions: 'play none none none' }
      });
    });
    const pointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    const moveX = gsap.quickTo(shoeFloat, 'x', { duration: .7, ease: 'power3.out' });
    const moveY = gsap.quickTo(shoeFloat, 'y', { duration: .7, ease: 'power3.out' });
    const tiltX = gsap.quickTo(shoeFloat, 'rotationX', { duration: .7, ease: 'power3.out' });
    const tiltY = gsap.quickTo(shoeFloat, 'rotationY', { duration: .7, ease: 'power3.out' });
    const move = event => {
      if (!pointerMedia.matches) return;
      const box = shoe.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      moveX(x * 18); moveY(y * 14); tiltX(-y * 10); tiltY(x * 14);
    };
    const reset = () => { moveX(0); moveY(0); tiltX(0); tiltY(0); };
    shoe.addEventListener('pointermove', move);
    shoe.addEventListener('pointerleave', reset);
    const tasks = [...document.querySelectorAll('.full-tasks li')];
    tasks.forEach(element => {
      const reveal = gsap.timeline({ scrollTrigger: {
        trigger: element, start: 'top 88%', end: 'top 62%', scrub: .6
      } });
      reveal.fromTo(element.querySelector('h3'), { y: 16, color: 'var(--text-secondary)' }, { y: 0, color: 'var(--text-primary)', ease: 'none' }, 0)
        .to(element.querySelector('.full-task-number'), { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--text-on-dark)', ease: 'none' }, 0);
    });
    gsap.to('.full-task-track>span', { scaleY: 1, ease: 'none', scrollTrigger: {
      trigger: '.full-task-flow', start: 'top 65%', end: 'bottom 65%', scrub: .6
    } });
    document.querySelectorAll('.full-work').forEach(element => {
      gsap.from(element, { y: 45, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none none' } });
    });
    return () => {
      count.textContent = count.dataset.count.padStart(2, '0');
      shoe.removeEventListener('pointermove', move);
      shoe.removeEventListener('pointerleave', reset);
    };
  });
  let refreshFrame;
  const refresh = () => { cancelAnimationFrame(refreshFrame); refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh(true)); };
  document.fonts.ready.then(refresh);
  if (document.readyState === 'complete') refresh(); else window.addEventListener('load', refresh, { once: true });
}
