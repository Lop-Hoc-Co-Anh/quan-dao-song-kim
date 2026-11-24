// Máy nghe dùng chung cho các trò chơi Đảo Song Kim.
// - Nghe liên tục ~8 giây (máy tự tắt thì tự bật lại); chỉ chấm trên kết quả cuối, xét 3 phương án đầu.
// - Bắt đầu nghe sau khi loa đọc mẫu xong một chút, bỏ qua câu "Your turn" vọng lại từ loa.
// - So theo từng chữ có ranh giới; từ ngắn ≤3 chữ cái chỉ nhận khi giống hệt theo âm (cat ~ kat); nhầm thường gặp ghi trong alt của từng từ.
(function () {
  const DIG = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const norm = t => String(t).toLowerCase().replace(/\d+/g, d => ' ' + (DIG[+d] || '') + ' ').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  // rút gọn theo âm: những chữ đọc giống nhau gộp làm một (không gộp th với t: then ≠ ten)
  const sound = w => { let s = w.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/[cq]/g, 'k').replace(/x/g, 'ks').replace(/z/g, 's')
    .replace(/wh/g, 'w').replace(/gh/g, 'g').replace(/ee|ea|ie|ey/g, 'i').replace(/oo|ou|ew/g, 'u').replace(/y$/, 'i').replace(/([a-z])\1+/g, '$1');
    if (s.length > 3) s = s.replace(/(.)e$/, '$1'); if (s.length > 3) s = s.replace(/es$|s$/, ''); return s; }; // số nhiều chỉ bỏ với từ dài
  function lev(a, b) { const m = a.length, n = b.length, d = [...Array(n + 1).keys()]; for (let i = 1; i <= m; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= n; j++) { const q = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = q; } } return d[n]; }
  // một chữ nghe được (a) có phải là từ cần đọc (b) không: từ ngắn ≤3 chữ cái chỉ nhận khi đọc giống hệt theo âm
  const near = (a, b) => { if (!a || !b) return false; if (a === b) return true; const sa = sound(a), sb = sound(b); if (sa === sb) return true;
    if (sb.length <= 3 || Math.abs(sa.length - sb.length) > 1 || sa[0] !== sb[0]) return false; return lev(sa, sb) <= (sb.length <= 6 ? 1 : 2); };
  // So theo từng chữ (có ranh giới từ), không dò chuỗi con: "education" không phải cat, "someone" không phải one.
  // others: các từ khác trong bài; nghe ra đúng một từ khác thì không nới (hand ≠ head)
  function matches(text, W, others = []) {
    const t = norm(text); if (!t) return false;
    // cách đọc gần đúng (alt) mà trùng một từ khác trong bài thì bỏ (daddy ≠ teddy, tree ≠ three)
    const oth = new Set(others.map(norm).filter(Boolean)), me = norm(W.w);
    const own = new Set([me, ...(W.alt || []).map(norm).filter(a => a && (a === me || !oth.has(a)))]), ban = new Set([...oth].filter(o => !own.has(o)));
    const toks = t.split(' ');
    return [...own].filter(Boolean).some(g => {
      const gt = g.split(' '), gj = gt.join('');
      for (let i = 0; i < toks.length; i++) {
        if (gt.length === 1 && toks[i] === g) return true;
        if (gt.length > 1 && toks.slice(i, i + gt.length).join(' ') === g) return true;
        // ghép 1–3 chữ liền nhau (bed room = bedroom, t shirt = tshirt) rồi so theo âm
        for (let n = 1; n <= Math.max(2, gt.length + 1) && i + n <= toks.length; n++) {
          const part = toks.slice(i, i + n); if (n === 1 && ban.has(part[0])) continue;
          const pj = part.join(''); if (n > 1 && pj.length < 4) continue;
          if (near(pj, gj)) return true;
        }
      }
      return false;
    });
  }
  const ECHO = /\b(your turn|you turn|turn|well done|great job|super|excellent|good job|what is (it|this)|who is this|listen)\b/;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let token = 0, rec = null;
  function stop() { token++; if (rec) { try { rec.onend = null; rec.onresult = null; rec.onerror = null; rec.abort(); } catch (e) {} rec = null; } }
  // o: { word, ms (thời gian nghe), delay, onStart, onHeard(txt), onMatch(txt), onFail(lastHeard), onError(kind) }
  function start(o) {
    stop(); if (!SR) { o.onError && o.onError('none'); return; }
    const my = ++token, until = performance.now() + (o.ms || 8000) + (o.delay ?? 450);
    let last = '', fatal = false;
    const run = () => {
      if (my !== token) return;
      const r = rec = new SR(); r.lang = 'en-US'; r.interimResults = true; r.maxAlternatives = 5; r.continuous = true;
      r.onresult = e => {
        if (my !== token) return;
        for (let i = e.resultIndex; i < e.results.length; i++) for (let j = 0; j < Math.min(3, e.results[i].length); j++) {
          const res = e.results[i], txt = res[j].transcript, n = norm(txt); if (!n) continue;
          if (j === 0 && !ECHO.test(n)) { last = txt.trim(); o.onHeard && o.onHeard(last); }
          const m = n.replace(ECHO, ' ').trim(), exact = [o.word.w, ...(o.word.alt || [])].some(w => norm(w) === m);
          if ((res.isFinal || exact) && matches(m, o.word, o.others || [])) { stop(); o.onMatch && o.onMatch(txt); return; }
        }
      };
      r.onerror = ev => { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed' || ev.error === 'network' || ev.error === 'audio-capture') { fatal = true; o.onError && o.onError(ev.error); } };
      r.onend = () => { if (my !== token) return; rec = null; if (fatal) { token++; return; } if (performance.now() < until) return setTimeout(run, 120); token++; o.onFail && o.onFail(last); };
      try { r.start(); } catch (e) { fatal = true; o.onError && o.onError('start'); }
    };
    o.onStart && o.onStart();
    setTimeout(run, o.delay ?? 450); // chờ tiếng loa đọc mẫu tắt hẳn
  }
  window.MayNghe = { start, stop, matches, norm, supported: !!SR };
})();
