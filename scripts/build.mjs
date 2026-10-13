import {mkdir,copyFile,cp,access} from 'node:fs/promises';
import {projects,experiments} from '../data.js';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','styles.css','app.js','data.js','interactions.js']) await copyFile(f,`dist/${f}`);
await cp('public','dist',{recursive:true});
try {await access('node_modules/@google/model-viewer/dist/model-viewer.min.js');await mkdir('dist/vendor',{recursive:true});await copyFile('node_modules/@google/model-viewer/dist/model-viewer.min.js','dist/vendor/model-viewer.min.js');} catch {console.log('模型依赖未安装；无模型页面可正常浏览，启用模型前运行 npm install。');}
for(const p of [...projects,...experiments]){await mkdir(`dist/work/${p.slug}`,{recursive:true});await copyFile('index.html',`dist/work/${p.slug}/index.html`);}
console.log('Built dist/ — home and project routes ready.');
