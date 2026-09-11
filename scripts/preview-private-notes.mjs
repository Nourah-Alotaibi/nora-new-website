// Local-only preview of the existing Vercel function. No mock login or bypass.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from '../api/private-notes.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=express();
app.use('/api/private-notes',express.json({limit:'8kb'}),handler);
app.use('/api',(_req,res)=>res.status(404).json({error:'Not found'}));
app.use(express.static(path.join(root,'dist/public')));
app.get('*',(_req,res)=>{res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');res.sendFile(path.join(root,'dist/public/index.html'));});
app.listen(3004,'127.0.0.1',()=>console.log('Local private-page preview: http://127.0.0.1:3004'));
