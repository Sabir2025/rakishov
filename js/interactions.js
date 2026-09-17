export function initPageInteractions(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.faq-row').forEach(detail=>{
  const summary=detail.querySelector('summary');let animation=null,expanded=detail.open||false;
  function finish(){detail.open=expanded;detail.style.height='';detail.classList.remove('faq-animating');animation=null;}
  summary.addEventListener('click',event=>{
   if(reduced.matches||typeof detail.animate!=='function')return;
   event.preventDefault();const start=detail.getBoundingClientRect().height;expanded=!expanded;
   if(animation){animation.onfinish=null;animation.cancel();}
   detail.open=true;detail.style.height='';const end=expanded?detail.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;
   detail.classList.add('faq-animating');detail.style.height=start+'px';
   animation=detail.animate({height:[start+'px',end+'px']},{duration:320,easing:'cubic-bezier(.2,.7,.2,1)'});
   animation.onfinish=finish;
  });
  detail.addEventListener('toggle',()=>{if(!animation)expanded=detail.open;});
  const settle=()=>{if(animation){animation.onfinish=null;animation.cancel();finish();}};
  window.addEventListener('languagechange',settle);reduced.addEventListener('change',settle);
 });
 document.querySelectorAll('.service').forEach(service=>{
  service.addEventListener('mouseenter',()=>{service.open=true});
  service.addEventListener('mouseleave',()=>{service.open=false});
 });
 const button=document.querySelector('#back-to-top'),footer=document.querySelector('.footer');
 if(!button||!footer)return;
 button.addEventListener('click',()=>{window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});const brand=document.querySelector('.header .brand');brand?.focus({preventScroll:true});});
 if(typeof IntersectionObserver==='function')new IntersectionObserver(([entry])=>{button.hidden=!entry.isIntersecting;},{threshold:0}).observe(footer);
 else{const update=()=>{button.hidden=footer.getBoundingClientRect().top>window.innerHeight;};window.addEventListener('scroll',update,{passive:true});update();}
}
