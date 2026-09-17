import translations from '../content/translations.json' with {type:'json'};
export const base = new URL(document.body.dataset.root || './', location.href);
export const dictionaries = translations;
export let language = document.body.dataset.lang || 'kz';
export const t = key => dictionaries[language][key] ?? key;
export const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const route = path => new URL((language==='kz'?'':language+'/')+path+(location.protocol==='file:'&&(!path||path.endsWith('/'))?'index.html':''),base).href;
export function setLanguage(lang, updateUrl=true){
 if(!dictionaries[lang])return; language=lang;document.body.dataset.lang=lang;document.documentElement.lang=lang==='kz'?'kk':lang;
 document.querySelectorAll('[data-t]').forEach(el=>{const val=t(el.dataset.t);const lines=val.split('\n');el.replaceChildren(...lines.flatMap((line,i)=>{const frag=document.createDocumentFragment();const tmp=document.createElement('template');tmp.innerHTML=line;const nodes=Array.from(tmp.content.childNodes).map(n=>n.cloneNode(true));const result=i?[document.createElement('br'),...nodes]:nodes;return result}))});
 document.querySelectorAll('[data-label]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.label)));
 document.querySelectorAll('[data-lang]').forEach(el=>{if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(el.dataset.lang===lang))});
 document.querySelectorAll('[data-home]').forEach(el=>el.href=route('')+el.dataset.home);
 document.querySelectorAll('[data-route]').forEach(el=>{if(el.tagName==='A')el.href=route(el.dataset.route)});
 try{localStorage.setItem('sr-language',lang)}catch{}
 if(updateUrl&&location.protocol!=='file:')history.replaceState(null,'',route(document.body.dataset.route||'')+location.hash);
 const canonical=document.querySelector('link[rel=canonical]');if(canonical){const old=new URL(canonical.href); const suffix=document.body.dataset.route||''; let prefix=old.pathname; if(suffix&&prefix.endsWith(suffix))prefix=prefix.slice(0,-suffix.length);prefix=prefix.replace(/(?:ru|kz|en)\/$/,'');canonical.href=old.origin+prefix+(lang==='kz'?'':lang+'/')+suffix;document.querySelector('meta[property="og:url"]')?.setAttribute('content',canonical.href)}
 const title=document.body.dataset.project?document.body.dataset.project.toUpperCase()+' — '+t('concept'):'Sabir Rakishov — '+t(document.body.classList.contains('admin')?'owner':'role');document.title=title;document.querySelector('meta[property="og:title"]')?.setAttribute('content',title);document.querySelector('meta[name=description]')?.setAttribute('content',t('intro'));document.querySelector('meta[property="og:description"]')?.setAttribute('content',t('intro'));
 window.dispatchEvent(new CustomEvent('languagechange'));
}
