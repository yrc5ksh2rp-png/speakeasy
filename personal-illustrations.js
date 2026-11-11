/* SpeakEasy user-owned, private image imports. No images are transmitted or bundled with the public site. */
(()=>{
"use strict";
const DB="speakeasy-personal-images-v1", STORE="art";
let dbPromise=null;
function db(){
 if(!window.indexedDB)return Promise.reject(new Error("浏览器不支持本地图片存储"));
 if(!dbPromise)dbPromise=new Promise((ok,fail)=>{
  const r=indexedDB.open(DB,1);
  r.onupgradeneeded=()=>r.result.createObjectStore(STORE);
  r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error);
 });
 return dbPromise;
}
async function count(){
 const d=await db();
 return new Promise((ok,fail)=>{const r=d.transaction(STORE).objectStore(STORE).count();r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)});
}
async function read(word){
 const d=await db();
 return new Promise((ok,fail)=>{const r=d.transaction(STORE).objectStore(STORE).get(word);r.onsuccess=()=>ok(r.result||null);r.onerror=()=>fail(r.error)});
}
async function save(entries){
 const d=await db();
 return new Promise((ok,fail)=>{
  const tr=d.transaction(STORE,"readwrite"),s=tr.objectStore(STORE);
  for(const [word,asset] of entries)s.put(asset,word);
  tr.oncomplete=ok;tr.onerror=()=>fail(tr.error);tr.onabort=()=>fail(tr.error);
 });
}
async function clear(){
 const d=await db();
 return new Promise((ok,fail)=>{const tr=d.transaction(STORE,"readwrite");tr.objectStore(STORE).clear();tr.oncomplete=ok;tr.onerror=()=>fail(tr.error)});
}
const input=document.getElementById("search"),side=input?.closest("aside");
if(!side)return;
const style=document.createElement("style");
style.textContent=".se-art-panel{margin:10px 0 16px;padding:11px;border:1px solid #dbe6f5;border-radius:14px;background:#f5f9ff}.se-art-panel b{font-size:12px;color:#4a749f}.se-art-panel small{display:block;font-size:11px;color:#7b8ba2;line-height:1.6;margin-top:7px}.se-art-buttons{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.se-art-buttons button{border:1px solid #dbe6f2;border-radius:9px;background:white;padding:8px 10px;color:#3479b6;font-weight:700;font-size:12px}#detail .picture.se-has-art{display:flex;gap:13px;align-items:center}#detail .picture.se-has-art .emoji{display:none}#detail .picture.se-has-art img{width:140px;max-width:45%;height:155px;object-fit:contain;background:white;border-radius:12px}#card .picture.se-has-art svg{display:none}#card .picture.se-has-art img{height:220px;width:100%;object-fit:contain;padding:10px;background:#f9fbff}";
document.head.appendChild(style);
const panel=document.createElement("div");
panel.className="se-art-panel";
panel.innerHTML='<b>🖼️ 个人插图记忆包</b><div class="se-art-buttons"><button type="button" id="se-art-import">导入图片包</button><button type="button" id="se-art-delete">清空图片</button></div><input type="file" id="se-art-file" accept=".json,application/json" hidden><small id="se-art-status" role="status">图片只保存在此浏览器，不上传到 GitHub。</small>';
input.insertAdjacentElement("afterend",panel);
const status=panel.querySelector("#se-art-status"),file=panel.querySelector("#se-art-file");
const imageCache=new Map();
function currentWord(){return document.querySelector("#detail .word")?.textContent?.trim().toLowerCase()||document.querySelector("#card .word-name")?.textContent?.trim().toLowerCase()||""}
function imageArea(){return document.querySelector("#detail .picture")||document.querySelector("#card .picture")}
let request=0;
async function sync(){
 const word=currentWord(),area=imageArea();
 if(!word||!area||area.dataset.seArtWord===word)return;
 const token=++request;
 let art;
 try{if(imageCache.has(word))art=imageCache.get(word);else{art=await read(word);imageCache.set(word,art)}}catch{return}
 if(token!==request||currentWord()!==word||!area.isConnected||!art?.data)return;
 area.dataset.seArtWord=word;area.classList.add("se-has-art");
 const image=document.createElement("img");
 image.alt=word+" 的个人记忆插图";image.src=art.data;image.loading="lazy";image.decoding="async";
 area.prepend(image);
}
let queued=false;
function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync()})}
const canvas=document.getElementById("detail")||document.getElementById("card");
if(canvas)new MutationObserver(schedule).observe(canvas,{childList:true,subtree:true});
async function showCount(){try{status.textContent="此浏览器已保存 "+(await count())+" 张私人记忆图。"}catch(e){status.textContent="无法使用本地图片存储："+e.message}}
panel.querySelector("#se-art-import").addEventListener("click",()=>file.click());
file.addEventListener("change",async()=>{
 const picked=file.files?.[0];if(!picked)return;
 status.textContent="正在导入…";
 try{
  if(picked.size>12*1024*1024)throw new Error("个人包不能超过 12MB");
  const pack=JSON.parse(await picked.text());
  if(pack.format!=="speakeasy-personal-illustrations-v1"||!pack.images||typeof pack.images!=="object")throw new Error("不支持此图片包格式");
  const entries=Object.entries(pack.images);
  if(entries.length===0||entries.length>2000)throw new Error("图片数量异常");
  for(const [word,asset] of entries){
    if(!/^[a-z][a-z'-]*$/.test(word)||typeof asset?.data!=="string"||!asset.data.startsWith("data:image/webp;base64,"))throw new Error("单词或图片格式不正确");
  }
  await save(entries);
  imageCache.clear();
  const area=imageArea();
  if(area){area.dataset.seArtWord="";area.querySelector("img")?.remove();area.classList.remove("se-has-art")}
  status.textContent="成功导入 "+entries.length+" 张图，仅本地可见。";
  schedule();
 }catch(e){status.textContent="导入失败："+e.message}
 file.value="";
});
panel.querySelector("#se-art-delete").addEventListener("click",async()=>{
 if(!window.confirm("确定清空当前浏览器里的私人插图？不会删除学习进度。"))return;
 try{await clear();imageCache.clear();const area=imageArea();area?.querySelector("img")?.remove();area?.classList.remove("se-has-art");if(area)area.dataset.seArtWord="";await showCount()}catch(e){status.textContent="删除失败："+e.message}
});
showCount();schedule();
})();