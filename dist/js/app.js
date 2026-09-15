import {initPageInteractions} from './interactions.js';
import {setLanguage,language,t} from './i18n.js';import {initField} from './animation.js';import {initTracking} from './tracking.js';
async function boot(){
const dialog=document.querySelector('#navigation'),burger=document.querySelector('.burger');let closing=false;
function openMenu(){dialog.showModal();document.body.style.overflow='hidden';burger.setAttribute('aria-expanded','true');dialog.getBoundingClientRect();requestAnimationFrame(()=>dialog.classList.add('open'))}
function closeMenu(){if(closing)return;closing=true;dialog.classList.remove('open');burger.setAttribute('aria-expanded','false');setTimeout(()=>{dialog.close();document.body.style.overflow='';closing=false;burger.focus()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:550)}
burger?.addEventListener('click',openMenu);dialog?.querySelector('.nav-close').addEventListener('click',closeMenu);dialog?.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});dialog?.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.querySelectorAll('button[data-lang]').forEach(b=>b.onclick=()=>{const change=()=>setLanguage(b.dataset.lang);change();document.querySelector('main')?.animate?.([{opacity:.6},{opacity:1}],{duration:220})});
setLanguage(language,false);initPageInteractions();
{initField();try{initTracking()}catch(error){console.warn("Analytics unavailable",error)};if(document.body.dataset.page==='home'){const {initForm}=await import('./form.js');initForm()}if(document.body.dataset.page==='case'){const bar=document.createElement('div');bar.className='case-scroll';document.body.append(bar);addEventListener('scroll',()=>{bar.style.scale=`${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)} 1`},{passive:true})}}

}
boot().catch(error=>console.error("Site initialization failed",error));
