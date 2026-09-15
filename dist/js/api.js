import {config} from './config.js';
export const configured=()=>/^https:\/\//.test(config.supabaseUrl)&&Boolean(config.supabasePublishableKey);
export async function intake(body){
 if(!configured())throw Error('noBackend');
 const response=await fetch(config.supabaseUrl.replace(/\/$/,'')+'/functions/v1/intake',{method:'POST',headers:{apikey:config.supabasePublishableKey,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error('error');return response.json();
}
