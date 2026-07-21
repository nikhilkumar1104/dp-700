(() => {
  'use strict';
  const BANK = Array.isArray(window.DP700_QUESTION_BANK) ? window.DP700_QUESTION_BANK : [];
  const KEYS = {
    used: 'dp700_unique_used_v1',
    attempts: 'dp700_unique_attempts_v1',
    theme: 'dp700_unique_theme_v1',
    active: 'dp700_unique_active_v1'
  };

  const state = {
    questions: [], current: 0, answers: {}, marked: {}, checked: {},
    remainingSeconds: 0, timerHandle: null, startedAt: null, submittedAt: null,
    practiceMode: false, untimed: false, result: null, shuffled: {}
  };

  const $ = (id) => document.getElementById(id);
  const screens = ['landing','exam','results','review'];

  function init(){
    validateBank();
    applySavedTheme();
    bind();
    renderLanding();
    const saved = loadJSON(KEYS.active, null);
    if(saved && Array.isArray(saved.questions) && saved.questions.length && !saved.submittedAt){
      Object.assign(state, saved);
      state.timerHandle = null;
      if(state.remainingSeconds > 0 && state.lastSavedAt){
        state.remainingSeconds = Math.max(0, state.remainingSeconds - Math.floor((Date.now()-state.lastSavedAt)/1000));
      }
      route('exam');
      renderExam();
      if(!state.untimed && state.remainingSeconds===0){ submitExam(false); return; }
      startTimer();
    }
  }

  function validateBank(){
    if(!BANK.length) throw new Error('Question bank failed to load.');
    const ids = new Set(), signatures = new Set();
    for(const q of BANK){
      if(ids.has(q.id)) throw new Error(`Duplicate question ID: ${q.id}`);
      ids.add(q.id);
      const sig = `${q.prompt}\n${q.code || ''}`.toLowerCase().replace(/\s+/g,' ').trim();
      if(signatures.has(sig)) throw new Error(`Duplicate question text: ${q.id}`);
      signatures.add(sig);
    }
  }

  function bind(){
    $('themeBtn').addEventListener('click', toggleTheme);
    $('startBtn').addEventListener('click', startExam);
    $('resetHistoryBtn').addEventListener('click', confirmResetHistory);
    $('clearAttemptsBtn').addEventListener('click', () => { localStorage.removeItem(KEYS.attempts); renderHistory(); });
    $('previousBtn').addEventListener('click', () => move(-1));
    $('nextBtn').addEventListener('click', () => move(1));
    $('markBtn').addEventListener('click', toggleMark);
    $('checkBtn').addEventListener('click', checkCurrent);
    $('submitBtn').addEventListener('click', confirmSubmit);
    $('reviewBtn').addEventListener('click', renderReview);
    $('homeBtn').addEventListener('click', goHome);
    $('reviewHomeBtn').addEventListener('click', goHome);
    window.addEventListener('beforeunload', (e) => {
      if(state.questions.length && !state.submittedAt){ saveActive(); e.preventDefault(); e.returnValue=''; }
    });
    document.addEventListener('keydown', (e) => {
      if(!$('exam').classList.contains('active')) return;
      if(e.key==='ArrowRight') move(1);
      if(e.key==='ArrowLeft') move(-1);
      if(e.key.toLowerCase()==='m') toggleMark();
    });
  }

  function route(name){
    screens.forEach(s => $(s).classList.toggle('active', s===name));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function applySavedTheme(){
    const saved = localStorage.getItem(KEYS.theme);
    const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    $('themeBtn').textContent = theme==='dark' ? '☀️' : '🌙';
  }
  function toggleTheme(){
    const next = document.documentElement.dataset.theme==='dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(KEYS.theme,next);
    $('themeBtn').textContent = next==='dark' ? '☀️' : '🌙';
  }

  function getUsed(){ return new Set(loadJSON(KEYS.used, [])); }
  function saveUsed(set){ localStorage.setItem(KEYS.used, JSON.stringify([...set])); }
  function remainingUnseen(pool='all'){
    const used = getUsed();
    return filterPool(BANK,pool).filter(q => !used.has(q.id));
  }
  function filterPool(list,pool){
    if(pool==='all') return list;
    if(pool==='coding') return list.filter(q => q.code || q.type==='dropdown' || q.topic.includes('PySpark') || q.topic.includes('KQL') || q.topic.includes('T-SQL'));
    if(pool==='PySpark') return list.filter(q => q.topic.includes('PySpark') || q.topic.includes('Spark') || q.topic.includes('Delta merge with PySpark'));
    if(pool==='KQL') return list.filter(q => q.topic.includes('KQL') || q.topic.includes('Eventhouse'));
    if(pool==='T-SQL') return list.filter(q => q.topic.includes('T-SQL') || q.topic.includes('Warehouse'));
    if(pool==='Fabric') return list.filter(q => !q.topic.includes('PySpark') && !q.topic.includes('KQL') && !q.topic.includes('T-SQL'));
    return list;
  }

  function renderLanding(){
    const unseen = remainingUnseen('all').length;
    $('unseenBadge').textContent = `Unseen: ${unseen}`;
    $('startBtn').disabled = unseen===0;
    $('landingMessage').textContent = unseen===0 ? 'All questions have been used. Reset question history to make the bank available again.' : '';
    renderHistory();
  }

  function renderHistory(){
    const attempts = loadJSON(KEYS.attempts, []);
    const box = $('historyList'); box.innerHTML='';
    if(!attempts.length){ box.innerHTML='<div class="empty">No completed attempts yet.</div>'; return; }
    attempts.slice().reverse().slice(0,12).forEach(a => {
      const row = document.createElement('div'); row.className='history-row';
      const date = new Date(a.submittedAt).toLocaleString();
      row.innerHTML = `<div><strong>${escapeHtml(a.poolLabel)} · ${a.total} questions</strong><span>${date}</span></div><strong>${a.percent}%</strong><span>${a.correct}/${a.total} correct</span>`;
      box.appendChild(row);
    });
  }

  function startExam(){
    const count = Number($('questionCount').value);
    const pool = $('poolSelect').value;
    const available = remainingUnseen(pool);
    if(!available.length){ $('landingMessage').textContent='No unseen questions remain in this pool. Choose another pool or reset question history.'; return; }
    const actual = Math.min(count, available.length);
    const chosen = shuffle([...available]).slice(0,actual).map(prepareQuestion);
    const used = getUsed(); chosen.forEach(q => used.add(q.id)); saveUsed(used);
    Object.assign(state, {
      questions: chosen, current:0, answers:{}, marked:{}, checked:{}, shuffled:{},
      remainingSeconds:Number($('durationSelect').value)*60,
      startedAt:Date.now(), submittedAt:null, result:null,
      practiceMode:$('practiceMode').checked,
      untimed:Number($('durationSelect').value)===0
    });
    state.questions.forEach((q,idx) => state.shuffled[idx]=q);
    $('landingMessage').textContent = actual<count ? `Only ${actual} unseen questions remained in this pool, so the exam uses all of them.` : '';
    saveActive(); route('exam'); renderExam(); startTimer(); renderLanding();
  }

  function prepareQuestion(original){
    const q = structuredClone(original);
    if(q.type==='single' || q.type==='multi'){
      const mapped = q.options.map((text,i)=>({text,correct:q.answer.includes(i)}));
      const shuffled = shuffle(mapped);
      q.options = shuffled.map(x=>x.text);
      q.answer = shuffled.map((x,i)=>x.correct?i:null).filter(x=>x!==null);
    }else if(q.type==='dropdown'){
      q.slots = q.slots.map(slot => {
        const mapped = slot.options.map((text,i)=>({text,correct:i===slot.answer}));
        const shuffled = shuffle(mapped);
        return {label:slot.label,options:shuffled.map(x=>x.text),answer:shuffled.findIndex(x=>x.correct)};
      });
    }else if(q.type==='order'){
      q.initialOrder = nonIdentityShuffle(q.options.map((_,i)=>i));
    }else if(q.type==='match'){
      q.left = shuffle([...q.left]);
      q.rightOrderByLeft = {};
      q.left.forEach(left => q.rightOrderByLeft[left]=shuffle([...q.right]));
    }
    return q;
  }

  function renderExam(){
    const q = state.questions[state.current]; if(!q) return;
    $('questionMeta').innerHTML = `<span class="pill">${escapeHtml(q.topic)}</span><span class="pill neutral">${escapeHtml(q.type)}</span><span class="pill neutral">${escapeHtml(q.difficulty)}</span>`;
    $('questionPosition').textContent = `Question ${state.current+1} of ${state.questions.length} · ${q.id}`;
    $('questionPrompt').textContent = q.prompt;
    if(q.code){ $('codeBlock').classList.remove('hidden'); $('questionCode').textContent=q.code; } else $('codeBlock').classList.add('hidden');
    const instructions = {single:'Select one answer.',multi:`Select ${q.select || q.answer.length} answers.`,dropdown:'Choose the correct value for every code placeholder.',order:'Arrange the steps in the correct sequence.',match:'Match every item to its correct purpose.'};
    $('questionInstruction').textContent=instructions[q.type] || '';
    renderAnswer(q);
    $('previousBtn').disabled=state.current===0;
    $('nextBtn').textContent=state.current===state.questions.length-1?'Review & submit':'Next';
    $('markBtn').textContent=state.marked[state.current]?'Marked for review':'Mark for review';
    $('markBtn').classList.toggle('primary',Boolean(state.marked[state.current]));
    $('markBtn').classList.toggle('ghost',!state.marked[state.current]);
    $('checkBtn').classList.toggle('hidden',!state.practiceMode);
    renderFeedback(q);
    renderNavigator(); updateProgress(); updateTimer(); saveActive();
  }

  function renderAnswer(q){
    const area=$('answerArea'); area.innerHTML='';
    if(q.type==='single' || q.type==='multi'){
      const box=document.createElement('div'); box.className='options';
      const selected=state.answers[state.current] || [];
      q.options.forEach((text,i)=>{
        const label=document.createElement('label');
        label.className=`option ${q.type==='multi'?'multi':''} ${selected.includes(i)?'selected':''}`;
        label.innerHTML=`<input type="${q.type==='multi'?'checkbox':'radio'}" name="choice"><span class="choice-mark">${String.fromCharCode(65+i)}</span><span class="option-text">${escapeHtml(text)}</span>`;
        label.addEventListener('click',(e)=>{e.preventDefault();chooseOption(i,q.type);});
        box.appendChild(label);
      }); area.appendChild(box); return;
    }
    if(q.type==='dropdown'){
      const box=document.createElement('div'); box.className='dropdown-grid'; const saved=state.answers[state.current]||{};
      q.slots.forEach((slot,idx)=>{
        const row=document.createElement('div'); row.className='dropdown-row';
        row.innerHTML=`<strong>${escapeHtml(slot.label)}</strong><select aria-label="Selection for ${escapeAttr(slot.label)}"><option value="">Select an answer</option>${slot.options.map((x,i)=>`<option value="${i}" ${saved[idx]===i?'selected':''}>${escapeHtml(x)}</option>`).join('')}</select>`;
        row.querySelector('select').addEventListener('change',e=>{const x={...(state.answers[state.current]||{})}; if(e.target.value==='') delete x[idx]; else x[idx]=Number(e.target.value); state.answers[state.current]=x; renderNavigator();updateProgress();saveActive();});
        box.appendChild(row);
      }); area.appendChild(box); return;
    }
    if(q.type==='order'){
      const order=Array.isArray(state.answers[state.current])?state.answers[state.current]:[...q.initialOrder]; state.answers[state.current]=order;
      const box=document.createElement('div'); box.className='order-list';
      order.forEach((optionIndex,pos)=>{
        const row=document.createElement('div'); row.className='order-item';
        row.innerHTML=`<span class="order-number">${pos+1}</span><span>${escapeHtml(q.options[optionIndex])}</span><span class="order-buttons"><button aria-label="Move up">↑</button><button aria-label="Move down">↓</button></span>`;
        const [up,down]=row.querySelectorAll('button'); up.disabled=pos===0;down.disabled=pos===order.length-1;up.onclick=()=>moveOrder(pos,-1);down.onclick=()=>moveOrder(pos,1);box.appendChild(row);
      }); area.appendChild(box); return;
    }
    if(q.type==='match'){
      const saved=state.answers[state.current]||{}; const box=document.createElement('div');box.className='match-grid';
      q.left.forEach(left=>{
        const row=document.createElement('div');row.className='match-row';const opts=q.rightOrderByLeft[left];
        row.innerHTML=`<strong>${escapeHtml(left)}</strong><select aria-label="Match for ${escapeAttr(left)}"><option value="">Select a match</option>${opts.map(x=>`<option value="${escapeAttr(x)}" ${saved[left]===x?'selected':''}>${escapeHtml(x)}</option>`).join('')}</select>`;
        row.querySelector('select').onchange=e=>{state.answers[state.current]={...(state.answers[state.current]||{}),[left]:e.target.value};renderNavigator();updateProgress();saveActive();};box.appendChild(row);
      }); area.appendChild(box);
    }
  }

  function chooseOption(index,type){
    const current=state.answers[state.current]||[];
    if(type==='single') state.answers[state.current]=[index];
    else state.answers[state.current]=current.includes(index)?current.filter(x=>x!==index):[...current,index];
    renderExam();
  }
  function moveOrder(pos,delta){
    const order=[...state.answers[state.current]],target=pos+delta;if(target<0||target>=order.length)return;
    [order[pos],order[target]]=[order[target],order[pos]];state.answers[state.current]=order;renderExam();
  }
  function move(delta){
    if(delta>0 && state.current===state.questions.length-1){confirmSubmit();return;}
    state.current=Math.max(0,Math.min(state.questions.length-1,state.current+delta));renderExam();
  }
  function toggleMark(){state.marked[state.current]=!state.marked[state.current];renderExam();}
  function checkCurrent(){state.checked[state.current]=true;renderFeedback(state.questions[state.current]);saveActive();}

  function renderFeedback(q){
    const box=$('answerFeedback');
    if(!state.practiceMode || !state.checked[state.current]){box.classList.add('hidden');box.innerHTML='';return;}
    const ok=isCorrect(q,state.answers[state.current]);box.className=`feedback ${ok?'correct':'incorrect'}`;box.innerHTML=`<strong>${ok?'Correct':'Incorrect'}</strong><br>${escapeHtml(q.explanation)}`;
  }

  function isAnswered(index){
    const q=state.questions[index],a=state.answers[index];if(!q||a===undefined)return false;
    if(q.type==='single'||q.type==='multi'||q.type==='order')return Array.isArray(a)&&a.length>0;
    if(q.type==='dropdown')return Object.keys(a||{}).length===q.slots.length;
    if(q.type==='match')return q.left.every(left=>Boolean((a||{})[left]));
    return false;
  }
  function isCorrect(q,a){
    if(!a)return false;
    if(q.type==='single'||q.type==='multi')return arraysEqual([...a].sort((x,y)=>x-y),[...q.answer].sort((x,y)=>x-y));
    if(q.type==='order')return arraysEqual(a,q.answer);
    if(q.type==='dropdown')return q.slots.every((slot,i)=>a[i]===slot.answer);
    if(q.type==='match')return Object.entries(q.answer).every(([left,right])=>a[left]===right);
    return false;
  }
  function renderNavigator(){
    const nav=$('navigator');nav.innerHTML='';state.questions.forEach((q,i)=>{const b=document.createElement('button');b.textContent=i+1;b.classList.toggle('answered',isAnswered(i));b.classList.toggle('marked',Boolean(state.marked[i]));b.classList.toggle('current',i===state.current);b.onclick=()=>{state.current=i;renderExam();};nav.appendChild(b);});
  }
  function updateProgress(){
    const answered=state.questions.filter((_,i)=>isAnswered(i)).length,total=state.questions.length;$('answeredText').textContent=`${answered} / ${total}`;$('progressFill').style.width=`${total?answered/total*100:0}%`;
  }

  function startTimer(){
    stopTimer();if(state.remainingSeconds<=0)return;
    state.timerHandle=setInterval(()=>{state.remainingSeconds=Math.max(0,state.remainingSeconds-1);updateTimer();if(state.remainingSeconds===0)submitExam(false);if(state.remainingSeconds%10===0)saveActive();},1000);
  }
  function stopTimer(){if(state.timerHandle)clearInterval(state.timerHandle);state.timerHandle=null;}
  function updateTimer(){
    const el=$('timer');if(state.untimed){el.textContent='Untimed';el.classList.remove('warning','danger');return;}
    const h=Math.floor(state.remainingSeconds/3600),m=Math.floor(state.remainingSeconds%3600/60),s=state.remainingSeconds%60;el.textContent=[h,m,s].map(x=>String(x).padStart(2,'0')).join(':');el.classList.toggle('warning',state.remainingSeconds>300&&state.remainingSeconds<=900);el.classList.toggle('danger',state.remainingSeconds<=300);
  }

  function confirmSubmit(){
    const unanswered=state.questions.filter((_,i)=>!isAnswered(i)).length;
    openConfirm('Submit exam',unanswered?`You have ${unanswered} unanswered question(s). Submit anyway?`:'Submit your completed exam?',()=>submitExam(true));
  }
  function submitExam(manual=true){
    if(state.submittedAt)return;stopTimer();state.submittedAt=Date.now();
    const details=state.questions.map((q,i)=>({id:q.id,correct:isCorrect(q,state.answers[i]),topic:q.topic,domain:q.domain}));
    const correct=details.filter(x=>x.correct).length,total=details.length,percent=Math.round(correct/Math.max(total,1)*100);
    const elapsed=Math.max(0,Math.round((state.submittedAt-state.startedAt)/1000));
    state.result={correct,total,percent,elapsed,details};
    const attempts=loadJSON(KEYS.attempts,[]);attempts.push({submittedAt:state.submittedAt,correct,total,percent,elapsed,poolLabel:inferPoolLabel(),manual});localStorage.setItem(KEYS.attempts,JSON.stringify(attempts.slice(-50)));
    localStorage.removeItem(KEYS.active);renderResults();route('results');renderLanding();
  }
  function inferPoolLabel(){const topics=new Set(state.questions.map(q=>q.topic));if([...topics].every(t=>t.includes('PySpark')||t.includes('Spark')))return'PySpark';return'Expert mixed';}

  function renderResults(){
    const r=state.result;$('scoreHeading').textContent=`${r.percent}%`;$('scoreSummary').textContent=r.percent>=80?'Strong result on an expert-level bank. Review the missed code paths before the next unseen attempt.':r.percent>=70?'Pass-level practice result. Review the weak domains before the next unseen attempt.':'Below the 70% practice target. Use the detailed review before starting the next unseen set.';
    $('resultMetrics').innerHTML=`<div><strong>${r.correct}/${r.total}</strong><span>correct</span></div><div><strong>${formatDuration(r.elapsed)}</strong><span>time used</span></div><div><strong>${r.total-r.correct}</strong><span>incorrect</span></div>`;
    const grouped={};state.questions.forEach((q,i)=>{const k=q.domain;grouped[k]??={correct:0,total:0};grouped[k].total++;if(isCorrect(q,state.answers[i]))grouped[k].correct++;});
    const box=$('topicResults');box.innerHTML='';Object.entries(grouped).forEach(([name,x])=>{const pct=Math.round(x.correct/x.total*100);const c=document.createElement('article');c.className='card topic-card';c.innerHTML=`<h3>${escapeHtml(name)}</h3><div class="topic-score">${pct}%</div><p>${x.correct} of ${x.total} correct</p>`;box.appendChild(c);});
  }

  function renderReview(){
    const box=$('reviewList');box.innerHTML='';state.questions.forEach((q,i)=>{const ok=isCorrect(q,state.answers[i]);const card=document.createElement('article');card.className=`card review-card ${ok?'correct':'incorrect'}`;
      const user=formatAnswer(q,state.answers[i]);const correct=formatCorrect(q);card.innerHTML=`<div class="meta-row"><span class="pill">${escapeHtml(q.topic)}</span><span class="pill neutral">${q.id}</span></div><h3>${escapeHtml(q.prompt)}</h3>${q.code?`<pre class="code-block"><code>${escapeHtml(q.code)}</code></pre>`:''}<div class="review-answer"><div class="${ok?'correct-answer':'user-wrong'}"><strong>Your answer:</strong> ${escapeHtml(user||'Not answered')}</div><div class="correct-answer"><strong>Correct answer:</strong> ${escapeHtml(correct)}</div><div><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div></div>`;box.appendChild(card);});route('review');
  }

  function formatAnswer(q,a){
    if(!a)return'';
    if(q.type==='single'||q.type==='multi')return a.map(i=>q.options[i]).join(' | ');
    if(q.type==='order')return a.map((i,n)=>`${n+1}. ${q.options[i]}`).join(' → ');
    if(q.type==='dropdown')return q.slots.map((s,i)=>`${s.label} = ${a[i]===undefined?'—':s.options[a[i]]}`).join(' | ');
    if(q.type==='match')return q.left.map(l=>`${l} → ${a[l]||'—'}`).join(' | ');
    return'';
  }
  function formatCorrect(q){
    if(q.type==='single'||q.type==='multi')return q.answer.map(i=>q.options[i]).join(' | ');
    if(q.type==='order')return q.answer.map((i,n)=>`${n+1}. ${q.options[i]}`).join(' → ');
    if(q.type==='dropdown')return q.slots.map(s=>`${s.label} = ${s.options[s.answer]}`).join(' | ');
    if(q.type==='match')return Object.entries(q.answer).map(([l,r])=>`${l} → ${r}`).join(' | ');
    return'';
  }

  function goHome(){stopTimer();state.questions=[];state.submittedAt=null;state.result=null;localStorage.removeItem(KEYS.active);route('landing');renderLanding();}
  function confirmResetHistory(){openConfirm('Reset question history','This makes all 190 questions eligible again. Completed-result history is kept.',()=>{localStorage.removeItem(KEYS.used);renderLanding();});}
  function openConfirm(title,text,onConfirm){const d=$('confirmDialog');$('dialogTitle').textContent=title;$('dialogText').textContent=text;const old=$('dialogConfirm').cloneNode(true);$('dialogConfirm').replaceWith(old);old.addEventListener('click',()=>{setTimeout(onConfirm,0);});d.showModal();}

  function saveActive(){if(!state.questions.length||state.submittedAt)return;const snapshot={...state,timerHandle:null,lastSavedAt:Date.now()};localStorage.setItem(KEYS.active,JSON.stringify(snapshot));}
  function loadJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
  function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
  function nonIdentityShuffle(arr){if(arr.length<2)return arr;let x=shuffle([...arr]);if(arraysEqual(x,arr))[x[0],x[1]]=[x[1],x[0]];return x;}
  function arraysEqual(a,b){return a.length===b.length&&a.every((x,i)=>x===b[i]);}
  function formatDuration(sec){const m=Math.floor(sec/60),s=sec%60;return `${m}m ${s}s`;}
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function escapeAttr(v){return escapeHtml(v);}

  init();
})();
