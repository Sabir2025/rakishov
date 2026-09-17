import {language} from './i18n.js';
// Visit analytics are disabled. Removing the prompt must not imply consent,
// including for visitors who opted in to an earlier version of the site.
export const getSession=()=>null;
export const consent=()=>'no';
export async function track(){}
export function attribution(){const u=new URL(location.href);let ref='';try{ref=new URL(document.referrer).hostname}catch{};const clean=v=>String(v||'').replace(/[^\p{L}\p{N} ._\-]/gu,'').slice(0,100);const us=clean(u.searchParams.get('utm_source')),rm=ref.toLowerCase();const source=us||(/google\./.test(rm)?'Google':/instagram/.test(rm)?'Instagram':/t\.me|telegram/.test(rm)?'Telegram':/whatsapp|wa\.me/.test(rm)?'WhatsApp':ref?'Other':'Direct');return {source,utm_source:us,utm_medium:clean(u.searchParams.get('utm_medium')),utm_campaign:clean(u.searchParams.get('utm_campaign')),referrer:ref,landing_page:location.pathname.slice(0,300),device_type:matchMedia('(max-width:650px)').matches?'mobile':'desktop',language}}
// Attribution stays in memory; no personal form text or contact is persisted in browser storage.
export const firstTouch=attribution();
export function initTracking(){document.addEventListener('click',e=>{const a=e.target.closest('[data-event]');if(a)track(a.dataset.event);const p=e.target.closest('[data-project]');if(p?.tagName==='A')track('project_view',{project:p.dataset.project})});track('page_view');if(document.body.dataset.project)track('case_study_open',{project:document.body.dataset.project})}
