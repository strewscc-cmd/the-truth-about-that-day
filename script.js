const KEY='ttd-progress-v1';
const chapters=[
 {title:'The Case File',description:'Read the briefing and identify the central question.'},
 {title:'The Voices',description:"Listen to Elena's letter and reconstruct six missing parts."},
 {title:'The Evidence Room',description:'Compare dates, addresses, and postal clues.'},
 {title:'The Hearing',description:'Compare perspectives and support claims with evidence.'},
 {title:'The Final Verdict',description:'Build the most reasonable explanation of the silence.'}
];
const $=s=>document.querySelector(s);
const home=$('#home'),intro=$('#case-intro'),list=$('#chapters'),view=$('#chapter-view');
let progress={unlocked:0,visited:[],scores:{}};
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Number.isInteger(saved.unlocked))progress={unlocked:Math.max(0,Math.min(5,saved.unlocked)),visited:Array.isArray(saved.visited)?saved.visited:[],scores:saved.scores||{}}}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{}render()}
function render(){
 $('#header-progress').textContent=progress.visited.length+' / 5 CHAPTERS';
 document.querySelectorAll('.chapter-card').forEach((card,i)=>{const open=i<Math.max(1,progress.unlocked);card.disabled=!open;card.querySelector('.state').textContent=!open?'LOCKED':progress.visited.includes(i)?'REVISIT ↗':'AVAILABLE ↗'});
}
function scrollTo(el){el.scrollIntoView({behavior:'smooth',block:'start'})}
function finishChapter(i){
 progress.unlocked=Math.max(progress.unlocked,Math.min(5,i+2));
 progress.visited=[...new Set([...progress.visited,i])];save();
 const box=$('#chapter-feedback');if(box){box.innerHTML='<p class="success-title">CHAPTER COMPLETE ✓</p><p>Your progress is saved. The next chapter is now available in the archive.</p><button class="button" id="return-archive">RETURN TO ARCHIVE →</button>';$('#return-archive').addEventListener('click',()=>{view.classList.add('hidden');list.classList.remove('hidden');scrollTo(list)})}
}
$('#begin-button').addEventListener('click',()=>{home.classList.add('hidden');intro.classList.remove('hidden');scrollTo(intro)});
$('#continue-button').addEventListener('click',()=>{progress.unlocked=Math.max(1,progress.unlocked);progress.visited=[...new Set([...progress.visited,0])];save();intro.classList.add('hidden');list.classList.remove('hidden');scrollTo(list)});
$('#back-chapters').addEventListener('click',()=>{view.classList.add('hidden');list.classList.remove('hidden');scrollTo(list)});
function voices(){
 const blanks=[
  {answer:'I took this job overseas',hint:'Elena explains why she left to work in another country.'},
  {answer:"money cannot take the place of a mother's arms",hint:'Money can provide things, but it cannot replace physical affection.'},
  {answer:'I have not forgotten you',hint:'A reassurance that Nora is still remembered.'},
  {answer:'please do not think I have stopped caring',hint:'Elena asks Nora not to mistake delayed mail for a lack of love.'},
  {answer:'I will keep trying to reach you',hint:'A promise about continuing to send letters.'},
  {answer:'one letter at a time',hint:'The closing idea: getting to know Nora gradually through correspondence.'}
 ];
 const pieces=[
  'Dear Nora,\n\nI hope this letter finds you well and that you are still keeping your little notebook of drawings. I often imagine you sitting by the window, making up stories about the people who pass by.\n\nI know leaving was difficult for both of us. ',
  '. I wanted to give you a safer home and more opportunities when you grow up. I thought that if I worked hard now, you would have more choices later. But I also know that ',
  ', and I miss you more than I can explain.\n\nPlease remember that ',
  ', even when the days become busy and the distance feels enormous. I write whenever I can, and I keep every letter you send me. Your words are small treasures that make this unfamiliar place feel less lonely.\n\nIf a letter takes longer than expected, ',
  '. ',
  '. I hope you will keep writing to me, too, even if all you have to tell me is what you ate for breakfast or what made you laugh at school.\n\nI wish I could be there for every important day. Until then, tell me about your dreams, your friends, and the things you are proud of. I want to know the person you are becoming, ',
  '.\n\nWith all my love,\n\nMum'
 ];
 const gap=(n)=>'<label class="gap-field"><span>Missing part '+(n+1)+'</span><input id="gap-'+n+'" autocomplete="off" placeholder="Type the missing words" aria-label="Missing part '+(n+1)+'"></label>';
 $('#chapter-content').innerHTML=`
 <div class="audio-card"><div class="audio-top"><span class="eyebrow">EVIDENCE AUDIO 01</span><span class="audio-duration">EST. 1:30–2:00</span></div><h3>Elena’s First Letter</h3><p>Listen to Elena read a letter she wrote to Nora. Fill in the six missing parts. You can replay the audio as many times as you need.</p><audio controls preload="metadata"><source src="assets/audio/elena-first-letter.mp3.mp3" type="audio/mpeg">Your browser does not support audio playback.</audio><p class="audio-note">If the player does not load yet, the recording file may not have been uploaded to the archive. You can still preview the task below.</p></div>
 <div class="letter-sheet"><div class="letter-meta">PERSONAL CORRESPONDENCE · ITEM 01</div><h3>Dear Nora,</h3>
 <p>I hope this letter finds you well and that you are still keeping your little notebook of drawings. I often imagine you sitting by the window, making up stories about the people who pass by.</p>
 <p>I know leaving was difficult for both of us. <span class="inline-gap">[1]</span> I wanted to give you a safer home and more opportunities when you grow up. I thought that if I worked hard now, you would have more choices later. But I also know that <span class="inline-gap">[2]</span>, and I miss you more than I can explain.</p>
 <p>Please remember that <span class="inline-gap">[3]</span>, even when the days become busy and the distance feels enormous. I write whenever I can, and I keep every letter you send me. Your words are small treasures that make this unfamiliar place feel less lonely.</p>
 <p>If a letter takes longer than expected, <span class="inline-gap">[4]</span>. <span class="inline-gap">[5]</span> I hope you will keep writing to me, too, even if all you have to tell me is what you ate for breakfast or what made you laugh at school.</p>
 <p>I wish I could be there for every important day. Until then, tell me about your dreams, your friends, and the things you are proud of. I want to know the person you are becoming, <span class="inline-gap">[6]</span>.</p><p>With all my love,<br><em>Mum</em></p></div>
 <div class="answer-panel"><p class="eyebrow">YOUR TRANSCRIPTION</p><h3>Reconstruct the letter</h3><p class="muted">Type the words or phrases you hear. Spelling and punctuation do not need to be perfect, but the meaning should match.</p>
 ${blanks.map((b,n)=>gap(n)).join('')}
 <div class="action-row"><button class="button" id="check-answers">CHECK MY ANSWERS</button><button class="secondary-button" id="show-hints">SHOW HINTS</button></div>
 <div id="hints-box" class="hint-box hidden">${blanks.map((b,n)=>'<p><b>'+(n+1)+'.</b> '+b.hint+'</p>').join('')}</div><div id="answer-feedback" aria-live="polite"></div></div>
 <div class="chapter-feedback" id="chapter-feedback"></div>`;
 $('#show-hints').addEventListener('click',()=>$('#hints-box').classList.toggle('hidden'));
 $('#check-answers').addEventListener('click',()=>{
  let correct=0;const result=[];
  blanks.forEach((b,n)=>{const input=$('#gap-'+n);const norm=s=>s.toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();const ok=norm(input.value)===norm(b.answer);if(ok)correct++;input.classList.toggle('correct-input',ok);input.classList.toggle('wrong-input',!ok);result.push((n+1)+'. '+(ok?'✓ Correct':('Not quite — answer: “'+b.answer+'”')))});
  const score=Math.round(correct/6*30);progress.scores.listening=score;save();
  const fb=$('#answer-feedback');fb.innerHTML='<div class="feedback-card"><h4>'+correct+' / 6 correct · '+score+'/30 listening points</h4><p>'+ (correct===6?'Excellent listening. You recovered every key phrase.':'Good start. Review the feedback below, then try again or reveal the complete letter.')+'</p><ul>'+result.map(x=>'<li>'+x+'</li>').join('')+'</ul><button class="secondary-button" id="reveal-letter">REVEAL COMPLETE LETTER</button> <button class="button" id="complete-voices">COMPLETE CHAPTER →</button><div id="full-letter" class="hidden full-letter"><h4>What the letter reveals</h4><p>Elena says she left to provide security and opportunities, but recognizes that money cannot replace affection. She explicitly promises to keep trying to reach Nora and asks Nora not to interpret delayed letters as a lack of care.</p><p><b>Purpose:</b> to maintain a personal relationship and reassure the recipient. <b>Tone:</b> affectionate, sincere, and wistful. <b>Key features:</b> direct address, first-person voice, personal details, expressions of feeling, and a warm closing.</p><p><b>Remember:</b> the letter proves what Elena wrote. By itself, it does not prove that every letter was delivered—or explain every later absence.</p></div></div>';
  $('#reveal-letter').addEventListener('click',()=>$('#full-letter').classList.toggle('hidden'));
  $('#complete-voices').addEventListener('click',()=>finishChapter(1));
 });
}
function evidenceRoom(){
 $('#chapter-content').innerHTML=`
 <div class="evidence-grid">
 <article class="evidence-card"><span class="evidence-tag">ITEM A · LETTER</span><h3>Elena’s letter</h3><p><b>Date:</b> 12 March, Year 1</p><p>Elena writes, “I will keep trying to reach you.” The letter is signed and addressed to Nora at the family’s old home.</p><p class="evidence-label">CAN SUPPORT</p><p>Elena wrote a message expressing an intention to stay in touch.</p></article>
 <article class="evidence-card"><span class="evidence-tag">ITEM B · ENVELOPE</span><h3>Returned mail</h3><p><b>Mark:</b> “Return to sender — address unknown”</p><p>The envelope carries a postal mark and a handwritten address correction. No delivery confirmation is present.</p><p class="evidence-label">CAN SUPPORT</p><p>At least this item appears to have encountered a delivery problem.</p></article>
 <article class="evidence-card"><span class="evidence-tag">ITEM C · NORA’S NOTE</span><h3>An unsent reply</h3><p><b>Context:</b> written after a difficult school day</p><p>Nora writes that she misses her mother and wishes she would write more often. The note is kept in the box and has no visible postal mark.</p><p class="evidence-label">CAN SUPPORT</p><p>Nora wanted contact at that moment; this note alone does not show that Elena received it.</p></article>
 </div>
 <div class="answer-panel"><p class="eyebrow">EVIDENCE ANALYSIS</p><h3>Fact, inference, or assumption?</h3><p>Choose the strongest classification for each statement.</p>
 <div class="classify-item"><p>1. The envelope has a “return to sender” postal mark.</p><select id="class-1"><option value="">Choose classification</option><option>Fact</option><option>Inference</option><option>Assumption</option></select></div>
 <div class="classify-item"><p>2. At least one letter may not have reached Nora because of an address problem.</p><select id="class-2"><option value="">Choose classification</option><option>Fact</option><option>Inference</option><option>Assumption</option></select></div>
 <div class="classify-item"><p>3. Elena never loved Nora.</p><select id="class-3"><option value="">Choose classification</option><option>Fact</option><option>Inference</option><option>Assumption</option></select></div>
 <div class="classify-item"><p>4. Nora’s unsent note proves Elena ignored Nora’s reply.</p><select id="class-4"><option value="">Choose classification</option><option>Fact</option><option>Inference</option><option>Assumption</option></select></div>
 <button class="button" id="check-evidence">CHECK CLASSIFICATIONS</button><div id="evidence-feedback" aria-live="polite"></div></div><div class="chapter-feedback" id="chapter-feedback"></div>`;
 $('#check-evidence').addEventListener('click',()=>{
 const answers=['Fact','Inference','Assumption','Assumption'];let n=0;answers.forEach((a,i)=>{if($('#class-'+(i+1)).value===a)n++});
 const score=Math.round(n/4*25);progress.scores.evidence=score;save();
 $('#evidence-feedback').innerHTML='<div class="feedback-card"><h4>'+n+' / 4 correct · '+score+'/25 evidence points</h4><p>Fact = directly observable in the evidence. Inference = a reasonable explanation supported by clues. Assumption = a conclusion that goes beyond what the evidence establishes.</p><p><b>Answer key:</b> 1 Fact · 2 Inference · 3 Assumption · 4 Assumption.</p><button class="button" id="complete-evidence">COMPLETE CHAPTER →</button></div>';
 $('#complete-evidence').addEventListener('click',()=>finishChapter(2));
 });
}
function hearing(){
 const qs=[
 {q:'Nora says: “Mum did not contact me on the day of my competition, so I was not important to her.” What is the strongest response?',opts:['Her disappointment is understandable, but the conclusion about her mother’s feelings is not proven by one absence.','Nora is wrong to feel upset.','The competition must not have mattered.'],a:0,why:'Validate the feeling, but evaluate the conclusion separately.'},
 {q:'Which statement is best supported by the returned envelope?',opts:['Every letter Elena sent was returned.','At least one letter appears to have had a delivery problem.','The postal service deliberately hid the letters.'],a:1,why:'One returned envelope is evidence about that item, not every letter.'},
 {q:'What would be the fairest way to describe Elena’s and Nora’s silence?',opts:['Only Nora caused the problem.','Only Elena caused the problem.','The available evidence suggests miscommunication and assumptions may have reinforced each other.'],a:2,why:'This interpretation allows for uncertainty without ignoring either person’s pain.'}
 ];
 $('#chapter-content').innerHTML='<p class="eyebrow">CHAPTER 04 · PERSPECTIVE HEARING</p><h3>Two perspectives can be sincere—and incomplete.</h3><p class="muted">For each question, select the response best supported by the case evidence. Your task is not to pick a villain; it is to reason fairly.</p>'+qs.map((q,i)=>'<div class="hearing-question"><p><b>'+ (i+1)+'. '+q.q+'</b></p>'+q.opts.map((o,j)=>'<label class="option-row"><input type="radio" name="hearing-'+i+'" value="'+j+'"><span>'+o+'</span></label>').join('')+'</div>').join('')+'<button class="button" id="check-hearing">SUBMIT REASONING</button><div id="hearing-feedback"></div><div class="chapter-feedback" id="chapter-feedback"></div>';
 $('#check-hearing').addEventListener('click',()=>{let n=0;const explanations=[];qs.forEach((q,i)=>{const picked=document.querySelector('input[name="hearing-'+i+'"]:checked');if(picked&&Number(picked.value)===q.a)n++;explanations.push('<li><b>'+(i+1)+'.</b> '+q.why+'</li>')});const score=Math.round(n/3*20);progress.scores.hearing=score;save();$('#hearing-feedback').innerHTML='<div class="feedback-card"><h4>'+n+' / 3 supported responses · '+score+'/20 argumentation points</h4><ul>'+explanations.join('')+'</ul><button class="button" id="complete-hearing">COMPLETE CHAPTER →</button></div>';$('#complete-hearing').addEventListener('click',()=>finishChapter(3))});
}
function verdict(){
 $('#chapter-content').innerHTML='<p class="eyebrow">CHAPTER 05 · FINAL REPORT</p><h3>Write the conclusion the evidence deserves.</h3><p class="muted">Choose the explanation that best balances evidence, uncertainty, and both characters’ feelings.</p><div class="verdict-options"><label class="option-row"><input type="radio" name="verdict" value="a"><span>Elena never cared about Nora, and the letters are meaningless.</span></label><label class="option-row"><input type="radio" name="verdict" value="b"><span>The evidence suggests Elena tried to maintain contact, while postal issues and changing addresses may have interrupted some letters. Both Elena and Nora may have interpreted silence as rejection, but the evidence cannot explain every missed moment.</span></label><label class="option-row"><input type="radio" name="verdict" value="c"><span>The postal service is definitely responsible for every missed message and for the competition-day silence.</span></label></div><label class="gap-field verdict-reason"><span>Support your conclusion with evidence (1–3 sentences)</span><textarea id="verdict-reason" rows="4" placeholder="The evidence suggests… because… However, we cannot know for certain…"></textarea></label><button class="button" id="submit-verdict">SUBMIT FINAL REPORT</button><div id="verdict-feedback"></div><div class="chapter-feedback" id="chapter-feedback"></div>';
 $('#submit-verdict').addEventListener('click',()=>{const choice=document.querySelector('input[name="verdict"]:checked');const reason=$('#verdict-reason').value.trim();if(!choice||reason.length<20){$('#verdict-feedback').innerHTML='<p class="inline-warning">Choose an explanation and write at least one evidence-based sentence before submitting.</p>';return}const fair=choice.value==='b';const quality=reason.length>=80?15:reason.length>=40?12:8;const score=(fair?10:3)+quality;progress.scores.verdict=Math.min(25,score);save();$('#verdict-feedback').innerHTML='<div class="feedback-card"><h4>Final report recorded · '+Math.min(25,score)+'/25 critical-evaluation points</h4><p>'+(fair?'Your conclusion is consistent with the available evidence and acknowledges uncertainty.':'Your conclusion is recorded. Revisit the difference between evidence and certainty: the strongest explanation avoids claiming more than the clues can prove.')+'</p><p><b>Case note:</b> Nora’s disappointment about the competition remains real. The evidence changes what we can conclude about the silence; it does not erase how that silence felt.</p><button class="button" id="complete-verdict">CLOSE THE CASE →</button></div>';$('#complete-verdict').addEventListener('click',()=>finishChapter(4))});
}
document.querySelectorAll('.chapter-card').forEach(card=>card.addEventListener('click',()=>{
 const i=Number(card.dataset.chapter);if(i>=Math.max(1,progress.unlocked))return;
 $('#chapter-label').textContent='CHAPTER 0'+(i+1);$('#chapter-title').textContent=chapters[i].title;$('#chapter-description').textContent=chapters[i].description;
 const content=$('#chapter-content');
 if(i===0){content.innerHTML='<p>The case begins with one question: did Elena stop writing to Nora, or did the letters fail to reach the people who needed them?</p><p>Keep an open mind. A document can prove that something was written or returned; it cannot always prove what someone felt.</p><p><b>Investigator’s rule:</b> distinguish what you can observe from what you think it means.</p><button class="button" id="complete-case">ACKNOWLEDGE THE BRIEFING →</button><div class="chapter-feedback" id="chapter-feedback"></div>';$('#complete-case').addEventListener('click',()=>finishChapter(0))}
 else if(i===1)voices();else if(i===2)evidenceRoom();else if(i===3)hearing();else verdict();
 list.classList.add('hidden');view.classList.remove('hidden');scrollTo(view);
}));
render();
