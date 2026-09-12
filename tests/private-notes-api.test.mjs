import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync, createHmac } from 'node:crypto';
import handler from '../api/private-notes.js';
const env={...process.env}, originalFetch=globalThis.fetch;
const hash='a'.repeat(32)+':'+scryptSync('test-passcode','a'.repeat(32),64).toString('hex');
let ip=0;
afterEach(()=>{globalThis.fetch=originalFetch;for(const k of Object.keys(process.env))if(!(k in env))delete process.env[k];Object.assign(process.env,env);});
async function call(action='session',method='GET',body,headers={},query={}){
 Object.assign(process.env,{SUPABASE_URL:'https://test.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test',NOTES_PASSCODE_HASH:hash,NODE_ENV:'production'});
 const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(data){this.data=data;return this}};
 await handler({method,query:{action,...query},body,headers:{host:'portfolio.test',origin:'https://portfolio.test','content-type':'application/json','x-real-ip':String(++ip),...headers}},res);return res;
}
async function login(){const r=await call('login','POST',{password:'test-passcode'});assert.equal(r.code,200);return r.headers['Set-Cookie'][0].split(';')[0]}
function mock(){const calls=[];globalThis.fetch=async(url,opt)=>{calls.push({url,opt});return opt.method==='HEAD'?new Response(null,{headers:{'content-range':'0-0/1'}}):new Response(JSON.stringify([{id:'e6ab057d-73d0-4839-9d0e-5c0172052f00',note:'hello'}]));};return calls;}
test('correct passcode creates secure cookie without Supabase Auth',async()=>{globalThis.fetch=()=>{throw Error('Auth must not be called')};const r=await call('login','POST',{password:'test-passcode'});assert.equal(r.code,200);assert.match(r.headers['Set-Cookie'][0],/HttpOnly; SameSite=Strict/);assert.match(r.headers['Set-Cookie'][0],/Secure/);assert.deepEqual(r.data,{authorized:true});});
test('incorrect passcode denied',async()=>assert.equal((await call('login','POST',{password:'wrong'})).code,401));
test('login throttles repeat failures',async()=>{for(let n=0;n<5;n++)assert.equal((await call('login','POST',{password:'wrong'},{'x-real-ip':'throttle'})).code,401);assert.equal((await call('login','POST',{password:'wrong'},{'x-real-ip':'throttle'})).code,429)});
test('unauthenticated CRUD never touches database',async()=>{const calls=mock();for(const [a,m]of[['notes','GET'],['update','PATCH'],['delete','DELETE']])assert.equal((await call(a,m,{})).code,404);assert.equal(calls.length,0)});
test('tampered cookies denied',async()=>{const c=await login();assert.equal((await call('session','GET',null,{cookie:c+'a'})).code,404)});
test('expired signed cookie denied',async()=>{const payload='1.'+'b'.repeat(48);const sig=createHmac('sha256','sb_secret_test').update(hash+':'+payload).digest('hex');assert.equal((await call('session','GET',null,{cookie:'nourah_notes_session='+payload+'.'+sig})).code,404)});
test('authenticated listing uses server key and pagination',async()=>{const cookie=await login(),calls=mock();const r=await call('notes','GET',null,{cookie},{filter:'new',offset:50});assert.equal(r.code,200);assert.equal(calls.length,3);assert.ok(calls.every(c=>c.opt.headers.apikey==='sb_secret_test'));assert.match(calls[0].url,/offset=50&is_read=eq.false/);assert.equal(r.data.total,1)});
test('message edits and unconfirmed deletion rejected',async()=>{const cookie=await login(),calls=mock(),id='e6ab057d-73d0-4839-9d0e-5c0172052f00';assert.equal((await call('update','PATCH',{id,note:'bad'},{cookie})).code,400);assert.equal((await call('delete','DELETE',{id},{cookie})).code,400);assert.equal(calls.length,0)});
test('metadata update and confirmed delete work',async()=>{const cookie=await login(),calls=mock(),id='e6ab057d-73d0-4839-9d0e-5c0172052f00';assert.equal((await call('update','PATCH',{id,is_read:true},{cookie})).code,200);assert.equal((await call('delete','DELETE',{id,confirm:true},{cookie})).code,200);assert.deepEqual(JSON.parse(calls[0].opt.body),{is_read:true})});
test('cross origin mutations blocked',async()=>{for(const[a,m]of[['login','POST'],['logout','POST'],['update','PATCH'],['delete','DELETE']])assert.equal((await call(a,m,{}, {origin:'https://evil.test'})).code,403)});
test('logout clears session and old refresh cookie',async()=>{const r=await call('logout','POST');assert.equal(r.code,200);assert.ok(r.headers['Set-Cookie'].every(c=>c.includes('Max-Age=0')))});
