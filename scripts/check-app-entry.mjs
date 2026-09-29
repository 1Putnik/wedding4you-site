import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import assert from 'node:assert/strict';

const root=resolve(import.meta.dirname,'..');
function htmlFiles(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?htmlFiles(join(dir,entry.name)):entry.name.endsWith('.html')?[join(dir,entry.name)]:[]);}
const files=htmlFiles(root);
let headers=0;
const hostedButtonsSdk='https://www.paypal.com/sdk/js?client-id=BAAh84TNN7Ya-lShAfdg8jNKuXNzthvISujKpI6c8cekIJaClIsyymgmRqWvR7s5kNRa5VuMzdVfDUx6zo&components=hosted-buttons&disable-funding=venmo&currency=ILS';
const hostedButtonsCall="paypal.HostedButtons({hostedButtonId:'UEQ8YVM65ZMTY'}).render('#paypal-container-UEQ8YVM65ZMTY');";
for(const path of files){
 const html=readFileSync(path,'utf8');if(!html.includes('class="shared-header"'))continue;headers++;
 const links=[...html.matchAll(/<a\s+class="login-link"\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
 assert.equal(links.length,1,`one login link in ${path}`);
 assert.equal(links[0][1],'app/',`local language route in ${path}`);
 assert.equal(links[0][2],path.includes(`${join(root,'ru')}${process.platform==='win32'?'\\':'/'}`)?'Войти':'כניסה',`language in ${path}`);
 assert.ok(existsSync(join(dirname(path),'app','index.html')),`login route resolves from ${path}`);
}
assert.equal(headers,31,'all shared site headers are covered');
for(const rel of ['app/index.html','ru/app/index.html']){
 const html=readFileSync(join(root,rel),'utf8');
 assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
 assert.doesNotMatch(html,/<(?:form|input|iframe)\b/i,`no custom form, inputs or iframe in ${rel}`);
 const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
 assert.equal(scripts.length,2,`one official SDK loader and one hosted-button call in ${rel}`);
 assert.equal(scripts[0][1].trim(),`src="${hostedButtonsSdk.replaceAll('&','&amp;')}"`,`exact official PayPal SDK URL in ${rel}`);
 assert.equal(scripts[0][2].trim(),'');
 assert.equal(scripts[1][1].trim(),'');
 assert.equal(scripts[1][2].trim(),hostedButtonsCall,`fixed hosted button ID and target in ${rel}`);
 assert.equal((html.match(/id="paypal-container-UEQ8YVM65ZMTY"/g)||[]).length,1,`one fixed hosted-button container in ${rel}`);
 assert.doesNotMatch(html,/href="https?:\/\/(?:www\.)?(?:paypal|sandbox\.paypal)/i,`no standalone PayPal checkout link in ${rel}`);
 if(rel==='ru/app/index.html'){
  assert.match(html,/₪1 000/);assert.match(html,/Сборы Utah County не включены и оплачиваются отдельно/);
  assert.match(html,/не открываются автоматически/);assert.match(html,/вручную оформляет приглашение/);
 }else{
  assert.match(html,/₪1,000/);assert.match(html,/אגרות Utah County אינן כלולות ומשולמות בנפרד/);
  assert.match(html,/אינן נפתחות אוטומטית/);assert.match(html,/מטפל בהזמנה ידנית/);
 }
 for(const [,src] of html.matchAll(/<img[^>]+src="([^"]+)"/g))assert.ok(existsSync(resolve(dirname(join(root,rel)),src)),`image ${src} exists in ${rel}`);
 assert.match(html,/href="(?:\.\.\/){1,2}guide\.html"/,`current service link in ${rel}`);
}
console.log(`Checked ${headers} header links and both prelaunch app entries.`);
