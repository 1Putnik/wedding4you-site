import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import assert from 'node:assert/strict';

const root=resolve(import.meta.dirname,'..');
function htmlFiles(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?htmlFiles(join(dir,entry.name)):entry.name.endsWith('.html')?[join(dir,entry.name)]:[]);}
const files=htmlFiles(root);
let headers=0;
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
 assert.doesNotMatch(html,/<(?:form|input|script|iframe)\b/i,`no active account, payment or upload UI in ${rel}`);
 assert.doesNotMatch(html,/href="https?:\/\/(?:www\.)?(?:paypal|sandbox\.paypal)/i,`no checkout in ${rel}`);
 for(const [,src] of html.matchAll(/<img[^>]+src="([^"]+)"/g))assert.ok(existsSync(resolve(dirname(join(root,rel)),src)),`image ${src} exists in ${rel}`);
 assert.match(html,/href="(?:\.\.\/){1,2}guide\.html"/,`current service link in ${rel}`);
}
console.log(`Checked ${headers} header links and both prelaunch app entries.`);
