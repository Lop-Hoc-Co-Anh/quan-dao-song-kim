// Hồ sơ lớp + sao lưu + kiểm tra trước giờ học cho Quần đảo Song Kim.
// Cách làm: mọi trang vẫn đọc/ghi dữ liệu như cũ (tiến độ đảo, danh sách bé, vinh danh...).
// Khi cô đổi lớp, dữ liệu của lớp đang dùng được cất vào "ngăn" của lớp đó, rồi lấy ngăn của lớp kia ra.
(function () {
  const PRE = ['daosongkim3d', 'daohatmam', 'daocauvong', 'quandao_', 'trochoi_', 'ghepvancau', 'songkim_'];
  const NOT = ['songkim_lop', 'songkim_saoluu'];
  const K_DS = 'songkim_lop_ds', K_CUR = 'songkim_lop_dang_dung', K_BOX = 'songkim_lop__', K_BAK = 'songkim_saoluu_ngay';
  const ls = window.localStorage;
  const get = (k, d) => { try { const v = ls.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const set = (k, v) => { try { ls.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const isApp = k => PRE.some(p => k.startsWith(p)) && !NOT.some(p => k.startsWith(p));
  const liveKeys = () => { const a = []; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (isApp(k)) a.push(k); } return a; };
  const snap = () => { const o = {}; liveKeys().forEach(k => o[k] = ls.getItem(k)); return o; };
  const clearLive = () => liveKeys().forEach(k => ls.removeItem(k));
  const loadLive = o => Object.entries(o || {}).forEach(([k, v]) => { if (isApp(k)) ls.setItem(k, v); });
  const newId = () => 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  function list() {
    let ds = get(K_DS, null);
    if (!ds || !ds.length) { ds = [{ id: newId(), ten: 'Lớp của tôi' }]; set(K_DS, ds); ls.setItem(K_CUR, ds[0].id); } // lần đầu: dữ liệu đang có thuộc lớp này
    if (!ds.find(l => l.id === ls.getItem(K_CUR))) ls.setItem(K_CUR, ds[0].id);
    return ds;
  }
  const current = () => { const ds = list(); return ds.find(l => l.id === ls.getItem(K_CUR)); };
  function stash() { const c = current(); set(K_BOX + c.id, snap()); } // cất dữ liệu lớp đang dùng vào ngăn
  function switchTo(id) {
    const ds = list(); if (!ds.find(l => l.id === id) || id === ls.getItem(K_CUR)) return;
    stash(); clearLive(); loadLive(get(K_BOX + id, {})); ls.setItem(K_CUR, id);
  }
  function add(ten) { const ds = list(), l = { id: newId(), ten: ten.trim().slice(0, 40) || 'Lớp mới' }; ds.push(l); set(K_DS, ds); set(K_BOX + l.id, {}); return l; }
  function rename(id, ten) { const ds = list(), l = ds.find(x => x.id === id); if (l && ten.trim()) { l.ten = ten.trim().slice(0, 40); set(K_DS, ds); } }
  function remove(id) {
    let ds = list(); if (ds.length < 2) return false;
    if (id === ls.getItem(K_CUR)) { const other = ds.find(l => l.id !== id); switchTo(other.id); }
    ds = ds.filter(l => l.id !== id); set(K_DS, ds); ls.removeItem(K_BOX + id); return true;
  }
  function resetVinhDanh() { ls.removeItem('songkim_vinhdanh'); }
  function exportAll() {
    stash(); const ds = list(), d = new Date();
    const data = { app: 'Quan dao Song Kim', phienban: 1, ngay: d.toISOString(), dangDung: ls.getItem(K_CUR), lop: ds.map(l => ({ id: l.id, ten: l.ten, duLieu: get(K_BOX + l.id, {}) })) };
    const a = document.createElement('a'), pad = n => String(n).padStart(2, '0');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
    a.download = `SaoLuu_QuanDaoSongKim_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    ls.setItem(K_BAK, String(Date.now()));
  }
  function importText(txt) {
    const d = JSON.parse(txt); if (!d || !Array.isArray(d.lop) || !d.lop.length) throw new Error('File không phải bản sao lưu của Quần đảo Song Kim.');
    // giữ các lớp đang có, lớp trùng mã thì thay bằng bản trong file
    let ds = list(); const trivial = k => /^quandao_dang_o$|_modau$/.test(k), liveReal = liveKeys().filter(k => !trivial(k)).length;
    // máy mới / vừa xoá dữ liệu: bỏ lớp trống tự tạo, dùng đúng lớp đang dạy trong file
    const fresh = ds.length === 1 && !d.lop.some(l => l.id === ds[0].id) && !liveReal && !Object.keys(get(K_BOX + ds[0].id, {})).filter(k => !trivial(k)).length;
    if (!fresh) stash();
    if (fresh) { ls.removeItem(K_BOX + ds[0].id); ds = []; }
    d.lop.forEach(l => { if (!l.id || !l.ten) return; const o = ds.find(x => x.id === l.id); if (o) o.ten = l.ten; else ds.push({ id: l.id, ten: l.ten }); set(K_BOX + l.id, l.duLieu || {}); });
    set(K_DS, ds); if (fresh) ls.setItem(K_CUR, ds.find(l => l.id === d.dangDung) ? d.dangDung : ds[0].id);
    clearLive(); loadLive(get(K_BOX + ls.getItem(K_CUR), {}));
    return d.lop.length;
  }
  const daysSinceBackup = () => { const t = +ls.getItem(K_BAK) || 0; return t ? (Date.now() - t) / 864e5 : Infinity; };
  const hasData = () => liveKeys().some(k => /^(daosongkim3d|daohatmam|daocauvong)$/.test(k));
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {} // xin trình duyệt đừng tự xoá dữ liệu

  window.LopHoc = { list, current, switchTo, add, rename, remove, resetVinhDanh, exportAll, importText, daysSinceBackup, hasData, stash };
})();
