const KEY='ttd-progress-v1';
const chapters=[
 {title:'The Case File',description:'Read the briefing and identify the central question.'},
 {title:'The Voices',description:"Listen to Elena's letter and reconstruct six missing parts."},
 {title:'The Evidence Room',description:'Match the letters with the timeline and postal clues.'},
 {title:'The Hearing',description:'Compare perspectives and support claims with evidence.'},
 {title:'The Final Verdict',description:'Build the most reasonable explanation of the silence.'}
];
const $=s=>document.querySelector(s);
const home=$('#home'),intro=$('#case-intro'),list=$('#chapters'),view=$('#chapter-view');
let progress={unlocked:0,visited:[]};
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Number.isInteger(saved.unlocked))progress={unlocked:Math.max(0,Math.min(5,saved.unlocked)),visited:Array.isArray(saved.visited)?saved.visited:[]}}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{}render()}
function render(){
 $('#header-progress').textContent=progress.visited.length+' / 5 CHAPTERS';
 document.querySelectorAll('.chapter-card').forEach((card,i)=>{const open=i<Math.max(1,progress.unlocked);card.disabled=!open;card.querySelector('.state').textContent=!open?'LOCKED':progress.visited.includes(i)?'REVISIT ↗':'AVAILABLE ↗'});
}
function scrollTo(el){el.scrollIntoView({behavior:'smooth',block:'start'})}
$('#begin-button').addEventListener('click',()=>{home.classList.add('hidden');intro.classList.remove('hidden');scrollTo(intro)});
$('#continue-button').addEventListener('click',()=>{progress.unlocked=Math.max(1,progress.unlocked);progress.visited=[...new Set([...progress.visited,0])];save();intro.classList.add('hidden');list.classList.remove('hidden');scrollTo(list)});
$('#back-chapters').addEventListener('click',()=>{view.classList.add('hidden');list.classList.remove('hidden');scrollTo(list)});
document.querySelectorAll('.chapter-card').forEach(card=>card.addEventListener('click',()=>{
 const i=Number(card.dataset.chapter);if(i>=Math.max(1,progress.unlocked))return;
 progress.visited=[...new Set([...progress.visited,i])];save();
 $('#chapter-label').textContent='CHAPTER 0'+(i+1);$('#chapter-title').textContent=chapters[i].title;$('#chapter-description').textContent=chapters[i].description;
 const content=$('#chapter-content');
 if(i===0){content.innerHTML='<p>The case begins with one question: did Elena stop writing to Nora, or did the letters fail to reach the people who needed them?</p><p>Keep an open mind. A document can prove that something was written or returned; it cannot always prove what someone felt.</p>'}
 else if(i===1){content.innerHTML='<p><b>Listening task coming next:</b> Elena’s letter will appear here with six missing parts. The recording script is being finalized alongside the evidence timeline.</p><p>Audio file planned: <code>assets/audio/elena-first-letter.mp3</code></p>'}
 else {content.innerHTML='<p>This chapter will be added after the letter chronology and listening activity are finalized. Your progress will remain saved in this browser.</p>'}
 list.classList.add('hidden');view.classList.remove('hidden');scrollTo(view);
}));
render();