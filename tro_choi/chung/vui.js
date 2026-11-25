// Cho trẻ hào hứng hơn: tiếng reo + sao bay khi bé nói đúng, chia hai đội thi đua, huy hiệu cho từng bé cuối trò.
// Dùng chung cho chung.js và Ghép ván cầu. Tự thêm ô "Chia hai đội thi đua" vào bảng chuẩn bị.
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DAO = new URLSearchParams(location.search).get('dao') || 'dao_3d';
  const K = 'songkim_hai_doi', CO_DOI_SAN = /dua_thuyen/.test(location.pathname); // Đua thuyền đã có sẵn hai đội
  const TEAMS = [{ ten: 'Đội Cá Heo', icon: '🐬', mau: '#2E8FD8', bong: '#1C6AA8' }, { ten: 'Đội Cáo Nhỏ', icon: '🦊', mau: '#EF8A23', bong: '#B9640E' }];
  const BADGE = [['🦁', 'Sư tử dũng cảm'], ['🚀', 'Tên lửa nói to'], ['🌟', 'Ngôi sao tiếng Anh'], ['🦸', 'Siêu nhân nhí'], ['🐯', 'Hổ con nhanh nhẹn'], ['🎤', 'Ca sĩ tí hon'], ['🦄', 'Kỳ lân giỏi giang'], ['🐼', 'Gấu trúc chăm chỉ'], ['🌈', 'Cầu vồng tươi vui'], ['🏆', 'Nhà vô địch nhí']];
  const css = `
.vuiBoard { position: absolute; left: 50%; top: 18px; transform: translateX(-50%); z-index: 6; display: flex; gap: 14px; }
.vuiTeam { display: flex; align-items: center; gap: 10px; color: #fff; border-radius: 22px; padding: 6px 18px 8px; font: 800 24px/1 'Baloo 2', sans-serif; white-space: nowrap; transition: transform .2s; }
.vuiTeam i { font-style: normal; font-size: 30px; } .vuiTeam b { font-size: 34px; min-width: 30px; text-align: center; }
.vuiTeam.on { outline: 5px solid #FFD23F; } .vuiTeam.pop { transform: scale(1.25); }
.vuiStar { position: absolute; z-index: 30; font-size: 64px; pointer-events: none; transition: left .9s cubic-bezier(.3, .7, .4, 1), top .9s cubic-bezier(.5, -0.4, .6, 1), font-size .9s, opacity .3s .8s; filter: drop-shadow(0 4px 4px rgba(0, 0, 0, .25)); }
.vuiPlus { position: absolute; z-index: 30; font: 800 56px 'Baloo 2', sans-serif; color: #FFD23F; text-shadow: 0 4px 0 #B5463B, 0 0 12px rgba(255, 255, 255, .8); pointer-events: none; animation: vuiUp 1.3s ease-out forwards; }
@keyframes vuiUp { 0% { transform: translate(-50%, 0) scale(.4); opacity: 0; } 20% { transform: translate(-50%, -30px) scale(1.2); opacity: 1; } 100% { transform: translate(-50%, -150px) scale(1); opacity: 0; } }
.vuiBadges { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-height: 330px; overflow-y: auto; padding: 6px; }
.vuiBadge { width: 150px; background: #FFF6D6; border-radius: 18px; padding: 8px 6px 10px; text-align: center; box-shadow: 0 4px 0 rgba(150, 110, 0, .25); animation: vuiIn .5s cubic-bezier(.2, 1.6, .4, 1) both; }
.vuiBadge .e { font-size: 44px; line-height: 1.1; } .vuiBadge b { display: block; font: 800 22px/1.1 'Baloo 2', sans-serif; color: #1F2D4A; }
.vuiBadge small { display: block; font: 700 14px/1.2 'Nunito', sans-serif; color: #745000; margin-top: 2px; }
.vuiBadge img { height: 40px; margin-top: 4px; }
@keyframes vuiIn { from { transform: scale(.2) rotate(-12deg); opacity: 0; } }
.vuiKq { font: 800 26px 'Baloo 2', sans-serif; margin: 6px 0 4px; }
@media (prefers-reduced-motion: reduce) { .vuiStar, .vuiPlus, .vuiBadge { transition: none; animation: none; } }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  let on = (() => { try { const v = localStorage.getItem(K); return v == null ? DAO !== 'dao_hat_mam' : v === '1'; } catch (e) { return DAO !== 'dao_hat_mam'; } })();
  let score = [0, 0], active = false, cur = 0, AC = null;
  const stage = () => $('stage') || document.body;
  // ô chọn trong bảng chuẩn bị
  function ganNut() {
    const box = document.querySelector('#ovSetup .opts'); if (CO_DOI_SAN || !box || $('optHaiDoi')) { if ($('optHaiDoi')) $('optHaiDoi').checked = on; return; }
    box.insertAdjacentHTML('beforeend', `<label title="Các bé chia hai đội xen kẽ, bé nói đúng thì đội mình được sao"><input type="checkbox" id="optHaiDoi"> Chia hai đội thi đua 🐬🦊</label>`);
    $('optHaiDoi').checked = on; $('optHaiDoi').onchange = () => { on = $('optHaiDoi').checked; try { localStorage.setItem(K, on ? '1' : '0'); } catch (e) {} };
  }
  function an() { const b = $('vuiBoard'); if (b) b.remove(); active = false; }
  function batDau(n) {
    an(); score = [0, 0]; active = on && n > 1 && !CO_DOI_SAN; if (!active) return;
    stage().insertAdjacentHTML('beforeend', `<div class="vuiBoard" id="vuiBoard">${TEAMS.map((t, i) => `<div class="vuiTeam" id="vuiT${i}" style="background:${t.mau};box-shadow:0 5px 0 ${t.bong}"><i>${t.icon}</i>${t.ten}<b id="vuiS${i}">0</b></div>`).join('')}</div>`);
  }
  const doiCua = i => i % 2;
  function luot(i) {
    cur = i; const t = $('turn'); if (!t) return;
    if (!active) { t.style.background = ''; t.style.boxShadow = ''; return; }
    const T = TEAMS[doiCua(i)]; t.style.background = T.mau; t.style.boxShadow = `0 6px 0 ${T.bong}`;
    TEAMS.forEach((_, k) => { const e = $('vuiT' + k); if (e) e.classList.toggle('on', k === doiCua(i)); });
  }
  // tiếng cả lớp reo "yeah!" (tổng hợp, không cần file âm thanh)
  function reo() {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); const a = AC, t = a.currentTime;
      const n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * 1.4, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b;
      const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(1600, t + .3); f.Q.value = .8;
      const g = a.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22, t + .12); g.gain.exponentialRampToValueAtTime(.001, t + 1.3); n.connect(f).connect(g).connect(a.destination); n.start(t);
      [0, .05, .11, .16].forEach((dt, k) => { const o = a.createOscillator(), og = a.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(330 + k * 70, t + dt); o.frequency.exponentialRampToValueAtTime(520 + k * 90, t + dt + .25); o.frequency.exponentialRampToValueAtTime(420 + k * 60, t + dt + .8);
        const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800; og.gain.setValueAtTime(0, t + dt); og.gain.linearRampToValueAtTime(.035, t + dt + .08); og.gain.exponentialRampToValueAtTime(.001, t + dt + .9); o.connect(lp).connect(og).connect(a.destination); o.start(t + dt); o.stop(t + dt + 1); });
    } catch (e) {}
  }
  // vị trí một phần tử trong khung 1600x900
  function pos(el) {
    const S = stage(), sr = S.getBoundingClientRect(), k = sr.width / (S.offsetWidth || 1600);
    if (!el || el.hidden) return null; const r = el.getBoundingClientRect(); if (!r.width) return null;
    return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k };
  }
  function dung(i = cur) {
    reo(); const S = stage(), from = pos($('card')) || pos($('turn')) || { x: 800, y: 450 };
    const team = active ? doiCua(i) : -1, to = (team >= 0 && pos($('vuiS' + team))) || pos($('prog')) || { x: 1450, y: 40 };
    S.insertAdjacentHTML('beforeend', `<div class="vuiPlus" style="left:${from.x}px;top:${from.y - 60}px">+1 ⭐</div>`);
    setTimeout(() => S.querySelectorAll('.vuiPlus').forEach(e => e.remove()), 1400);
    for (let s = 0; s < 5; s++) {
      const e = document.createElement('div'); e.className = 'vuiStar'; e.textContent = '⭐';
      const sx = from.x + (Math.random() - .5) * 220, sy = from.y + (Math.random() - .5) * 160; e.style.left = sx + 'px'; e.style.top = sy + 'px'; S.appendChild(e);
      setTimeout(() => { e.style.left = (to.x - 16) + 'px'; e.style.top = (to.y - 20) + 'px'; e.style.fontSize = '30px'; e.style.opacity = '0'; }, 60 + s * 90);
      setTimeout(() => e.remove(), 1500 + s * 90);
    }
    if (team >= 0) setTimeout(() => { score[team]++; const b = $('vuiS' + team), p = $('vuiT' + team); if (b) b.textContent = score[team]; if (p) { p.classList.add('pop'); setTimeout(() => p.classList.remove('pop'), 250); } }, 950);
  }
  // màn kết thúc: kết quả hai đội (không có đội thua) + huy hiệu cho từng bé
  function huyHieu(kids, results, el) {
    if (!el) return; let h = '';
    if (active) {
      const [a, b] = score, kq = a === b ? `Hai đội hoà ${a} – ${b}! Cả hai đội đều giỏi!` : `${TEAMS[a > b ? 0 : 1].icon} ${TEAMS[a > b ? 0 : 1].ten} được ${Math.max(a, b)} sao, ${TEAMS[a > b ? 1 : 0].icon} ${TEAMS[a > b ? 1 : 0].ten} được ${Math.min(a, b)} sao. Cả hai đội cùng vỗ tay nào!`;
      h += `<div class="vuiKq">${kq}</div>`;
    }
    const off = Math.random() * BADGE.length | 0;
    h += `<div class="vuiBadges">${kids.map((k, i) => { const [e, t] = BADGE[(i + off) % BADGE.length], W = results[i] && results[i].word; return `<div class="vuiBadge" style="animation-delay:${(i * .12).toFixed(2)}s"><div class="e">${e}</div><b>${esc(k)}</b><small>${t}</small>${W && W.img ? `<img src="${W.img}" alt="${esc(W.w)}">` : ''}</div>`; }).join('')}</div>`;
    el.innerHTML = h; el.style.display = 'block';
  }
  window.Vui = { ganNut, batDau, luot, dung, huyHieu, an, get bat() { return on; } };
})();
