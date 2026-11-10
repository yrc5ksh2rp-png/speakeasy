(()=>{
"use strict";
const lex=window.SE_LEXICON||{words:[],morphs:[],topics:[]},corpus=window.SE_EXAMPLES||[];
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const SOURCES={
core:["https://cdn.jsdelivr.net/gh/kami-mura/ngsl-wordlists@main/ngsl.csv","https://raw.githubusercontent.com/kami-mura/ngsl-wordlists/main/ngsl.csv"],
sup:["https://cdn.jsdelivr.net/gh/kami-mura/ngsl-wordlists@main/ngsl_supplementary.csv","https://raw.githubusercontent.com/kami-mura/ngsl-wordlists/main/ngsl_supplementary.csv"],
extended:["https://cdn.jsdelivr.net/gh/kami-mura/ngsl-wordlists@main/ngsl_sfi_31k.csv","https://raw.githubusercontent.com/kami-mura/ngsl-wordlists/main/ngsl_sfi_31k.csv"]
};
const METHODS=[
{id:"chunks",icon:"💬",name:"高频词块",desc:"整体记搭配"},
{id:"morph",icon:"🧩",name:"词根词缀",desc:"有依据地拆词"},
{id:"visual",icon:"🖼️",name:"画面联想",desc:"形象事物"},
{id:"contrast",icon:"↔️",name:"对比辨析",desc:"容易混淆"},
{id:"family",icon:"🌳",name:"词族联系",desc:"关联派生"},
{id:"context",icon:"🎬",name:"情景语境",desc:"放入对话"}
];
const phrasal={
get:"get ready · get along · get home",take:"take a break · take a look",make:"make a decision · make sure",have:"have a good time · have lunch",do:"do your best · do the dishes",go:"go home · go ahead",come:"come back · come over",put:"put on · put away",turn:"turn on · turn off",look:"look for · look after",give:"give up · give it a try",keep:"keep going · keep in touch",bring:"bring it back · bring along",run:"run out of · run into",break:"take a break · break down",pick:"pick up · pick out",set:"set up · set aside",work:"work on · work out",try:"give it a try · try again",feel:"feel better · feel like",think:"think about · think of",say:"say hello · say sorry",tell:"tell the truth · tell me",know:"get to know · know about",see:"see you later · see what happens",help:"help out · ask for help",need:"need to · in need of",want:"want to · want some",like:"feel like · look like",would:"would like to · would rather",could:"could you · could be",should:"should have · should I",can:"can I · can't wait",will:"will do · will be",might:"might be · might have",must:"must be · must have",be:"be able to · be going to",if:"what if · even if",and:"and then · and so on",but:"but still · all but",or:"or else · either ... or",about:"how about · what about",for:"for now · for example",at:"at first · at least",in:"in fact · in time",on:"on time · on the way",to:"have to · want to",of:"a lot of · kind of",with:"with you · deal with",as:"as soon as · as long as",that:"that's why · that's right",this:"this time · this way",there:"there is · over there",here:"right here · come here",some:"some of · some time",any:"any time · any idea",all:"all day · after all",more:"more than · one more",most:"most of · at most",much:"too much · much better",little:"a little bit · little by little",few:"a few · quite a few",many:"how many · too many",time:"on time · in time",day:"all day · day off",one:"one more · one by one",way:"by the way · on my way",kind:"kind of · what kind",right:"right now · all right",just:"just a moment · just in case",really:"not really · really good",even:"even if · even though",then:"back then · and then",only:"not only · only if",still:"still here · still waiting",already:"already done · already here",again:"try again · once again",now:"right now · now that",back:"come back · back home"
};
const pairs={borrow:"lend",lend:"borrow",bring:"take",accept:"refuse",refuse:"accept",buy:"sell",sell:"buy",say:"tell",tell:"say",hear:"listen",listen:"hear",few:"little",little:"few",many:"much",much:"many",do:"make",make:"do",remember:"forget",forget:"remember",teach:"learn",learn:"teach",win:"lose",lose:"win",rise:"raise",raise:"rise",fun:"funny",funny:"fun",job:"work",work:"job",price:"cost",cost:"price",look:"see",see:"look",speak:"talk",talk:"speak",answer:"reply",reply:"answer",high:"tall",tall:"high",hard:"difficult",difficult:"hard",actual:"current",current:"actual",latter:"later",later:"latter",less:"fewer",fewer:"less",last:"latest",latest:"last",alone:"lonely",lonely:"alone",especially:"specially",specially:"especially",hope:"wish",wish:"hope",big:"large",large:"big",small:"little",good:"well",well:"good",bad:"worse",worse:"bad",other:"another",another:"other",affect:"effect",effect:"affect",than:"then",then:"than",advice:"advise",advise:"advice",quiet:"quite",quite:"quiet"};
const visuals="apple banana orange bread egg soup fish chicken potato vegetable carrot tomato onion garlic rice noodle beef pork coffee tea water milk juice cake dessert pizza sandwich salad salt sugar pepper bowl plate cup glass spoon fork knife pot pan stove oven refrigerator fridge door window wall floor ceiling table chair sofa bed pillow blanket key phone laptop computer keyboard mouse screen camera photo video car bus taxi train airplane plane airport ticket passport suitcase luggage bag wallet coat shirt pants shoes socks hat jacket watch clock umbrella glasses mirror toothbrush toothpaste towel soap shampoo house apartment room kitchen bathroom bedroom hotel restaurant school office shop store supermarket hospital doctor nurse park garden flower tree grass mountain river lake sea beach ocean sun moon star cloud rain snow storm wind sky bird cat dog horse cow sheep fish insect bee butterfly baby child people family mother father friend neighbor teacher student book paper pencil pen notebook letter magazine newspaper money cash receipt card charger battery bicycle bike road street bridge station map chair bus stop stairs elevator lamp light music guitar piano television tv radio speaker microphone phone camera photograph".split(" ");
const visualSet=new Set(visuals);
const icons={apple:"🍎",banana:"🍌",orange:"🍊",coffee:"☕",tea:"🫖",water:"💧",food:"🍽️",bread:"🍞",egg:"🥚",rice:"🍚",noodle:"🍜",pizza:"🍕",soup:"🥣",restaurant:"🍽️",kitchen:"🍳",cake:"🍰",phone:"📱",computer:"💻",laptop:"💻",keyboard:"⌨️",camera:"📷",photo:"📸",car:"🚗",bus:"🚌",train:"🚆",plane:"✈️",airplane:"✈️",airport:"🛫",passport:"🛂",hotel:"🏨",ticket:"🎫",bag:"👜",wallet:"👛",money:"💵",sun:"☀️",moon:"🌙",star:"⭐",cloud:"☁️",rain:"🌧️",snow:"❄️",tree:"🌳",flower:"🌼",mountain:"⛰️",beach:"🏖️",dog:"🐕",cat:"🐈",bird:"🐦",house:"🏡",home:"🏠",door:"🚪",key:"🔑",bed:"🛏️",book:"📖",pencil:"✏️",teacher:"🧑‍🏫",doctor:"👩‍⚕️",hospital:"🏥",chair:"🪑",clock:"🕒"};
const familyClusters=[
"act action active activity actor","help helpful helpless helper","use useful useless user","care careful careless caring","happy unhappy happiness","hope hopeful hopeless","employ employee employer employment unemployed","create creative creation creator","work worker working workplace","play player playful replay","build rebuild builder building","write rewrite writer writing","read reader reading unread","agree disagree agreement","appear disappear appearance","connect disconnect connection","inform information informal","communicate communication communicator","decide decision decisive","invite invitation inviting","educate education educator educational","nation national international","friend friendly friendship unfriendly","value valuable invaluable","comfort comfortable uncomfortable","move movement remove","develop development developer","improve improvement","pay payment repay","possible impossible possibility","regular irregular regularly","safe safety unsafe","organize organization","simple simplify simply","beauty beautiful beautifully","success successful successfully","succeed success successful","visit visitor visiting","drive driver driving","speak speaker speaking","teach teacher teaching","listen listener listening","predict prediction predictable","produce producer production product","photograph photographer photography","nation national international"
].map(s=>s.split(" "));
const irregular={be:"am · is · are · was · were · been",go:"go · went · gone",get:"get · got · got/gotten",take:"take · took · taken",make:"make · made · made",come:"come · came · come",have:"have · had · had",do:"do · did · done",see:"see · saw · seen",say:"say · said · said",give:"give · gave · given",know:"know · knew · known",think:"think · thought · thought",find:"find · found · found",buy:"buy · bought · bought",bring:"bring · brought · brought",write:"write · wrote · written",read:"read · read · read（拼写相同，读音变化）",speak:"speak · spoke · spoken",eat:"eat · ate · eaten",drink:"drink · drank · drunk",drive:"drive · drove · driven",run:"run · ran · run",break:"break · broke · broken",choose:"choose · chose · chosen",feel:"feel · felt · felt",keep:"keep · kept · kept",sleep:"sleep · slept · slept",leave:"leave · left · left",meet:"meet · met · met",tell:"tell · told · told",sell:"sell · sold · sold",teach:"teach · taught · taught",hear:"hear · heard · heard",understand:"understand · understood · understood"};
const methodNotes={
chunks:"不要只记一个中文意思；重点把词和高频搭配一起开口说出来。",
morph:"观察可以核实的前缀、后缀或词根关系。不是所有外形相似的词都能这样拆。",
visual:"把具体事物与画面、英语名称联系起来，然后试着遮住英文回忆。",
contrast:"两个单词放在一起对比含义与使用场景。不要只背中文同义词。",
family:"把常用的派生词一起看，但学习进度仍以每个词条为单位。",
context:"不强求拆词，把完整短句作为记忆单位，理解语境再开口复述。"};
const LS="speakeasy-3000-progress-v1";
let progress={};try{progress=JSON.parse(localStorage.getItem(LS)||"{}")||{}}catch{}
const state={words:[],chosen:null,mode:"today",method:"all",query:"",limit:24,hidden:false,loading:true,source:"",message:"",glosses:{}};
const localWordMap=new Map(lex.words.map(x=>[x.w.toLowerCase(),x]));
const morphMap=new Map();
for(const m of lex.morphs){for(const word of m.examples)morphMap.set(word.toLowerCase(),m);}
const GLOSS_URLS=["https://cdn.jsdelivr.net/gh/imfiiish/wordlists@main/data/en/definitions.json","https://raw.githubusercontent.com/imfiiish/wordlists/main/data/en/definitions.json"];
function decodeGloss(value){
 if(value===undefined||value===null)return "";
 const found=[];
 function scan(node,depth){
  if(depth>4||found.length>=12)return;
  if(typeof node==="string"){if(/[\u3400-\u9fff]/.test(node))found.push(node.replace(/\s+/g," ").trim());return}
  if(Array.isArray(node)){for(const value of node.slice(0,6))scan(value,depth+1);return}
  if(node&&typeof node==="object"){
   for(const key of ["translation","translations","zh","cn","chinese","gloss","glosses","meaning","meanings","definitions","senses"]){if(key in node)scan(node[key],depth+1)}
  }
 }
 scan(value,0);
 return found[0]?.slice(0,110)||"";
}
async function fillGlosses(){
 const text=await fetchText(GLOSS_URLS);
 if(!text)return;
 try{
  const dic=JSON.parse(text);
  let added=0;
  for(const item of state.words){
   if(item.cn)continue;
   const gloss=decodeGloss(dic[item.w]??dic[item.w.toLowerCase()]);
   if(gloss){item.cn=gloss;added++}
  }
  if(added)render();
 }catch(e){}
}
const corpusByWord=new Map();
for(const sentence of corpus){
 const used=new Set((sentence[0].match(/[a-z]+(?:'[a-z]+)?/gi)||[]).map(w=>w.toLowerCase()));
 for(const w of used){if(!corpusByWord.has(w))corpusByWord.set(w,[]);if(corpusByWord.get(w).length<3)corpusByWord.get(w).push(sentence)}
}
function isoDay(add=0){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+add);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
function csvRows(text){return text.replace(/^\ufeff/,"").trim().split(/\r?\n/).slice(1).map(line=>line.split(",")[0].replace(/^"|"$/g,"").trim().toLowerCase()).filter(w=>/^[a-z][a-z'-]*$/.test(w))}
async function fetchText(urls){
 for(const url of urls){
  try{
   const controller=new AbortController(),tm=setTimeout(()=>controller.abort(),12000);
   let r;try{r=await fetch(url,{signal:controller.signal})}finally{clearTimeout(tm)}
   if(!r.ok)continue;
   const str=await r.text();
   if(str&&str.length>200)return str;
  }catch(e){}
 }
 return "";
}
function morphInfo(word,set){
 const known=morphMap.get(word);
 if(known){
  let parts=[word],kind=known.kind;
  if(kind==="前缀"&&word.startsWith(known.id))parts=[known.id,word.slice(known.id.length)];
  else if(kind==="后缀"&&word.endsWith(known.id))parts=[word.slice(0,-known.id.length),known.id];
  return {parts,hint:known.note,group:known.piece};
 }
 const prefixes=["un","re","dis","mis","pre","non","over","under","inter"];
 for(const aff of prefixes){if(word.length>aff.length+3&&word.startsWith(aff)&&set.has(word.slice(aff.length))){
   return {parts:[aff,word.slice(aff.length)],group:aff+"-",hint:"词前 "+aff+"- 可以提供理解线索；要结合完整词义使用。"};
 }}
 const suffixes=["less","ful","ness","able","ment","ly","er","y"];
 for(const aff of suffixes){if(word.length>aff.length+3&&word.endsWith(aff)&&set.has(word.slice(0,-aff.length))){
  return {parts:[word.slice(0,-aff.length),aff],group:"-"+aff,hint:"后缀 -"+aff+" 与词性或语义变化有关，整词意义仍要在例句中确认。"};
 }}
 return null;
}
function familyInfo(word,set){
 const families=familyClusters.filter(group=>group.includes(word)).map(group=>group.filter(w=>set.has(w)));
 if(families.length)return families.sort((a,b)=>b.length-a.length)[0];
 const related=[word];
 for(const suffix of ["s","es","ed","ing","er","ness","ful","less","ment","able","ly"]){const candidate=word+suffix;if(set.has(candidate))related.push(candidate);}
 return related.length>=3?related:null;
}
function classify(word,set){
 const morph=morphInfo(word,set),rel=familyInfo(word,set);
 if(pairs[word]&&set.has(pairs[word]))return {id:"contrast",pair:pairs[word],rel,morph,clue:word+" ↔ "+pairs[word]};
 if(phrasal[word])return {id:"chunks",pair:null,rel,morph,clue:phrasal[word]};
 if(morph&&morph.parts.length>1)return {id:"morph",pair:null,rel,morph,clue:morph.parts.join(" + ")};
 if(visualSet.has(word)||icons[word])return {id:"visual",pair:null,rel,morph,clue:"先想画面，再说出英文。"};
 if(rel&&rel.length>=2)return {id:"family",pair:null,rel,morph,clue:rel.join(" · ")};
 const lines=corpusByWord.get(word)||[];
 return {id:"context",pair:null,rel,morph,clue:lines[0]?.[0]||"先整体记词义，再寻找日常使用场景。"};
}
async function load(){
 const raw=await fetchText(SOURCES.core);
 if(!raw){state.loading=false;state.message="高频来源暂时无法读取。请检查网络并点击重试；为避免虚构数量，暂不显示 3,000 词。";render();return}
 const core=csvRows(raw),map=new Map();
 const put=(w,origin)=>{if(!map.has(w))map.set(w,{w,origin,rank:map.size+1,cn:localWordMap.get(w)?.cn||""})};
 core.forEach(w=>put(w,"NGSL"));
 const extra=await fetchText(SOURCES.sup);
 if(extra)csvRows(extra).forEach(w=>put(w,"Supplementary"));
 // Keep the existing SpeakEasy practical cards discoverable alongside NGSL.
 for(const w of lex.words){if(map.size>=3000)break;put(w.w.toLowerCase(),"SpeakEasy")}
 if(map.size<3000){
  const extension=await fetchText(SOURCES.extended);
  if(extension)for(const word of csvRows(extension)){if(map.size>=3000)break;put(word,"Frequency supplement")}
 }
 state.words=[...map.values()].slice(0,3000);
 const set=new Set(state.words.map(x=>x.w));
 for(const w of state.words)w.memory=classify(w.w,set);
 state.source=core.length+" 个 NGSL 基础词条 + "+Math.max(0,state.words.length-core.length)+" 个补充词条";
 state.loading=false;
 if(state.words.length<3000)state.message="目前已加载 "+state.words.length+" 个有来源的词条。补充词表不可用，因此未虚构剩余词条。";
 render();
 fillGlosses();
}
function studied(w){return progress[w]?.level>0}
function due(w){return progress[w]&&progress[w].due<=isoDay()}
function filtered(){
 let a=state.words.filter(x=>(state.method==="all"||x.memory.id===state.method)&&(!state.query||[x.w,x.cn,x.memory.clue].join(" ").toLowerCase().includes(state.query)));
 if(state.mode==="review")return a.filter(x=>due(x.w));
 if(state.mode==="today"){const pending=a.filter(x=>due(x.w)),newcomers=a.filter(x=>!progress[x.w]);return [...pending,...newcomers.slice(0,Math.max(0,5-pending.length))];}
 return a;
}
function stats(){
 const done=state.words.filter(x=>studied(x.w)).length,pending=state.words.filter(x=>due(x.w)).length;
 $("stats").innerHTML=[[""+state.words.length,"已加载词条"],[""+done,"已学"],[""+pending,"待复习"]].map(([n,name])=>'<div class="stat"><b>'+n+'</b><small>'+name+'</small></div>').join("");
}
function renderMethods(){
 const counts={};for(const w of state.words)counts[w.memory.id]=(counts[w.memory.id]||0)+1;
 $("methods").innerHTML='<button class="method '+(state.method==="all"?"active":"")+'" data-method="all"><span>📚 全部记忆策略</span><b>'+state.words.length+'</b></button>'+METHODS.map(m=>'<button class="method '+(state.method===m.id?"active":"")+'" data-method="'+m.id+'"><span>'+m.icon+" "+m.name+'</span><b>'+(counts[m.id]||0)+'</b></button>').join("");
}
function renderList(items){
 const visible=items.slice(0,state.limit);
 $("list").innerHTML=visible.length?visible.map(w=>'<button class="item '+(state.chosen===w.w?"active":"")+'" data-word="'+esc(w.w)+'"><span><strong>'+esc(w.w)+'</strong><small>'+esc(w.cn||METHODS.find(m=>m.id===w.memory.id)?.name)+'</small></span><span class="dot">'+(due(w.w)?"↻":studied(w.w)?"✓":"#"+w.rank)+'</span></button>').join("")+(items.length>visible.length?'<button class="more" id="more">加载更多（'+(items.length-visible.length)+'）</button>':""):'<div class="empty"><b>没有符合条件的词</b>切换分类、搜索或复习模式试试。</div>';
}
function speak(str){if(!("speechSynthesis" in window))return;const utter=new SpeechSynthesisUtterance(str);utter.lang="en-US";utter.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(utter);}
function examples(word){
 const sample=corpusByWord.get(word)||[];
 return sample.slice(0,2);
}
function card(){
 const w=state.words.find(x=>x.w===state.chosen);
 if(!w){$("detail").innerHTML='<div class="empty"><b>没有可学习词条</b>请选择一个分类或查看全部词条。</div>';return}
 const method=METHODS.find(m=>m.id===w.memory.id),m=w.memory,p=progress[w.w];
 const lines=examples(w.w);
 const meaning=w.cn?esc(w.cn):'<span class="muted">暂无校对的中文释义 · 可点击词典查看</span>';
 const pict=icons[w.w]||lex.topics.find(t=>t.id===localWordMap.get(w.w)?.topic)?.icon||(m.id==="visual"?"🖼️":method.icon);
 if(state.hidden){
  $("detail").innerHTML='<div class="eyebrow">主动回忆</div><div class="picture"><span class="emoji">'+pict+'</span><div><strong>'+meaning+'</strong><div class="hint">试着说出对应的英文词条；没有中文释义时，尝试从上下文回忆。</div></div></div><div class="actions"><button class="action primary" data-reveal="1">显示英文答案</button></div>';return;
 }
 const chunks=m.id==="morph"&&m.morph&&m.morph.parts.length>1?'<div class="mini-heading">经过规则确认的构词拆解</div><div class="blocks">'+m.morph.parts.map((x,i)=>'<span class="block '+(i?"alt":"")+'">'+esc(x)+'</span>'+(i<m.morph.parts.length-1?'<span class="plus">+</span>':"")).join("")+'</div>':"";
 const related=m.rel&&m.rel.length>1?'<div class="notes"><b>关联词：</b>'+m.rel.map(x=>esc(x)).join(" · ")+'</div>':"";
 const contrast=m.pair?'<div class="notes"><b>对比：</b>'+esc(w.w)+' ↔ '+esc(m.pair)+'。建议在相同情境中比较两个词，注意语义和句法差别。</div>':"";
 const irregularLine=irregular[w.w]?'<div class="notes"><b>重要词形变化：</b>'+esc(irregular[w.w])+'</div>':"";
 const lineHtml=lines.length?'<div class="mini-heading">来自 SpeakEasy 口语库的例句</div>'+lines.map(line=>'<div class="example"><button data-speak="'+esc(line[0])+'" aria-label="朗读例句">🔊</button><strong>'+esc(line[0])+'</strong><small>'+esc(line[1])+'</small></div>').join(""):'<div class="notes">现有 500 句口语素材中尚未找到这个词的原形例句。建议先结合提示学习，并在后续内容更新中补充自然例句。</div>';
 const dict='https://www.oxfordlearnersdictionaries.com/definition/english/'+encodeURIComponent(w.w);
 $("detail").innerHTML='<div class="detailhead"><div><div class="eyebrow">'+esc(method.icon+" "+method.name)+" · #"+w.rank+'</div><div class="word">'+esc(w.w)+'</div><div class="hint">'+meaning+'</div></div><button class="speaker" data-speak="'+esc(w.w)+'">🔊 发音</button></div><div class="picture"><span class="emoji">'+pict+'</span><div><strong>'+esc(method.desc)+'</strong><div class="hint">'+esc(methodNotes[m.id])+'</div></div></div><div class="sectionline"></div><div class="mini-heading">这个词最适合这样记</div>'+chunks+'<div class="notes">'+esc(m.clue)+'</div>'+related+contrast+irregularLine+(m.morph?.hint?'<div class="hint">'+esc(m.morph.hint)+'</div>':"")+'<div class="sectionline"></div>'+lineHtml+'<div class="actions"><button class="action" data-hide="1">🙈 隐藏英文，自测</button><button class="action" data-grade="hard">还没记牢</button><button class="action primary" data-grade="easy">✓ 记住了</button></div><p class="hint">'+(p?"上次安排：下次复习 "+esc(p.due):"首次学习：先理解并开口练习再标记状态。")+' <a target="_blank" rel="noopener noreferrer" style="text-decoration:underline;color:#397dbf" href="'+dict+'">查词典 ↗</a></p>';
}
function render(){
 if(state.loading)return;
 $("notice").hidden=!state.message;$("notice").textContent=state.message;
 stats();renderMethods();
 document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===state.mode));
 const pool=filtered();
 if(!pool.some(w=>w.w===state.chosen))state.chosen=pool[0]?.w||null;
 $("summary").textContent=state.mode==="today"?"今日轻学 · 到期先复习，再新增 5 词":state.mode==="review"?"需要复习的词条":"全部高频词条";
 $("status").textContent=pool.length+" 条结果 · "+state.source;
 renderList(pool);card();
}
function grade(level){
 const p=progress[state.chosen]||{level:0};
 const next=level==="easy"?Math.min(5,p.level+1):0;
 const gap=level==="easy"?[1,3,7,14,30][next-1]||30:1;
 progress[state.chosen]={level:next,due:isoDay(gap)};
 try{localStorage.setItem(LS,JSON.stringify(progress))}catch{}
 state.hidden=false;render();
}
$("modes").addEventListener("click",e=>{const b=e.target.closest("[data-mode]");if(!b)return;state.mode=b.dataset.mode;state.hidden=false;state.limit=24;render()});
$("methods").addEventListener("click",e=>{const b=e.target.closest("[data-method]");if(!b)return;state.method=b.dataset.method;state.hidden=false;state.limit=24;render()});
$("search").addEventListener("input",e=>{state.query=e.target.value.trim().toLowerCase();state.mode="all";state.hidden=false;state.limit=24;render()});
$("list").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.id==="more"){state.limit+=24;render();return}if(b.dataset.word){state.chosen=b.dataset.word;state.hidden=false;render()}});
$("detail").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.speak)speak(b.dataset.speak);else if(b.dataset.hide){state.hidden=true;card()}else if(b.dataset.reveal){state.hidden=false;card()}else if(b.dataset.grade){grade(b.dataset.grade)}});
$("notice").addEventListener("click",()=>{state.message="";state.loading=true;load()});
load();
})();