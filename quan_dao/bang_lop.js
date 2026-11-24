// Bảng "Lớp học" (chọn lớp, thêm/đổi tên/xoá lớp, sao lưu, nhập lại, đặt lại vinh danh)
// và bảng "Kiểm tra trước giờ học" (micro, mạng, máy nghe, giọng đọc, toàn màn hình, dữ liệu tiết, đồng ý phụ huynh).
// Dùng trên bản đồ quần đảo; cần lop.js nạp trước. Gọi BangLop.init({ onChange }) sau khi trang vẽ xong.
(function () {
  const css = `
.lopChip { cursor: pointer; border: 0; }
.lopChip:hover { filter: brightness(1.04); }
.lopChip .warn { color: #B5463B; }
.ovL { position: absolute; inset: 0; z-index: 20; background: rgba(14, 26, 46, .55); display: flex; align-items: center; justify-content: center; }
.ovL .pn { width: 980px; max-height: 800px; overflow: auto; background: #FFFDF6; border-radius: 30px; padding: 30px 40px 34px; box-shadow: 0 14px 0 rgba(0, 0, 0, .2); font-family: 'Nunito', Arial, sans-serif; color: #1F2D4A; }
.ovL h2 { margin: 0 0 6px; font: 800 40px/1.1 'Baloo 2'; } .ovL h2 small { display: block; font: 700 18px/1.2 'Nunito'; color: #56637F; margin-bottom: 4px; }
.ovL p { font-size: 19px; line-height: 1.45; margin: 8px 0 14px; color: #3B4866; }
.ovL .rows { display: grid; gap: 10px; margin: 14px 0; }
.ovL .lr { display: flex; align-items: center; gap: 12px; background: #F1F5F8; border-radius: 18px; padding: 10px 14px; font-size: 21px; }
.ovL .lr.on { background: #DDF4EF; outline: 3px solid #14998F; }
.ovL .lr b { flex: 1; font: 800 24px/1.2 'Baloo 2'; } .ovL .lr small { color: #56637F; font-size: 16px; }
.ovL button { font: 800 19px/1 'Baloo 2'; border: 0; border-radius: 14px; padding: 10px 16px 12px; cursor: pointer; background: #fff; color: #1F2D4A; box-shadow: 0 4px 0 rgba(31, 45, 74, .18); }
.ovL button.go { background: #14998F; color: #fff; box-shadow: 0 4px 0 #0D7068; } .ovL button.red { background: #F2675A; color: #fff; box-shadow: 0 4px 0 #B5463B; }
.ovL button:focus-visible { outline: 4px solid #2E6FD8; outline-offset: 2px; }
.ovL input[type=text] { font: 700 20px 'Nunito'; padding: 10px 14px; border-radius: 12px; border: 2px solid #CBD6E2; width: 320px; }
.ovL .bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 12px; }
.ovL .sep { height: 2px; background: #E3EAF1; margin: 18px 0; }
.ovL .msg { min-height: 26px; font: 800 19px 'Nunito'; color: #0D7068; margin-top: 10px; } .ovL .msg.bad { color: #B5463B; }
.ovL .ck { display: grid; grid-template-columns: 44px 1fr auto; gap: 8px 14px; align-items: center; margin: 14px 0; }
.ovL .dot { width: 34px; height: 34px; border-radius: 50%; background: #CBD6E2; box-shadow: inset 0 -4px 0 rgba(0, 0, 0, .12); }
.ovL .dot.ok { background: #3CC46A; } .ovL .dot.bad { background: #F2675A; } .ovL .dot.wait { background: #FFD23F; }
.ovL .ck b { display: block; font: 800 22px/1.15 'Baloo 2'; } .ovL .ck span { font-size: 16px; color: #56637F; }
.ovL .meter { width: 160px; height: 14px; border-radius: 8px; background: #E3EAF1; overflow: hidden; } .ovL .meter i { display: block; height: 100%; width: 0; background: #3CC46A; }
.ovL label.cb { display: flex; gap: 10px; align-items: flex-start; font-size: 18px; line-height: 1.4; cursor: pointer; } .ovL label.cb input { flex: none; transform: scale(1.7); margin: 6px 8px 0 6px; }
.ovL .close { float: right; }`;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let onChange = () => {}, sure = '', sureT = 0;
  const twice = (what, el, label) => { const now = Date.now(); if (sure === what && now - sureT < 4000) { sure = ''; return true; } sure = what; sureT = now; if (el) { el.dataset.old = el.dataset.old || el.textContent; el.textContent = label; setTimeout(() => { if (el.isConnected) el.textContent = el.dataset.old; }, 4000); } return false; };
  const msg = (t, bad) => { const m = $('lMsg'); if (m) { m.textContent = t; m.className = 'msg' + (bad ? ' bad' : ''); } };

  function chip() {
    const c = LopHoc.current(), d = LopHoc.daysSinceBackup(), late = LopHoc.hasData() && d > 7;
    $('lopChip').innerHTML = `Lớp: ${esc(c.ten)}<small class="${late ? 'warn' : ''}">${late ? (d === Infinity ? 'chưa sao lưu' : 'đã ' + Math.floor(d) + ' ngày chưa sao lưu') : 'L: đổi lớp'}</small>`;
  }
  function openLop(first) {
    const ds = LopHoc.list(), cur = LopHoc.current();
    $('ovLop').hidden = false;
    $('ovLop').innerHTML = `<div class="pn" role="dialog" aria-label="Lớp học">
      <button class="close" id="lClose">Đóng <small>Esc</small></button>
      <h2><small>${first ? 'Chào cô! Hôm nay' : 'Mỗi lớp có tiến độ, danh sách bé và bảng vinh danh riêng'}</small>${first ? 'Cô dạy lớp nào?' : 'Lớp học'}</h2>
      <div class="rows">${ds.map(l => `<div class="lr ${l.id === cur.id ? 'on' : ''}"><b>${esc(l.ten)}</b>${l.id === cur.id ? '<small>đang dùng</small>' : `<button class="go" data-use="${l.id}">Dạy lớp này</button>`}
        <button data-ren="${l.id}">Đổi tên</button>${ds.length > 1 ? `<button class="red" data-del="${l.id}">Xoá lớp</button>` : ''}</div>`).join('')}</div>
      <div class="bar"><input type="text" id="lNew" placeholder="Tên lớp mới, VD: Lớp Mầm Xanh" maxlength="40"><button class="go" id="lAdd">Thêm lớp</button></div>
      <div class="sep"></div>
      <p><b>Sao lưu</b>: lưu tiến độ, danh sách bé và vinh danh của mọi lớp ra một file (nằm trong thư mục Downloads). Nên sao lưu mỗi tuần, cất file vào USB hoặc Google Drive. Đổi máy hay lỡ xoá dữ liệu trình duyệt thì bấm <b>Nhập bản sao lưu</b> để lấy lại.</p>
      <div class="bar"><button class="go" id="lExp">Sao lưu ra file</button><button id="lImp">Nhập bản sao lưu</button><input type="file" id="lFile" accept=".json,application/json" hidden>
        <button id="lVinh">Đặt lại bảng vinh danh lớp này</button><button id="lCheck">Kiểm tra trước giờ học <small>K</small></button></div>
      <div class="msg" id="lMsg"></div></div>`;
    const ov = $('ovLop');
    $('lClose').onclick = closeAll;
    ov.querySelectorAll('[data-use]').forEach(b => b.onclick = () => { LopHoc.switchTo(b.dataset.use); onChange(); chip(); openLop(false); msg('Đã chuyển sang lớp ' + LopHoc.current().ten + '.'); if (first) setTimeout(closeAll, 700); });
    ov.querySelectorAll('[data-ren]').forEach(b => b.onclick = () => {
      const row = b.parentElement, l = LopHoc.list().find(x => x.id === b.dataset.ren);
      row.querySelector('b').innerHTML = `<input type="text" value="${esc(l.ten)}" maxlength="40">`; const inp = row.querySelector('input'); inp.focus(); inp.select();
      b.textContent = 'Lưu tên'; b.onclick = () => { LopHoc.rename(l.id, inp.value); chip(); openLop(first); };
      inp.onkeydown = e => { if (e.key === 'Enter') b.onclick(); e.stopPropagation(); };
    });
    ov.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const l = LopHoc.list().find(x => x.id === b.dataset.del);
      if (!twice('del' + l.id, b, 'Bấm lần nữa để xoá hẳn')) { msg(`Xoá lớp "${l.ten}" sẽ mất tiến độ và danh sách bé của lớp đó. Nên sao lưu trước. Bấm "Xoá lớp" lần nữa để xoá.`, true); return; }
      LopHoc.remove(l.id); onChange(); chip(); openLop(first); msg(`Đã xoá lớp "${l.ten}".`);
    });
    $('lAdd').onclick = () => { const v = $('lNew').value.trim(); if (!v) { $('lNew').focus(); return; } const l = LopHoc.add(v); LopHoc.switchTo(l.id); onChange(); chip(); openLop(first); msg(`Đã thêm lớp "${l.ten}" và chuyển sang lớp này. Đảo bắt đầu từ tiết 1.`); };
    $('lNew').onkeydown = e => { if (e.key === 'Enter') $('lAdd').onclick(); e.stopPropagation(); };
    $('lExp').onclick = () => { LopHoc.exportAll(); chip(); msg('Đã sao lưu. File nằm trong thư mục Downloads (Tải xuống).'); };
    $('lImp').onclick = () => $('lFile').click();
    $('lFile').onchange = () => { const f = $('lFile').files[0]; if (!f) return; f.text().then(t => { const n = LopHoc.importText(t); onChange(); chip(); openLop(first); msg(`Đã nhập lại ${n} lớp từ file ${f.name}.`); }).catch(e => msg('Không đọc được file: ' + e.message, true)); };
    $('lVinh').onclick = () => { if (!twice('vinh', $('lVinh'), 'Bấm lần nữa để đặt lại')) { msg('Bảng vinh danh của lớp này sẽ về trống (dùng khi sang khoá/năm học mới). Bấm lần nữa để đặt lại.', true); return; } LopHoc.resetVinhDanh(); msg('Đã đặt lại bảng vinh danh của lớp ' + LopHoc.current().ten + '.'); };
    $('lCheck').onclick = openCheck;
    (ov.querySelector('[data-use]') || $('lClose')).focus();
  }

  // ---------- kiểm tra trước giờ học ----------
  let stream = null, raf = 0;
  function stopMic() { cancelAnimationFrame(raf); if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }
  const row = (id, t, s, extra = '') => `<div class="dot wait" id="d_${id}"></div><div><b>${t}</b><span id="s_${id}">${s}</span></div><div>${extra}</div>`;
  const mark = (id, ok, s) => { $('d_' + id).className = 'dot ' + (ok === null ? 'wait' : ok ? 'ok' : 'bad'); if (s) $('s_' + id).textContent = s; };
  function openCheck() {
    stopMic(); $('ovLop').hidden = false; const consent = localStorage.getItem('songkim_dongy_mic') === '1';
    $('ovLop').innerHTML = `<div class="pn" role="dialog" aria-label="Kiểm tra trước giờ học">
      <button class="close" id="lClose">Đóng <small>Esc</small></button>
      <h2><small>${esc(LopHoc.current().ten)} · làm trước khi học sinh vào lớp</small>Kiểm tra trước giờ học</h2>
      <div class="ck">
        ${row('sr', 'Trình duyệt có máy nghe', 'Cần Chrome hoặc Edge.')}
        ${row('net', 'Có mạng', 'Máy nghe gửi tiếng lên mạng để nhận dạng.')}
        ${row('mic', 'Micro', 'Cô nói thử "Hello" thật to.', '<div class="meter"><i id="lvl"></i></div>')}
        ${row('voice', 'Giọng đọc tiếng Anh', 'Máy đọc mẫu từ cho bé nghe.', '<button id="bSpeak">Nghe thử</button>')}
        ${row('full', 'Toàn màn hình', 'Chiếu lên tivi cho to, đỡ bấm nhầm.', '<button id="bFull">Bật toàn màn hình</button>')}
        ${row('data', 'Dữ liệu các tiết học', 'Ba đảo đọc được giáo án 70 tiết.')}
        ${row('bak', 'Sao lưu', '')}
      </div>
      <div class="sep"></div>
      <label class="cb"><input type="checkbox" id="cConsent" ${consent ? 'checked' : ''}> <span><b>Phụ huynh của lớp đã đồng ý cho dùng máy nghe.</b> Khi bật máy nghe, tiếng nói trong lớp được Chrome gửi lên máy chủ của Google (Edge: Microsoft) để nhận dạng, không lưu trên máy này. Chưa tích ô này thì máy nghe tắt, cô tự chấm bằng phím Enter.</span></label>
      <div class="bar"><button class="go" id="bAgain">Kiểm tra lại</button><button id="bLop">Lớp học và sao lưu <small>L</small></button></div>
      <div class="msg" id="lMsg"></div></div>`;
    $('lClose').onclick = closeAll; $('bAgain').onclick = openCheck; $('bLop').onclick = () => { stopMic(); openLop(false); };
    $('cConsent').onchange = () => { localStorage.setItem('songkim_dongy_mic', $('cConsent').checked ? '1' : '0'); msg($('cConsent').checked ? 'Đã ghi nhận: máy nghe được bật cho lớp này.' : 'Máy nghe sẽ tắt, cô chấm bằng phím Enter.'); };
    // máy nghe
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; mark('sr', !!SR, SR ? 'Có.' : 'Chưa có. Hãy mở bằng Chrome hoặc Edge.');
    // mạng
    if (!navigator.onLine) mark('net', false, 'Máy đang mất mạng. Máy nghe sẽ không chạy, cô chấm bằng Enter.');
    else { const ctl = new AbortController(); setTimeout(() => ctl.abort(), 5000);
      fetch('https://www.google.com/generate_204', { mode: 'no-cors', cache: 'no-store', signal: ctl.signal }).then(() => mark('net', true, 'Có mạng.')).catch(() => mark('net', false, 'Không vào được mạng (hoặc mạng quá chậm).')); }
    // micro + mức âm lượng
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) mark('mic', false, 'Trình duyệt không cho dùng micro.');
    else navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      stream = s; const ac = new (window.AudioContext || window.webkitAudioContext)(), an = ac.createAnalyser(); ac.createMediaStreamSource(s).connect(an); an.fftSize = 512;
      const buf = new Uint8Array(an.fftSize); let peak = 0, heard = false; mark('mic', null, 'Đã cho phép. Cô nói thử "Hello" thật to…');
      const tick = () => { an.getByteTimeDomainData(buf); let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v - 128)); peak = Math.max(peak * .9, m); const el = $('lvl'); if (!el) { ac.close(); return; } el.style.width = Math.min(100, peak / 64 * 100) + '%';
        if (!heard && m > 18) { heard = true; mark('mic', true, 'Micro nghe tốt.'); } raf = requestAnimationFrame(tick); };
      tick(); setTimeout(() => { if (!heard && $('d_mic')) mark('mic', false, 'Micro chưa nghe thấy tiếng. Kiểm tra micro có cắm, có bị tắt tiếng không.'); }, 8000);
    }).catch(e => mark('mic', false, e.name === 'NotAllowedError' ? 'Chưa cho phép micro: bấm biểu tượng micro trên thanh địa chỉ, chọn Cho phép.' : 'Không tìm thấy micro.'));
    // giọng đọc
    const voices = () => (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(v => /^en/i.test(v.lang));
    const showVoice = () => { const v = voices(); mark('voice', v.length > 0, v.length ? 'Có giọng ' + v[0].name.replace(/Microsoft |Google /, '') + '. Bấm Nghe thử.' : 'Máy chưa có giọng tiếng Anh: Cài đặt Windows > Thời gian và ngôn ngữ > Giọng nói > thêm English (United States). Tạm thời cô đọc mẫu.'); };
    if (window.speechSynthesis) { showVoice(); speechSynthesis.onvoiceschanged = showVoice; setTimeout(showVoice, 1200); } else mark('voice', false, 'Trình duyệt không đọc được.');
    $('bSpeak').onclick = () => { if (!window.speechSynthesis) return; const u = new SpeechSynthesisUtterance('Hello, children! Are you ready?'); const v = voices(); if (v[0]) u.voice = v.find(x => /en-US/i.test(x.lang)) || v[0]; u.lang = 'en-US'; u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); };
    // toàn màn hình
    const showFull = () => { const on = !!document.fullscreenElement || (innerHeight >= screen.height - 2 && innerWidth >= screen.width - 2); mark('full', on, on ? 'Đang toàn màn hình.' : 'Chưa toàn màn hình (phím F hoặc F11).'); };
    showFull(); $('bFull').onclick = () => { (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {}).then(() => setTimeout(showFull, 400)); };
    // dữ liệu tiết học
    Promise.all(['../dao_hat_mam/ppct_amanda1.json', '../dao_cau_vong/ppct_amanda2.json', '../dao_3d/ppct_amanda3.json'].map(u => fetch(u).then(r => r.json()).then(d => d.length).catch(() => 0)))
      .then(n => mark('data', n.every(x => x >= 70), n.every(x => x >= 70) ? 'Đủ 70 tiết cho cả ba đảo.' : 'Thiếu dữ liệu tiết học. Hãy mở bằng file .bat, không mở thẳng file html.'));
    // sao lưu
    const d = LopHoc.daysSinceBackup(); mark('bak', d <= 7, d === Infinity ? 'Chưa sao lưu lần nào. Bấm "Lớp học và sao lưu".' : `Lần sao lưu gần nhất: ${Math.floor(d)} ngày trước${d > 7 ? ', nên sao lưu lại.' : '.'}`);
    $('bAgain').focus();
  }
  function closeAll() { stopMic(); $('ovLop').hidden = true; $('ovLop').innerHTML = ''; }
  const isOpen = () => !$('ovLop').hidden;

  function init(o) {
    onChange = o.onChange || onChange;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const ov = document.createElement('div'); ov.className = 'ovL'; ov.id = 'ovLop'; ov.hidden = true; (o.parent || document.body).appendChild(ov);
    const c = document.getElementById(o.chipId); c.classList.add('lopChip'); c.setAttribute('role', 'button'); c.tabIndex = 0; c.id = 'lopChip';
    c.onclick = () => openLop(false); c.onkeydown = e => { if (e.key === 'Enter') openLop(false); };
    chip();
    // phím: L = lớp học, K = kiểm tra; Esc đóng; khi bảng đang mở thì chặn phím của bản đồ
    addEventListener('keydown', e => {
      if (isOpen()) { if (e.key === 'Escape') closeAll(); if (e.target.type !== 'text') e.stopImmediatePropagation(); return; } // ô chữ tự chặn phím của nó
      if (e.key === 'l' || e.key === 'L') { e.stopImmediatePropagation(); openLop(false); }
      else if (e.key === 'k' || e.key === 'K') { e.stopImmediatePropagation(); openCheck(); }
    }, true);
    // nhiều lớp dùng chung máy: mỗi lần mở ứng dụng hỏi hôm nay dạy lớp nào
    let asked = false; try { asked = sessionStorage.getItem('songkim_lop_da_hoi') === '1'; sessionStorage.setItem('songkim_lop_da_hoi', '1'); } catch (e) {}
    if (!asked && LopHoc.list().length > 1 && !o.skipAsk) openLop(true);
  }
  window.BangLop = { init, openLop, openCheck, isOpen };
})();
