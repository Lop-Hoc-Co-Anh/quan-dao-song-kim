// Lõi dùng chung cho các trò chơi Đảo Song Kim.
// Mỗi trò gọi TroChoi.run(game) với: id, title, unit, story, icon, words[{w,img,alt}], defaultWords,
// buildScene(api), onStart(api), onTurn(api, ctx), onCorrect(api, ctx) -> Promise, onSkip(api, ctx), onFinish(api) -> Promise,
// tuỳ chọn: guessFirst (ẩn thẻ từ cho tới khi đoán), progress(api) -> [số, tổng], cardPos {x,y}, micPos {x,y}.
(function () {
  const $ = id => document.getElementById(id);
  const QS = new URLSearchParams(location.search), FROM_ISLAND = QS.has('tu_dao'), TIET = QS.get('tiet');
  const TU = (QS.get('tu') || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const ISLAND = '../../' + ({ dao_hat_mam: 'dao_hat_mam/dao-hat-mam.html', dao_cau_vong: 'dao_cau_vong/dao-cau-vong.html' }[new URLSearchParams(location.search).get('dao')] || 'dao_3d/dao-song-kim-3d.html');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const H = (cls, inner = '') => inner;

  // ---------- khung trang ----------
  function scaffold(G) {
    document.body.insertAdjacentHTML('afterbegin', `
<div id="stage">
  <div id="scene"></div>
  <div class="say" id="say" hidden></div>
  <div class="hud"><div class="chip">${esc(G.title)} <small id="hudSub">· ${esc(G.unit)}</small></div><div class="spacer"></div>
    <div class="chip"><img src="${G.icon}" alt=""><b id="prog">0 / 0</b><small>${esc(G.progressLabel || '')}</small></div></div>
  <div class="stt" id="stt" hidden></div>
  <div class="hint" id="hint" hidden></div>
  <div class="turn" id="turn" hidden><small>Lượt của</small><span id="turnName"></span></div>
  <div class="card" id="card" hidden><img id="cardImg" src="" alt=""><div class="w" id="cardWord"></div></div>
  <div class="mic" id="micRow" hidden>
    <button class="micBtn" id="micBtn" title="Nghe bé đọc (phím cách)"><svg viewBox="0 0 24 24"><rect x="8.5" y="2.5" width="7" height="12" rx="3.5" fill="#fff"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg></button>
    <div class="heard" id="heard"><b id="heardLbl">MÁY ĐANG NGHE</b><span id="heardTxt">…</span></div>
  </div>
  <div class="keys" id="keys" hidden>
    <button class="k" id="kRepeat">Đọc mẫu lại<kbd>R</kbd></button>
    <button class="k" id="kListen">Nghe lại<kbd>Space</kbd></button>
    <button class="k go" id="kOk">Đúng rồi<kbd>Enter</kbd></button>
    <button class="k" id="kSkip">Bỏ qua lượt<kbd>S</kbd></button>
    <button class="k" id="kSetup">Cài đặt<kbd>Esc</kbd></button>
    <button class="k" id="kPeek" title="Cô xem máy nghe được gì">Máy nghe được<kbd>H</kbd></button>
    <button class="k" id="kFull">Toàn màn hình<kbd>F</kbd></button>
    <button class="k quit" id="kQuit">${FROM_ISLAND ? 'Về đảo' : 'Thoát'}<kbd>Q</kbd></button>
  </div>
  <div class="ov" id="ovSetup">
    <div class="panel">
      <h1><small>Đảo Song Kim · Thử thách${TIET ? ' · Tiết ' + esc(TIET) : ''}</small>${esc(G.title)}</h1>
      <p>${G.story}</p>
      <div class="grid2">
        <div><label class="t" for="names">Danh sách các bé (mỗi dòng một tên)</label><textarea id="names" spellcheck="false"></textarea></div>
        <div><label class="t">Chọn từ cho tiết này</label><div class="words" id="wordPick"></div>
          <div class="opts">
            <label><input type="checkbox" id="optSpeak"> Máy đọc mẫu từ</label>
            <label><input type="checkbox" id="optAuto"> Đọc mẫu xong tự bật nghe</label>
            <label><input type="checkbox" id="optMic"> Máy nghe để chấm</label>
            <label title="Tiếng nói trong lớp được Chrome gửi lên Google (Edge: Microsoft) để nhận dạng"><input type="checkbox" id="optConsent"> Phụ huynh đã đồng ý cho máy nghe</label>
            <label><input type="checkbox" id="optShuffle"> Đảo thứ tự các bé</label>
          </div></div>
      </div>
      <div class="row"><span class="note" id="micNote">Máy nghe dùng micro của máy tính và cần có mạng. Nếu máy nghe nhầm, cô bấm Enter để công nhận bé đọc đúng.</span>
        <button class="big sec" id="bQuit1">${FROM_ISLAND ? 'Về đảo' : 'Thoát'}</button><button class="big" id="bStart">Bắt đầu</button></div>
    </div>
  </div>
  <div class="ov" id="ovDone" hidden>
    <div class="panel done"><h1><small>${esc(G.doneSmall || 'Hoàn thành thử thách')}</small>${esc(G.doneTitle || 'Giỏi quá!')}</h1>
      <img class="gem" src="../chung/hinh/da_phat_sang.webp" alt="Đá sáng">
      <p>Cả lớp nhận <b>1 viên đá sáng</b> mang về rương ở Trại Song Kim.</p>
      <div class="names" id="doneNames"></div>
      <div class="row" style="justify-content:center"><button class="big sec" id="bAgain">Chơi lại</button><button class="big" id="bNext">${FROM_ISLAND ? 'Về đảo, đi tiếp' : 'Đổi danh sách'}</button></div>
    </div>
  </div>
  <div class="ov" id="ovBye" hidden><div class="panel done"><h1><small>Đã tắt trò chơi</small>Hẹn gặp lại!</h1><p>Nếu cửa sổ chưa tự đóng, bấm <b>Alt + F4</b> hoặc nút <b>X</b> ở góc trên bên phải để đóng.</p></div></div>
  <canvas class="fx" id="fx" width="1600" height="900"></canvas>
</div>`);
    if (TIET) $('hudSub').textContent = `· Tiết ${TIET} · ${QS.get('unit') || G.unit}`;
    if (G.cardPos) { $('card').style.left = G.cardPos.x + 'px'; $('card').style.top = G.cardPos.y + 'px'; }
    if (G.micPos) { $('micRow').style.left = G.micPos.x + 'px'; $('micRow').style.top = G.micPos.y + 'px'; }
    const stage = $('stage'), fit = () => { const k = Math.min(innerWidth / 1600, innerHeight / 900); stage.style.transform = `translate(-50%, -50%) scale(${k})`; };
    addEventListener('resize', fit); fit();
  }

  // ---------- âm thanh ----------
  let AC = null;
  const ac = () => { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; };
  function tone(f, t0, d, type = 'triangle', v = .18) { const a = ac(), o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, a.currentTime + t0); g.gain.linearRampToValueAtTime(v, a.currentTime + t0 + .01); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + t0 + d); o.connect(g).connect(a.destination); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + d + .05); }
  const sfx = {
    good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .08, .35)); },
    thunk() { tone(140, 0, .18, 'square', .12); tone(90, .03, .2, 'sine', .2); },
    try() { tone(587, 0, .22, 'sine', .14); tone(784, .14, .3, 'sine', .14); }, // khuyến khích, không phải tiếng thua
    fanfare() { [[523, 0], [659, .15], [784, .3], [1047, .5], [784, .7], [1047, .85]].forEach(([f, t]) => { tone(f, t, .4, 'square', .08); tone(f / 2, t, .4, 'triangle', .12); }); },
    pop() { tone(880, 0, .12, 'sine', .15); },
    rustle() { const a = ac(), n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * .5, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * .5; n.buffer = b; const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2500; const g = a.createGain(); g.gain.value = .25; n.connect(f).connect(g).connect(a.destination); n.start(); },
    boing() { const a = ac(), o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(220, a.currentTime); o.frequency.exponentialRampToValueAtTime(660, a.currentTime + .18); o.frequency.exponentialRampToValueAtTime(330, a.currentTime + .35); g.gain.setValueAtTime(.22, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + .45); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5); },
  };

  // ---------- máy đọc ----------
  let VOICE = null;
  const pickVoice = () => { const vs = speechSynthesis.getVoices(); VOICE = vs.find(v => /en-US/i.test(v.lang) && /Jenny|Aria|Google US|Zira/i.test(v.name)) || vs.find(v => /^en/i.test(v.lang)) || null; };
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  const hasEnVoice = () => !!VOICE;

  // ---------- chạy trò ----------
  window.TroChoi = { run(G) {
    scaffold(G);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const KEY = 'trochoi_' + G.id;
    let cfg = { words: G.defaultWords.slice(), speak: true, auto: true, mic: true, shuffle: false };
    try { Object.assign(cfg, JSON.parse(localStorage.getItem(KEY) || 'null') || {}); } catch (e) {}
    let names = 'Bé An\nBé Bin\nBé Na\nBé Tôm\nBé Su\nBé Bơ\nBé Mít\nBé Cốm';
    try { names = localStorage.getItem('trochoi_names') || localStorage.getItem('ghepvancau') && JSON.parse(localStorage.getItem('ghepvancau')).names || names; } catch (e) {}
    const baseWords = cfg.words.slice(); // lựa chọn riêng của cô; từ của tiết trên đảo chỉ dùng cho lần chơi này
    const saveCfg = () => { try { localStorage.setItem(KEY, JSON.stringify(FROM_ISLAND ? { ...cfg, words: baseWords } : cfg)); localStorage.setItem('trochoi_names', names); } catch (e) {} };
    if (FROM_ISLAND) { const TU2 = TU.flatMap(t => [t, t.replace(/s$/, ''), t.split(' ')[0]]), lw = W => W.w.toLowerCase(), m = G.words.filter(W => TU2.includes(lw(W)) || TU2.includes(lw(W).replace(/s$/, ''))).map(W => W.w); if (m.length >= 1) { // thiếu thì lấy thêm từ đứng cạnh (cùng nhóm bài) trong danh sách của trò
        const grp = W => W.g || 'goc', gs = new Set(m.map(w => grp(G.words.find(W => W.w === w)))), same = G.words.filter(W => gs.has(grp(W))), idx = m.map(w => same.findIndex(W => W.w === w)), lo = Math.min(...idx), hi = Math.max(...idx), near = [];
        for (let d = 1; d < same.length && m.length + near.length < 4; d++) { [hi + d, lo - d].forEach(k => { const W = same[k]; if (W && !m.includes(W.w) && !near.includes(W.w) && m.length + near.length < 4) near.push(W.w); }); }
        cfg.words = m.concat(near); } }

    let state = 'setup', kids = [], words = [], turnIdx = 0, cur = null, rec = null, results = [];
    const api = {
      G, sfx, $, esc, get kids() { return kids; }, get words() { return words; }, get results() { return results; }, get turnIdx() { return turnIdx; },
      stage: $('stage'), scene: $('scene'),
      sprite(id, img, x, y, h, cls = '') { let e = $('s_' + id); if (!e) { e = document.createElement('img'); e.id = 's_' + id; e.alt = ''; api.scene.appendChild(e); } e.className = 'spr ' + cls; e.src = img; Object.assign(e.style, { left: x + 'px', top: y + 'px', height: h + 'px' }); return e; },
      pose(id, img) { const e = $('s_' + id); if (e) e.src = img; },
      say(t, x, y) { const s = $('say'); if (!t) { s.hidden = true; return; } s.hidden = false; s.textContent = t; if (x != null) { s.style.left = x + 'px'; s.style.top = y + 'px'; } },
      speak(text, rate = .85) { return new Promise(res => { if (!cfg.speak || !('speechSynthesis' in window) || !hasEnVoice()) return res(); speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.voice = VOICE; u.rate = rate; u.pitch = 1.1; let d = false; const f = () => { if (!d) { d = true; res(); } }; u.onend = f; u.onerror = f; setTimeout(f, Math.min(4500, 1500 + text.length * 110)); speechSynthesis.speak(u); }); },
      wait: ms => new Promise(r => setTimeout(r, ms)),
      sparkle, confetti, progress() { const [a, b] = G.progress ? G.progress(api) : [results.filter(r => r.ok).length, kids.length]; $('prog').textContent = `${a} / ${b}`; },
      showCard(W) { $('cardImg').src = W.img; $('cardImg').alt = W.w; $('cardWord').textContent = W.w; const c = $('card'); c.hidden = false; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); sfx.pop(); },
      hideCard() { $('card').hidden = true; },
      tween(dur, fn) { return new Promise(res => { const t0 = performance.now(); const st = now => { const k = Math.min(1, (now - t0) / dur); fn(k, k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); if (k < 1) requestAnimationFrame(st); else res(); }; requestAnimationFrame(st); }); },
    };
    G.buildScene && G.buildScene(api);

    const consent = () => { try { return localStorage.getItem('songkim_dongy_mic') === '1'; } catch (e) { return false; } };
    function heard(lbl, txt) { $('heardLbl').textContent = lbl; $('heardTxt').textContent = txt; }
    let lastHeard = '', peek = false, hintT = 0;
    const status = (t, kind) => { const e = $('stt'); if (!t) { e.hidden = true; return; } e.hidden = false; e.textContent = t; e.className = 'stt ' + (kind || ''); };
    const hint = t => { const e = $('hint'); clearTimeout(hintT); if (!t) { e.hidden = true; return; } e.hidden = false; e.textContent = t; hintT = setTimeout(() => e.hidden = true, 1800); };
    const showPeek = () => { if (peek) $('heardTxt').textContent = lastHeard ? 'Máy nghe được: “' + lastHeard + '”' : 'Máy chưa nghe được gì.'; };
    addEventListener('offline', () => status('Mất mạng · máy nghe tạm nghỉ, cô chấm bằng Enter', 'bad'));
    addEventListener('online', () => status(''));
    setTimeout(() => { if ('speechSynthesis' in window && !hasEnVoice()) { status('Máy chưa có giọng đọc tiếng Anh · cô đọc mẫu giúp', 'warn'); const n = $('micNote'); if (n) { n.textContent = 'Máy tính này chưa có giọng đọc tiếng Anh nên máy sẽ không đọc mẫu, cô đọc mẫu giúp. Cài thêm: Cài đặt Windows > Thời gian và ngôn ngữ > Giọng nói > thêm English (United States).'; n.classList.add('warn'); } } }, 1500);
    // máy nghe: nghe liên tục ~8 giây, so khớp theo âm (chung/may_nghe.js)
    function stopListen() { $('micBtn').classList.remove('on'); window.MayNghe && MayNghe.stop(); }
    function listen() {
      if (state !== 'turn') return;
      stopListen(); $('micBtn').classList.remove('ok', 'no'); lastHeard = '';
      if (cfg.mic && SR && !consent()) { heard('CÔ CHẤM', 'Máy nghe chưa bật cho lớp này (chưa có đồng ý của phụ huynh). Bé đọc đúng thì cô bấm Enter.'); return; }
      if (!cfg.mic || !SR || !window.MayNghe) { heard('CÔ CHẤM', SR ? 'Máy nghe đang tắt. Bé đọc đúng thì cô bấm Enter.' : 'Máy này chưa nghe được. Bé đọc đúng thì cô bấm Enter.'); return; }
      const me = cur;
      MayNghe.start({ word: cur.word, others: G.words.map(W => W.w), ms: 8000,
        onStart: () => { $('micBtn').classList.add('on'); heard('MÁY ĐANG NGHE', 'Bé đọc to nhé…'); showPeek(); },
        onHeard: txt => { if (cur !== me) return; lastHeard = txt; if (navigator.onLine) status(''); showPeek(); },
        onMatch: () => { if (cur === me && state === 'turn') correct(); },
        onError: k => { $('micBtn').classList.remove('on'); const net = k === 'network';
          status(net ? 'Mất mạng · máy nghe tạm nghỉ, cô chấm bằng Enter' : 'Chưa có micro · bấm biểu tượng micro trên thanh địa chỉ để cho phép', 'bad');
          heard('CÔ CHẤM', net ? 'Máy nghe cần có mạng. Bé đọc đúng thì cô bấm Enter.' : 'Máy chưa dùng được micro. Bé đọc đúng thì cô bấm Enter.'); },
        onFail: async () => { if (cur !== me || state !== 'turn') return; $('micBtn').classList.remove('on'); sfx.try();
          heard('CẢ LỚP CÙNG ĐỌC', 'Let’s say it together!'); showPeek();
          await api.speak("Let's say it together! " + cur.word.w, .9); if (cur !== me || state !== 'turn') return;
          heard('ĐỌC LẠI NÀO', 'Bé đọc lại (phím cách) hoặc cô bấm Enter.'); showPeek(); } });
    }
    async function model() {
      const me = cur; api.showCard(cur.word); heard('NGHE MẪU', 'Cô đọc mẫu, cả lớp nghe…');
      await api.speak(cur.word.w); await api.wait(350); if (cur !== me) return;
      await api.speak('Your turn!', .95); if (cur !== me) return;
      if (cfg.auto) listen(); else heard('SẴN SÀNG', 'Bấm micro hoặc phím cách để máy nghe.');
    }
    async function nextTurn() {
      stopListen();
      if (turnIdx >= kids.length) return finish();
      const W = words[turnIdx % words.length]; cur = { kid: kids[turnIdx], word: W, i: turnIdx }; state = 'intro';
      $('turnName').textContent = cur.kid; $('turn').hidden = false; $('micRow').hidden = false; $('micBtn').classList.remove('ok', 'no');
      if (G.guessFirst) { api.hideCard(); heard('ĐOÁN XEM', 'Cả lớp đoán xem nào…'); }
      const me = cur; if (G.onTurn) await G.onTurn(api, cur); if (cur !== me || state !== 'intro') return;
      state = 'turn'; model();
    }
    async function correct() {
      if (state !== 'turn' && state !== 'intro') return; state = 'anim'; stopListen();
      $('micBtn').classList.remove('no'); $('micBtn').classList.add('ok'); heard('ĐÚNG RỒI!', cur.word.w);
      sfx.good(); const praise = ['Great job!', 'Well done!', 'Super!', 'Excellent!', 'Good job!'][turnIdx % 5]; api.speak(praise, .95);
      results[turnIdx] = { kid: cur.kid, word: cur.word, ok: true };
      if (G.onCorrect) await G.onCorrect(api, cur, praise); api.progress();
      await api.wait(500); turnIdx++; nextTurn();
    }
    async function skip() {
      if (state !== 'turn' && state !== 'intro') return; stopListen(); state = 'anim';
      results[turnIdx] = { kid: cur.kid, word: cur.word, ok: false };
      if (G.onSkip) await G.onSkip(api, cur); api.progress(); turnIdx++; nextTurn();
    }
    async function finish() {
      state = 'finish'; ['turn', 'card', 'micRow'].forEach(i => $(i).hidden = true); stopListen();
      try { const K = 'songkim_vinhdanh', v = JSON.parse(localStorage.getItem(K) || '{}'); kids.forEach((k, i) => { const r = v[k] || (v[k] = { dung: 0, luot: 0 }); r.luot++; if (results[i] && results[i].ok) r.dung++; }); localStorage.setItem(K, JSON.stringify(v)); } catch (e) {} // ghi cho bảng vinh danh
      sfx.fanfare(); api.speak("Hooray! Well done, everyone!", .95);
      if (G.onFinish) await G.onFinish(api);
      confetti(); sfx.fanfare();
      $('doneNames').innerHTML = kids.map(k => `<span>${esc(k)}</span>`).join(''); // mọi bé như nhau, không đánh dấu bé bỏ lượt
      setTimeout(() => { $('ovDone').hidden = false; $('bNext').focus(); state = 'done'; }, 800);
    }
    function start() {
      names = $('names').value; saveCfg();
      kids = names.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 20);
      if (!kids.length) { $('names').focus(); return; }
      if (cfg.shuffle) for (let i = kids.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [kids[i], kids[j]] = [kids[j], kids[i]]; }
      words = G.words.filter(W => cfg.words.includes(W.w)); if (words.length < 2) words = G.words.filter(W => G.defaultWords.includes(W.w));
      turnIdx = 0; results = [];
      $('ovSetup').hidden = true; $('ovDone').hidden = true; $('keys').hidden = false;
      ac(); if (G.onStart) G.onStart(api); api.progress(); nextTurn();
    }
    function goIsland(res) { stopListen(); try { speechSynthesis.cancel(); } catch (e) {} location.href = `${ISLAND}?ve=thu_thach&ket_qua=${res}`; }
    function quit() {
      if (FROM_ISLAND) return goIsland(state === 'done' ? 'xong' : 'bo_do');
      stopListen(); try { speechSynthesis.cancel(); } catch (e) {} state = 'bye';
      ['ovSetup', 'ovDone'].forEach(i => $(i).hidden = true); ['keys', 'turn', 'card', 'micRow'].forEach(i => $(i).hidden = true); $('ovBye').hidden = false;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      fetch('/quit', { method: 'POST' }).catch(() => {}); setTimeout(() => { try { window.close(); } catch (e) {} }, 400);
    }
    function openSetup() { stopListen(); try { speechSynthesis.cancel(); } catch (e) {} state = 'setup'; buildSetup(); $('ovDone').hidden = true; $('ovSetup').hidden = false; $('bStart').focus(); }
    function buildSetup() {
      $('names').value = names;
      $('wordPick').innerHTML = G.words.map(W => `<label class="wpick ${cfg.words.includes(W.w) ? 'on' : ''}"><input type="checkbox" value="${W.w}" ${cfg.words.includes(W.w) ? 'checked' : ''}><img src="${W.img}" alt=""><span>${W.w}</span></label>`).join('');
      $('wordPick').querySelectorAll('input').forEach(inp => inp.onchange = () => { inp.parentElement.classList.toggle('on', inp.checked); cfg.words = [...$('wordPick').querySelectorAll('input:checked')].map(i => i.value); saveCfg(); });
      [['optSpeak', 'speak'], ['optAuto', 'auto'], ['optMic', 'mic'], ['optShuffle', 'shuffle']].forEach(([id, k]) => { $(id).checked = cfg[k]; $(id).onchange = () => { cfg[k] = $(id).checked; saveCfg(); }; });
      $('optConsent').checked = consent(); $('optConsent').onchange = () => { try { localStorage.setItem('songkim_dongy_mic', $('optConsent').checked ? '1' : '0'); } catch (e) {} };
      if (!SR) { $('micNote').textContent = 'Trình duyệt này chưa có máy nghe. Hãy mở bằng Chrome hoặc Edge. Tạm thời cô bấm Enter khi bé đọc đúng.'; $('micNote').classList.add('warn'); }
    }
    $('bStart').onclick = () => { start(); if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); };
    $('bAgain').onclick = start; $('bNext').onclick = () => FROM_ISLAND ? goIsland('xong') : openSetup();
    $('bQuit1').onclick = $('kQuit').onclick = quit;
    $('micBtn').onclick = () => listen(); $('kListen').onclick = () => listen(); $('kRepeat').onclick = () => { if (state === 'turn') { stopListen(); model(); } };
    $('kOk').onclick = correct; $('kSkip').onclick = skip; $('kSetup').onclick = openSetup;
    $('kPeek').onclick = () => { peek = !peek; showPeek(); };
    $('kFull').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen(); };
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'q' || e.key === 'Q') { if (state === 'bye') return; const now = performance.now(); if (now - (window.__qAt || -1e9) < 1800) return quit(); window.__qAt = now; return hint(FROM_ISLAND ? 'Bấm Q lần nữa để về đảo' : 'Bấm Q lần nữa để thoát'); }
      if (e.key === 'h' || e.key === 'H') { peek = !peek; if (peek) showPeek(); else if (state === 'turn') heard('MÁY ĐANG NGHE', 'Bé đọc to nhé…'); return; }
      if (state === 'bye') return;
      if (e.key === 'f' || e.key === 'F') return $('kFull').onclick();
      if (state === 'setup') { if (e.key === 'Enter') start(); return; }
      if (state === 'done') { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); FROM_ISLAND ? goIsland('xong') : start(); } if (e.key === 'Escape') openSetup(); return; }
      if (e.key === 'Escape') return openSetup();
      if (state !== 'turn' && state !== 'intro') return;
      if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); correct(); }
      else if (e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); if (state === 'intro') { state = 'turn'; model(); } else listen(); }
      else if (e.key === 'r' || e.key === 'R' || e.key === 'ArrowUp') { if (state === 'turn') { stopListen(); model(); } }
      else if (e.key === 's' || e.key === 'S') skip();
    });
    buildSetup();
    window.__tro = { api, cfg, correct, skip, get state() { return state; } };
  } };

  // ---------- hiệu ứng ----------
  let parts = [], g = null;
  function sparkle(x, y, n = 26) { for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 2, life: 1, c: ['#FFD23F', '#FFFFFF', '#FF9A2E'][i % 3], s: 4 + Math.random() * 5, star: true }); }
  function confetti() { for (let i = 0; i < 180; i++) parts.push({ x: 800 + (Math.random() - .5) * 300, y: 330, vx: (Math.random() - .5) * 24, vy: -Math.random() * 22 - 6, life: 1.6, c: ['#F2675A', '#FFD23F', '#14998F', '#5B5FD6', '#E05B8C', '#78C04C'][i % 6], s: 8 + Math.random() * 10, r: Math.random() * 6 }); }
  function loop() {
    if (!g) { const c = document.getElementById('fx'); if (c) g = c.getContext('2d'); else return requestAnimationFrame(loop); }
    g.clearRect(0, 0, 1600, 900); parts = parts.filter(p => (p.life -= .016) > 0);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .45; g.globalAlpha = Math.min(1, p.life); g.fillStyle = p.c; if (p.star) { g.beginPath(); g.arc(p.x, p.y, p.s * p.life, 0, 6.3); g.fill(); } else { p.r += .2; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); } });
    g.globalAlpha = 1; requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
