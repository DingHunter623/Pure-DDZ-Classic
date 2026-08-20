(() => {
  'use strict';

  const RANK_TEXT = {3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'J',12:'Q',13:'K',14:'A',15:'2',16:'小王',17:'大王'};
  const SUITS = ['♠','♥','♣','♦'];
  const state = {
    started:false,
    hands:[[],[],[]],
    bottom:[],
    landlord:0,
    current:0,
    lastPlay:null,
    passCount:0,
    selected:new Set(),
    winner:null,
    musicOn:true,
    audioCtx:null,
    musicTimer:null,
    turnTimer:null
  };

  const $ = id => document.getElementById(id);
  const next = p => (p + 1) % 3;
  const playerName = p => p === 0 ? '我' : (p === 1 ? '左边电脑' : '右边电脑');

  function createDeck(){
    const deck=[];
    let id=0;
    for(let rank=3; rank<=15; rank++){
      for(const suit of SUITS) deck.push({id:id++, rank, suit});
    }
    deck.push({id:id++, rank:16, suit:'🃏'});
    deck.push({id:id++, rank:17, suit:'🃏'});
    return deck;
  }

  function shuffle(deck){
    for(let i=deck.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [deck[i],deck[j]]=[deck[j],deck[i]];
    }
    return deck;
  }

  function sortHand(hand){
    hand.sort((a,b)=>b.rank-a.rank || a.suit.localeCompare(b.suit));
  }

  function counts(cards){
    const m=new Map();
    cards.forEach(c=>m.set(c.rank,(m.get(c.rank)||0)+1));
    return m;
  }

  function consecutive(ranks){
    if(!ranks.length || ranks[ranks.length-1] > 14) return false;
    for(let i=1;i<ranks.length;i++) if(ranks[i] !== ranks[i-1] + 1) return false;
    return true;
  }

  function analyze(cards){
    if(!cards || !cards.length) return null;
    const n=cards.length;
    const m=counts(cards);
    const ranks=[...m.keys()].sort((a,b)=>a-b);
    const arr=[...m.entries()].sort((a,b)=>a[0]-b[0]);
    const byCount = k => arr.filter(([,v])=>v===k).map(([r])=>r);

    if(n===1) return {type:'single', main:ranks[0], len:1};
    if(n===2 && ranks.length===2 && ranks[0]===16 && ranks[1]===17) return {type:'rocket', main:17, len:2};
    if(n===2 && ranks.length===1) return {type:'pair', main:ranks[0], len:2};
    if(n===3 && ranks.length===1) return {type:'triple', main:ranks[0], len:3};
    if(n===4 && ranks.length===1) return {type:'bomb', main:ranks[0], len:4};
    if(n===4 && byCount(3).length===1) return {type:'triple1', main:byCount(3)[0], len:4};
    if(n===5 && byCount(3).length===1 && byCount(2).length===1) return {type:'triple2', main:byCount(3)[0], len:5};

    if(n>=5 && ranks.length===n && consecutive(ranks)) return {type:'straight', main:ranks[ranks.length-1], len:n};
    if(n>=6 && n%2===0 && ranks.length===n/2 && arr.every(([,v])=>v===2) && consecutive(ranks))
      return {type:'pairStraight', main:ranks[ranks.length-1], len:n};

    const tripleRanks=byCount(3);
    if(tripleRanks.length>=2 && consecutive(tripleRanks)){
      if(n===tripleRanks.length*3 && arr.every(([,v])=>v===3))
        return {type:'airplane', main:tripleRanks[tripleRanks.length-1], len:n, seq:tripleRanks.length};
      if(n===tripleRanks.length*4){
        let remain=0;
        arr.forEach(([r,v])=>{ if(!tripleRanks.includes(r)) remain+=v; });
        if(remain===tripleRanks.length)
          return {type:'airplane1', main:tripleRanks[tripleRanks.length-1], len:n, seq:tripleRanks.length};
      }
      if(n===tripleRanks.length*5){
        const others=arr.filter(([r])=>!tripleRanks.includes(r));
        if(others.length===tripleRanks.length && others.every(([,v])=>v===2))
          return {type:'airplane2', main:tripleRanks[tripleRanks.length-1], len:n, seq:tripleRanks.length};
      }
    }

    if(n===6 && byCount(4).length===1) return {type:'four2', main:byCount(4)[0], len:6};
    if(n===8 && byCount(4).length===1){
      const four=byCount(4)[0];
      const others=arr.filter(([r])=>r!==four);
      if(others.length===2 && others.every(([,v])=>v===2)) return {type:'four2pair', main:four, len:8};
    }
    return null;
  }

  function canBeat(a,b){
    if(!a) return false;
    if(!b) return true;
    if(a.type==='rocket') return true;
    if(b.type==='rocket') return false;
    if(a.type==='bomb' && b.type!=='bomb') return true;
    if(a.type!=='bomb' && b.type==='bomb') return false;
    if(a.type!==b.type || a.len!==b.len) return false;
    if((a.seq||0)!==(b.seq||0)) return false;
    return a.main>b.main;
  }

  function rankGroups(hand){
    const m=new Map();
    hand.forEach(c=>{ if(!m.has(c.rank)) m.set(c.rank,[]); m.get(c.rank).push(c); });
    return m;
  }

  function uniqueByIds(list){
    const seen=new Set();
    return list.filter(cards=>{
      const key=cards.map(c=>c.id).sort((a,b)=>a-b).join('-');
      if(seen.has(key)) return false;
      seen.add(key); return true;
    });
  }

  function generateCandidates(hand){
    const g=rankGroups(hand);
    const ranks=[...g.keys()].sort((a,b)=>a-b);
    const c=[];
    ranks.forEach(r=>{
      const a=g.get(r);
      c.push([a[0]]);
      if(a.length>=2) c.push(a.slice(0,2));
      if(a.length>=3) c.push(a.slice(0,3));
      if(a.length===4) c.push(a.slice(0,4));
    });
    if(g.has(16)&&g.has(17)) c.push([g.get(16)[0],g.get(17)[0]]);

    // 三带一 / 三带二
    ranks.filter(r=>g.get(r).length>=3).forEach(t=>{
      const triple=g.get(t).slice(0,3);
      for(const r of ranks){
        if(r!==t) c.push([...triple,g.get(r)[0]]);
      }
      for(const r of ranks){
        if(r!==t && g.get(r).length>=2) c.push([...triple,...g.get(r).slice(0,2)]);
      }
    });

    // 顺子
    const singles=ranks.filter(r=>r<=14);
    for(let i=0;i<singles.length;i++){
      for(let j=i+4;j<singles.length;j++){
        const seq=singles.slice(i,j+1);
        if(consecutive(seq)) c.push(seq.map(r=>g.get(r)[0]));
        else break;
      }
    }

    // 连对
    const pairs=ranks.filter(r=>r<=14 && g.get(r).length>=2);
    for(let i=0;i<pairs.length;i++){
      for(let j=i+2;j<pairs.length;j++){
        const seq=pairs.slice(i,j+1);
        if(consecutive(seq)) c.push(seq.flatMap(r=>g.get(r).slice(0,2)));
        else break;
      }
    }

    // 飞机（纯三顺 + 简单单翅/对翅）
    const triples=ranks.filter(r=>r<=14 && g.get(r).length>=3);
    for(let i=0;i<triples.length;i++){
      for(let j=i+1;j<triples.length;j++){
        const seq=triples.slice(i,j+1);
        if(!consecutive(seq)) break;
        const core=seq.flatMap(r=>g.get(r).slice(0,3));
        c.push(core);
        const outsiders=ranks.filter(r=>!seq.includes(r));
        if(outsiders.length>=seq.length) c.push([...core,...outsiders.slice(0,seq.length).map(r=>g.get(r)[0])]);
        const pairOut=outsiders.filter(r=>g.get(r).length>=2);
        if(pairOut.length>=seq.length) c.push([...core,...pairOut.slice(0,seq.length).flatMap(r=>g.get(r).slice(0,2))]);
      }
    }

    // 四带二
    ranks.filter(r=>g.get(r).length===4).forEach(f=>{
      const core=g.get(f).slice(0,4);
      const outsiders=ranks.filter(r=>r!==f);
      const singles=[];
      outsiders.forEach(r=>singles.push(...g.get(r)));
      if(singles.length>=2) c.push([...core,...singles.slice(0,2)]);
      const pairOut=outsiders.filter(r=>g.get(r).length>=2);
      if(pairOut.length>=2) c.push([...core,...pairOut.slice(0,2).flatMap(r=>g.get(r).slice(0,2))]);
    });

    return uniqueByIds(c).filter(cards=>analyze(cards));
  }

  function chooseAiPlay(player){
    const hand=state.hands[player];
    const target = state.lastPlay && state.lastPlay.player!==player ? state.lastPlay.combo : null;
    const candidates=generateCandidates(hand)
      .map(cards=>({cards, combo:analyze(cards)}))
      .filter(x=>!target || canBeat(x.combo,target));
    if(!candidates.length) return null;

    candidates.sort((a,b)=>{
      const bombA = ['bomb','rocket'].includes(a.combo.type) ? 1 : 0;
      const bombB = ['bomb','rocket'].includes(b.combo.type) ? 1 : 0;
      if(target && bombA!==bombB) return bombA-bombB; // 能不用炸弹就不用
      if(!target && bombA!==bombB) return bombA-bombB;
      if(!target && a.cards.length!==b.cards.length) return b.cards.length-a.cards.length; // 主动多走牌
      if(a.combo.main!==b.combo.main) return a.combo.main-b.combo.main;
      return b.cards.length-a.cards.length;
    });
    return candidates[0];
  }

  function removeCards(hand,cards){
    const ids=new Set(cards.map(c=>c.id));
    return hand.filter(c=>!ids.has(c.id));
  }

  function cardLabel(c){
    if(c.rank>=16) return RANK_TEXT[c.rank];
    return `${RANK_TEXT[c.rank]}${c.suit}`;
  }

  function comboText(combo){
    const map={single:'单牌',pair:'对子',triple:'三张',triple1:'三带一',triple2:'三带二',straight:'顺子',pairStraight:'连对',airplane:'飞机',airplane1:'飞机带单',airplane2:'飞机带对',four2:'四带二',four2pair:'四带两对',bomb:'炸弹',rocket:'王炸'};
    return map[combo?.type]||'出牌';
  }

  function speak(text){
    try{
      if(!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.lang='zh-CN'; u.rate=.95; u.pitch=1;
      speechSynthesis.speak(u);
    }catch(e){}
  }

  function startMusic(){
    if(!state.musicOn || state.musicTimer) return;
    try{
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext) return;
      state.audioCtx=state.audioCtx||new AudioContext();
      const ctx=state.audioCtx;
      const scale=[261.63,329.63,392,523.25,392,329.63,293.66,349.23,440,587.33,440,349.23];
      let i=0;
      const ping=()=>{
        if(!state.musicOn) return;
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type='triangle'; osc.frequency.value=scale[i++%scale.length];
        gain.gain.setValueAtTime(0.0001,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035,ctx.currentTime+0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime+0.38);
      };
      ping(); state.musicTimer=setInterval(ping,460);
    }catch(e){}
  }

  function toggleMusic(){
    state.musicOn=!state.musicOn;
    $('music').textContent=state.musicOn?'🎵 音乐开':'🔇 音乐关';
    if(state.musicOn) startMusic();
    else { clearInterval(state.musicTimer); state.musicTimer=null; }
  }

  function render(){
    const left=state.hands[1].length, right=state.hands[2].length;
    $('left-count').textContent=`剩 ${left} 张`;
    $('right-count').textContent=`剩 ${right} 张`;
    $('me-count').textContent=`剩 ${state.hands[0].length} 张`;
    $('left-role').textContent=state.landlord===1?'地主':'农民';
    $('right-role').textContent=state.landlord===2?'地主':'农民';
    $('me-role').textContent=state.landlord===0?'地主':'农民';

    $('bottom-cards').innerHTML=state.started ? state.bottom.map(c=>`<span class="mini-card">${cardLabel(c)}</span>`).join('') : '';

    const last=state.lastPlay;
    $('center-play').innerHTML = last
      ? `<div class="play-owner">${playerName(last.player)} · ${comboText(last.combo)}</div><div class="played-cards">${last.cards.map(c=>`<span class="mini-card">${cardLabel(c)}</span>`).join('')}</div>`
      : `<div class="center-tip">${state.started?'新一轮，可任意出牌':'点击“开始游戏”'}</div>`;

    $('hand').innerHTML='';
    state.hands[0].forEach(card=>{
      const b=document.createElement('button');
      b.className='card'+(state.selected.has(card.id)?' selected':'')+(card.suit==='♥'||card.suit==='♦'?' red':'');
      b.dataset.id=card.id;
      b.innerHTML=`<strong>${RANK_TEXT[card.rank]}</strong><span>${card.rank>=16?'🃏':card.suit}</span>`;
      b.onclick=()=>toggleSelect(card.id);
      $('hand').appendChild(b);
    });

    document.querySelectorAll('.player-panel').forEach(x=>x.classList.remove('active'));
    if(state.started && state.winner===null){
      const active=state.current===0?'me-panel':(state.current===1?'left-panel':'right-panel');
      $(active).classList.add('active');
    }

    const myTurn=state.started && state.current===0 && state.winner===null;
    $('play').disabled=!myTurn;
    $('pass').disabled=!myTurn || !state.lastPlay || state.lastPlay.player===0;
    $('hint').disabled=!myTurn;
    if(state.winner!==null){
      $('status').textContent = state.winner===0 ? '🎉 你赢了！' : `本局 ${playerName(state.winner)} 获胜`;
    } else if(state.started){
      $('status').textContent = state.current===0 ? '轮到你出牌' : `${playerName(state.current)} 正在思考…`;
    }
  }

  function toggleSelect(id){
    if(!state.started || state.current!==0) return;
    state.selected.has(id)?state.selected.delete(id):state.selected.add(id);
    render();
  }

  function beginGame(){
    clearTimeout(state.turnTimer);
    state.started=true; state.winner=null; state.selected.clear(); state.lastPlay=null; state.passCount=0;
    const deck=shuffle(createDeck());
    state.hands=[deck.slice(0,17),deck.slice(17,34),deck.slice(34,51)];
    state.bottom=deck.slice(51);
    state.landlord=Math.floor(Math.random()*3);
    state.hands[state.landlord].push(...state.bottom);
    state.hands.forEach(sortHand);
    state.current=state.landlord;
    $('result').classList.add('hidden');
    $('status').textContent=`${playerName(state.landlord)} 当地主`;
    speak(`${playerName(state.landlord)}当地主，游戏开始`);
    startMusic();
    render();
    scheduleAi();
  }

  function finishIfNeeded(player){
    if(state.hands[player].length!==0) return false;
    state.winner=player;
    render();
    const humanWin = (state.landlord===0 && player===0) || (state.landlord!==0 && player!==state.landlord);
    const title = player===0 ? '恭喜你，赢了！' : `${playerName(player)} 获胜`;
    $('result-title').textContent=title;
    $('result-text').textContent=humanWin?'这一局我们赢了，再来一局吧！':'这一局输了没关系，再来一局！';
    $('result').classList.remove('hidden');
    speak(player===0?'恭喜你，赢了':'本局结束');
    return true;
  }

  function commitPlay(player,cards){
    const combo=analyze(cards);
    if(!combo) return {ok:false,msg:'这组牌不符合斗地主牌型'};
    const target=state.lastPlay && state.lastPlay.player!==player ? state.lastPlay.combo : null;
    if(target && !canBeat(combo,target)) return {ok:false,msg:'这组牌压不过上一手'};
    state.hands[player]=removeCards(state.hands[player],cards);
    state.lastPlay={player,cards:[...cards],combo};
    state.passCount=0;
    if(combo.type==='rocket') speak('王炸');
    else if(combo.type==='bomb') speak('炸弹');
    else if(player!==0) speak(comboText(combo));
    render();
    if(finishIfNeeded(player)) return {ok:true,finished:true};
    state.current=next(player);
    render();
    scheduleAi();
    return {ok:true};
  }

  function playSelected(){
    if(state.current!==0) return;
    const cards=state.hands[0].filter(c=>state.selected.has(c.id));
    if(!cards.length){ flash('请先选择要出的牌'); return; }
    const r=commitPlay(0,cards);
    if(!r.ok){ flash(r.msg); speak('这样不能出'); return; }
    state.selected.clear();
  }

  function pass(player=0){
    if(!state.started || state.winner!==null || state.current!==player) return;
    if(!state.lastPlay || state.lastPlay.player===player){ if(player===0) flash('你是本轮首出，不能不要'); return; }
    state.passCount++;
    if(player===0) speak('不要'); else speak('要不起');
    if(state.passCount>=2){
      const leader=state.lastPlay.player;
      state.lastPlay=null; state.passCount=0; state.current=leader;
    }else state.current=next(player);
    render(); scheduleAi();
  }

  function scheduleAi(){
    clearTimeout(state.turnTimer);
    if(!state.started || state.winner!==null || state.current===0) return;
    state.turnTimer=setTimeout(()=>{
      const p=state.current;
      const choice=chooseAiPlay(p);
      if(choice) commitPlay(p,choice.cards); else pass(p);
    },700+Math.random()*450);
  }

  function hint(){
    if(state.current!==0) return;
    const target=state.lastPlay && state.lastPlay.player!==0 ? state.lastPlay.combo : null;
    const options=generateCandidates(state.hands[0]).map(cards=>({cards,combo:analyze(cards)})).filter(x=>!target||canBeat(x.combo,target));
    if(!options.length){ flash('没有能出的牌，可以点“不要”'); speak('要不起'); return; }
    options.sort((a,b)=>{
      const ba=['bomb','rocket'].includes(a.combo.type)?1:0, bb=['bomb','rocket'].includes(b.combo.type)?1:0;
      if(ba!==bb) return ba-bb;
      if(!target && a.cards.length!==b.cards.length) return b.cards.length-a.cards.length;
      return a.combo.main-b.combo.main;
    });
    state.selected.clear(); options[0].cards.forEach(c=>state.selected.add(c.id)); render();
  }

  function flash(msg){
    $('toast').textContent=msg; $('toast').classList.add('show');
    setTimeout(()=>$('toast').classList.remove('show'),1500);
  }

  $('start').onclick=beginGame;
  $('play').onclick=playSelected;
  $('pass').onclick=()=>pass(0);
  $('hint').onclick=hint;
  $('music').onclick=toggleMusic;
  $('again').onclick=beginGame;
  render();
})();