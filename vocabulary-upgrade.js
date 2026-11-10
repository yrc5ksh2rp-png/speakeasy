(function(){
const pack=window.SE_LEXICON,corpus=window.SE_EXAMPLES;
if(!pack||!corpus)return;
const topics=pack.topics,morph=pack.morphs;
const old=new Set(WORDS.map(w=>w.w));
GROUPS.push(...morph.map(({examples,...rest})=>rest));
for(const term of pack.words){
 if(old.has(term.w))continue;
 const affix=morph.find(m=>m.examples.includes(term.w));
 const parts=affix&&affix.kind==="前缀"&&term.w.startsWith(affix.id)?[affix.id,term.w.slice(affix.id.length)]:affix&&affix.kind==="后缀"&&term.w.endsWith(affix.id)?[term.w.slice(0,-affix.id.length),affix.id]:[term.w];
 const rx=new RegExp("\\b"+term.w+"\\b","i");
 const actual=corpus.filter(row=>rx.test(row[0])).slice(0,2).map(row=>[row[0],row[1]]);
 const practice=term.pos==="v"?[["I want to learn how to "+term.w+".","我想学习如何"+term.cn+"。"],["Can you explain how to "+term.w+"?","你能解释一下如何"+term.cn+"吗？"]]:[["What does '"+term.w+"' mean?","“"+term.w+"”是什么意思？"],["Can you use '"+term.w+"' in a sentence?","你能用“"+term.w+"”造一个句子吗？"]];
 WORDS.push({w:term.w,cn:term.cn,topic:term.topic,topicIcon:term.art,group:affix?.id||"core",parts,ipa:"",art:"topic",why:affix?"构词线索："+affix.piece+"（"+affix.name+"）。"+affix.note+" 实际词义以整词为准。":"高频日常词。结合场景和短句整体记忆，不必强行拆解。",examples:[...actual,...practice].slice(0,2),exampleSource:actual.length?"corpus":"practice"});
}
WORDS.slice(0,18).forEach(w=>w.topic="roots");
const previousArt=artSvg;
artSvg=function(w){
 if(w.art!=="topic")return previousArt(w);
 const t=topics.find(x=>x.id===w.topic)||{name:"英语口语"};
 return '<svg role="img" aria-label="'+esc(w.cn)+'场景插画" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 245"><rect width="420" height="245" fill="#dbecff"/><circle cx="78" cy="50" r="76" fill="#f0f8ff"/><circle cx="357" cy="205" r="86" fill="#d0e9e2"/><rect x="124" y="36" width="172" height="174" rx="34" fill="#ffffffbb"/><text x="210" y="148" text-anchor="middle" font-size="77">'+esc(w.topicIcon||"📚")+'</text><text x="210" y="188" text-anchor="middle" font-weight="bold" font-size="15" fill="#52779e">'+esc(t.name)+'</text></svg>';
};
getPool=function(){
 let pool=WORDS.filter(w=>(state.group==="all"||w.group===state.group||state.group==="topic:"+w.topic)&&(!state.search||[w.w,w.cn,w.why,...w.examples.flat()].join(" ").toLowerCase().includes(state.search)));
 if(state.mode==="review")pool=pool.filter(due);
 if(state.mode==="today"){const dueWords=pool.filter(due),unseen=pool.filter(w=>!state.progress[w.w]);pool=[...dueWords,...unseen.slice(0,Math.max(0,5-dueWords.length))].slice(0,Math.max(5,dueWords.length))}
 return pool;
};
let categoryTab="topics";
const categorySelections={topics:"all",affixes:"all"};
roots=function(){
 const btn=(id,label,sub,n)=>'<button class="root-btn '+(state.group===id?"active":"")+'" data-group="'+esc(id)+'"><span class="root-name"><strong>'+esc(label)+'</strong><small>'+esc(sub)+'</small></span><span class="count">'+n+'</span></button>';
 const list=categoryTab==="topics"
   ?topics.map(t=>btn("topic:"+t.id,t.icon+" "+t.name,"生活高频词",WORDS.filter(w=>w.topic===t.id).length)).join("")
   :GROUPS.map(g=>btn(g.id,g.piece,g.kind+" · "+g.name,WORDS.filter(w=>w.group===g.id).length)).join("");
 $("roots").innerHTML=btn("all","全部词汇","查看所有学习卡片",WORDS.length)+list;
 document.querySelectorAll("[data-category-tab]").forEach(button=>{
   const active=button.dataset.categoryTab===categoryTab;
   button.classList.toggle("active",active);
   button.setAttribute("aria-pressed",String(active));
 });
};
document.querySelector(".category-tabs").addEventListener("click",event=>{
 const button=event.target.closest("[data-category-tab]");
 if(!button||button.dataset.categoryTab===categoryTab)return;
 categorySelections[categoryTab]=state.group;
 categoryTab=button.dataset.categoryTab;
 state.group=categorySelections[categoryTab];
 state.hidden=false;
 state.notice="";
 render();
});
renderCard=function(){
 const pool=getPool(),w=WORDS.find(x=>x.w===state.selected);
 if(!w||!pool.some(x=>x.w===w.w)){$("card").innerHTML='<div class="glass empty"><strong>暂无待学习单词</strong>试试其他模式或类别。</div>';$("info").innerHTML="";return}
 const g=GROUPS.find(x=>x.id===w.group),p=state.progress[w.w],review=p&&p.due<=day();
 const topic=topics.find(x=>x.id===w.topic);
 const label=topic?topic.icon+" "+topic.name:"词根词缀";
 const grammar=g?g.piece+" · "+g.kind:"常用基础词";
 const breakdown=w.parts.map((part,i)=>'<span class="piece '+(i?"suffix":"")+'">'+esc(part)+'</span>'+(i<w.parts.length-1?'<span class="piece op">+</span>':"")).join("");
 const exampleNote=w.exampleSource==="corpus"?"例句引用 SpeakEasy 原有双语口语素材。":w.exampleSource==="practice"?"原句库暂无匹配：以下是单词学习练习问句。":"精选双语生活例句。";
 $("card").innerHTML='<article class="glass word-card"><div class="picture">'+artSvg(w)+'</div><div class="word-body">'+(state.hidden
 ?'<div class="eyebrow">主动回忆 · 看中文说英文</div><div class="cue"><span>英文已隐藏</span><strong>'+esc(w.cn)+'</strong><p>尝试说出英文单词，再说一句英语。</p></div><div class="progress-actions"><button class="action primary" data-reveal="1">查看答案</button></div>'
 :'<div class="word-header"><div><div class="eyebrow">'+esc(label)+' · '+esc(grammar)+'</div><div class="word-name">'+esc(w.w)+'</div><div class="phonetic">'+(w.ipa?esc(w.ipa):'点击按钮听发音')+'</div></div><button class="speak" data-speak="'+esc(w.w)+'">🔊 发音</button></div><div class="chinese">'+esc(w.cn)+'</div><div class="breakdown">'+breakdown+'</div><div class="explainer">'+esc(w.why)+'</div><div class="divider"></div><h3 class="section-title">💬 双语例句</h3><div class="examples">'+w.examples.map(ex=>'<div class="example"><div><strong>'+esc(ex[0])+'</strong><small>'+esc(ex[1])+'</small></div><button class="mini" data-speak="'+esc(ex[0])+'" aria-label="播放例句">🔊</button></div>').join("")+'</div><div class="feedback">'+esc(exampleNote)+'</div><div class="progress-actions"><button class="action" data-hide="1">🙈 遮住英文，自测</button><button class="action" data-grade="hard">还没记牢</button><button class="action primary" data-grade="easy">✓ 记住了</button></div><div class="feedback">'+(p?(review?'现在适合复习 · ':'已安排下次复习 · ')+'下次日期：'+esc(p.due):'理解词义并尝试开口后，再标记记忆程度。')+'</div>')+(state.notice?'<div class="feedback" role="status">'+esc(state.notice)+'</div>':"")+'</div></article>';
 $("info").innerHTML='<section class="glass panel side-card"><h2>🔍 构词与语境</h2><div class="root-big">'+esc(g?g.piece:(w.topicIcon||"📘"))+'</div><div class="eyebrow">'+esc(g?g.kind+" · "+g.name:label)+'</div><p>'+esc(g?g.note:"并非每个词都适合拆词根。日常核心词优先整体记忆。")+'</p><div class="tip"><b>记忆线索</b><div>'+esc(w.why)+'</div></div></section><section class="glass panel side-card"><h2>🧠 低负担记忆</h2><p>① 看场景图理解意思</p><p>② 听双语句子</p><p>③ 隐藏英文进行主动回忆</p><p>④ 根据记忆情况安排复习</p><div class="prompt">新增单词使用内置场景 SVG 插画，不是单词专属照片。每日最多新增 5 词，旧词优先复习。</div></section>';
};
document.querySelector(".hero p").textContent="500 个日常词汇 · 20 个生活场景 · 41 个构词线索 · 例句、插画与间隔复习";
document.querySelector(".side h2").textContent="📚 词汇分类";
render();
})();