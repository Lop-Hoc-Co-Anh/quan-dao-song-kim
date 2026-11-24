// Phim ải cuối cho hai đảo mới: ?dao=dao_hat_mam (Cây Thần nở hoa) hoặc ?dao=dao_cau_vong (cầu vồng bảy màu).
// Dùng chung khung "Đêm hội hải đăng"; file này chỉ thay dữ liệu và các cảnh riêng của từng đảo.
(function () {
  const key = new URLSearchParams(location.search).get('dao');
  const R2 = a => a.map(([x, y]) => ({ x: x * 2, y: y * 2 })); // toạ độ ảnh 1672x941 -> bản đồ phóng đôi
  const D = {
    dao_hat_mam: {
      dir: '../dao_hat_mam/', title: 'Lễ hội Cây Thần', island: 'Đảo Hạt Mầm', book: 'Amanda and Friends 1', page: 'dao-hat-mam.html',
      map: 'ban_do_dao_hat_mam.jpg', token: 'giot_nuoc.webp', target: { x: 1680, y: 600 },
      extra: { t1: 'cay_than_1.webp', t2: 'cay_than_2.webp', t3: 'cay_than_3.webp' },
      friends: ['thu_tho', 'thu_ga', 'thu_gau_truc', 'thu_ech', 'thu_vit', 'thu_soc', 'thu_nhim', 'thu_ong'],
      route: R2([[835, 880], [835, 780], [835, 690], [760, 640], [640, 648], [545, 620], [488, 560], [466, 470], [472, 380], [510, 300], [580, 245], [700, 222], [840, 212], [980, 220], [1090, 250], [1160, 300], [1190, 390], [1175, 480], [1120, 555], [1020, 615], [920, 632], [850, 600], [840, 520]]),
      camp: 'Trên đồi, Cây Thần đang chờ 70 giọt nước!', fly: 'Từng giọt nước bay về tưới Cây Thần…', full: 'Đủ 70 giọt nước rồi!',
      big: 'Cây Thần nở hoa!', lit: 'Cả Đảo Hạt Mầm rực rỡ hoa! Các bạn thú cùng ra mừng!',
      thank: ['Cảm ơn các con đã cùng Cô Anh, Ben, Mia và Pip', 'tưới Cây Thần nở hoa trên Đảo Hạt Mầm.'], end: 'Đảo Hạt Mầm nở hoa!',
      glow: 'rgba(255,190,230,A)', star: 'Ngôi sao Hạt Mầm',
    },
    dao_cau_vong: {
      dir: '../dao_cau_vong/', title: 'Đêm hội cầu vồng', island: 'Đảo Cầu Vồng', book: 'Amanda and Friends 2', page: 'dao-cau-vong.html',
      map: 'ban_do_dao_cau_vong.jpg', token: 'manh_mau.webp', target: { x: 1600, y: 760 },
      extra: { gateOff: 'cong_cau_vong_tat.webp', gateOn: 'cong_cau_vong_sang.webp', rainbow: 'manh_mau.webp', balloon: 'khinh_khi_cau.webp' },
      friends: ['thu_cu_meo', 'thu_kangaroo', 'thu_chim_canh_cut', 'thu_tuan_lo', 'thu_huou_cao_co', 'thu_cao', 'thu_ha_ma', 'thu_hai_cau'],
      route: R2([[830, 880], [830, 760], [830, 662], [720, 650], [600, 632], [500, 560], [468, 470], [470, 380], [500, 300], [570, 236], [700, 206], [830, 196], [960, 202], [1080, 232], [1150, 300], [1182, 400], [1165, 500], [1085, 585], [960, 632], [880, 610], [830, 540]]),
      camp: 'Cổng đá giữa đảo đang chờ 70 mảnh màu!', fly: 'Từng mảnh màu bay về cổng cầu vồng…', full: 'Đủ 70 mảnh màu rồi!',
      big: 'Cầu vồng bảy màu!', lit: 'Cả Đảo Cầu Vồng rực rỡ! Khinh khí cầu sẵn sàng bay sang Đảo Song Kim!',
      thank: ['Cảm ơn các con đã cùng Cô Anh, Ben, Mia và Pip', 'thắp sáng cầu vồng trên Đảo Cầu Vồng.'], end: 'Đảo Cầu Vồng bảy màu!',
      glow: 'rgba(200,220,255,A)', star: 'Ngôi sao Cầu Vồng',
    },
  }[key];
  if (!D) return;
  D.key = key;
  const IH = n => D.dir + 'hinh/' + n;
  window.ISL = {
    key, D,
    imgs: Object.assign({ map: IH(D.map), gem: IH(D.token) }, Object.fromEntries(Object.entries(D.extra).map(([k, v]) => [k, IH(v)])), Object.fromEntries(D.friends.map(f => [f, IH(f + '.webp')]))),
    apply() {
      // chữ trên trang
      document.title = D.title;
      document.querySelector('#ovSetup h1').innerHTML = `<small>${D.island} · Ải cuối</small>${D.title}`;
      document.querySelector('#ovSetup p').innerHTML = D.key === 'dao_hat_mam'
        ? 'Cả lớp mang 70 giọt nước lên đồi tưới Cây Thần, cây lớn vụt lên và nở đầy hoa. Sau đó là <b>bảng vinh danh</b> có tên từng bé. Bấm <b>Ghi video</b> để vừa chiếu vừa lưu thành file video (nằm trong thư mục Downloads).'
        : 'Cả lớp ghép 70 mảnh màu vào cổng đá, cầu vồng sáng đủ bảy màu và khinh khí cầu bay lên. Sau đó là <b>bảng vinh danh</b> có tên từng bé. Bấm <b>Ghi video</b> để vừa chiếu vừa lưu thành file video (nằm trong thư mục Downloads).';
      document.querySelector('#ovEnd h1').innerHTML = `<small>Ải cuối hoàn thành</small>${D.end}`;
      const nam = $('nam'); if (/Amanda and Friends 3/.test(nam.value)) nam.value = nam.value.replace('Amanda and Friends 3', D.book);
      const goBack = () => { location.href = D.dir + D.page; }; $('bBack').onclick = $('bBack2').onclick = goBack;
      const T0 = D.target, TG = () => toS(T0);
      const routeAt = i => { const r = D.route, f = (i % 70) / 70 * (r.length - 1), k = Math.floor(f), u = f - k, a = r[k], b = r[Math.min(r.length - 1, k + 1)]; return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; };
      // vật ở giữa đảo, vẽ trên bản đồ theo mức 0..1
      const landmark = (t, k, scale = 1) => {
        const p = TG(), z = cam.z * scale;
        if (D.key === 'dao_hat_mam') { const n = k >= 1 ? 't3' : k > .5 ? 't2' : 't1', h = (n === 't3' ? 330 : n === 't2' ? 200 : 120) * z; g.save(); g.globalCompositeOperation = 'lighter'; glow(p.x, p.y - h * .5, h * (.6 + .6 * k), D.glow, .25 + .6 * k); g.restore(); spr(n, p.x, p.y, h); }
        else { const im = IM.rainbow, w = 470 * z; if (im && im.width && k > 0) { const h = w * im.height / im.width; g.save(); g.beginPath(); g.rect(p.x - w / 2, p.y - h - 10, w * k, h + 20); g.clip(); g.globalCompositeOperation = 'lighter'; glow(p.x, p.y - h * .5, w * .7, D.glow, .5 * k); g.globalCompositeOperation = 'source-over'; g.drawImage(im, p.x - w / 2, p.y - h, w, h); g.restore(); } }
      };
      const lights = (extra = []) => [{ x: T0.x, y: T0.y - 120, r: 900, a: 1, col: D.glow }, ...extra];
      sceneNightIsland = function (t, d) {
        camKeys(t, [[0, 1672, 941, .58], [d, 1680, 900, .66]]);
        const night = ss(seg(t, .5, 4.5)); drawMap(night, [{ x: T0.x, y: T0.y - 100, r: 360, a: .9, col: D.glow }]); landmark(t, .45);
        g.fillStyle = `rgba(255,140,60,${.18 * (1 - night)})`; g.fillRect(0, 0, W, H); skyStars(t, night * .9);
        const k = back(seg(t, 1, 1.6)); text(D.title, W / 2, 420, 150, '#FFD84D', '#7A3A10', { k, al: clamp(seg(t, 1, 1.3)) * clamp((d - .3 - t) / .5) });
        text(CFG.lop ? `${CFG.lop} · ${D.island}` : D.island, W / 2, 560, 60, '#FFFFFF', '#1F2D4A', { al: clamp(seg(t, 1.8, 2.3)) * clamp((d - .3 - t) / .5) });
      };
      sceneCamp = function (t, d) {
        const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0B1640'); sky.addColorStop(1, '#2A3F7A'); g.fillStyle = sky; g.fillRect(0, 0, W, H); skyStars(t, 1);
        g.fillStyle = '#1F5A35'; g.beginPath(); g.ellipse(960, 1150, 1200, 380, 0, Math.PI, 0); g.fill(); g.fillStyle = '#2E7A45'; g.beginPath(); g.ellipse(960, 1170, 1000, 330, 0, Math.PI, 0); g.fill();
        g.save(); g.globalCompositeOperation = 'lighter'; glow(960, 700, 420, D.glow, .45 + .1 * Math.sin(t * 3)); g.restore();
        if (D.key === 'dao_hat_mam') spr('t2', 960, 880, 380 * back(seg(t, .2, .9)));
        else { spr('gateOff', 960, 900, 470 * back(seg(t, .2, .9))); }
        for (let i = 0; i < 14; i++) { const a = t * 1.2 + i * .45, r = 260 + 30 * Math.sin(t * 2 + i); const x = 960 + Math.cos(a) * r, y = 720 + Math.sin(a) * r * .4; if (IM.gem && IM.gem.width) g.drawImage(IM.gem, x - 26, y - 26, 52, 52); }
        spr('anhChi', 360, 1060, 620 * eout(seg(t, .4, 1.1))); spr('benF', 1470, 1060, 450 * eout(seg(t, .6, 1.3))); spr('miaF', 1700, 1060, 440 * eout(seg(t, .7, 1.4)));
        spr('pipSang', 1560, 380 + 18 * Math.sin(t * 3), 220 * eout(seg(t, .9, 1.5)));
        cap(t, d, D.camp, 1.2);
      };
      sceneGems = function (t, d) {
        const tt = T.s3 + t, n = gemsArrived(tt), lk = n / 70;
        camKeys(t, [[0, T0.x, T0.y - 200, .95], [2.4, 1672, 941, .574], [d, 1672, 941, .574]]);
        drawMap(1, lights([{ x: T0.x, y: T0.y - 100, r: 300 + 500 * lk, a: .6 + .4 * lk, col: D.glow }])); landmark(tt, D.key === 'dao_hat_mam' ? .45 + .5 * lk : lk); skyStars(t, .55);
        const pos = (i, tq) => { const t0 = T.gem0 + i * T.gemGap, u = (tq - t0) / 1.6; if (u < 0 || u > 1) return null; const e = ss(u), a = routeAt(i * 7), b = { x: T0.x, y: T0.y - 140 }, cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - 220; return { x: (1 - e) * (1 - e) * a.x + 2 * (1 - e) * e * cx + e * e * b.x, y: (1 - e) * (1 - e) * a.y + 2 * (1 - e) * e * cy + e * e * b.y, u }; };
        g.save(); g.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 70; i++) { const p = pos(i, tt); if (!p) continue; const s = toS(p), sz = Math.max(34, 60 * cam.z); glow(s.x, s.y, sz * 1.5, D.glow, .55); for (let k = 1; k < 6; k++) { const q = pos(i, tt - k * .05); if (!q) break; const sq = toS(q); g.fillStyle = `rgba(255,255,255,${.3 - k * .05})`; g.beginPath(); g.arc(sq.x, sq.y, sz * (.3 - k * .04), 0, 7); g.fill(); } }
        g.restore();
        for (let i = 0; i < 70; i++) { const p = pos(i, tt); if (!p) continue; const s = toS(p), sz = Math.max(34, 60 * cam.z), im = IM.gem; if (!im || !im.width) continue; const w = sz * Math.max(1, im.width / im.height), h = w * im.height / im.width; g.save(); g.translate(s.x, s.y); g.rotate(p.u * 4); g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); }
        g.fillStyle = 'rgba(10,18,50,.7)'; rrect(W - 470, 36, 430, 110, 30); g.fill(); if (IM.gem && IM.gem.width) { const h = 80, w = Math.min(120, h * IM.gem.width / IM.gem.height); g.drawImage(IM.gem, W - 450, 50, w, w * IM.gem.height / IM.gem.width); }
        text(`${n} / 70`, W - 230, 92, 70, '#FFD84D', '#5A3A06', { k: 1 + .08 * Math.exp(-((tt - T.gem0 - 1.6) % T.gemGap) * 20) });
        cap(t, d, n < 70 ? D.fly : D.full, .6);
      };
      sceneIgnite = function (t, d) {
        const tt = T.s4 + t, ig = T.ign - T.s4, on = ss(seg(t, ig, ig + .9));
        const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#060B24'); sky.addColorStop(.7, '#1E2F6A'); sky.addColorStop(1, '#2B4A86'); g.fillStyle = sky; g.fillRect(0, 0, W, H); skyStars(t, 1);
        g.fillStyle = '#1F5A35'; g.beginPath(); g.ellipse(960, 1150, 1100, 330, 0, Math.PI, 0); g.fill(); g.fillStyle = '#2E7A45'; g.beginPath(); g.ellipse(960, 1170, 900, 280, 0, Math.PI, 0); g.fill();
        for (let i = 0; i < 12; i++) { const u = seg(t, i * .14, i * .14 + .9); if (u <= 0 || u >= 1) continue; const a = i * 2.1, r = 650 * (1 - ss(u)), im = IM.gem; if (im && im.width) g.drawImage(im, 960 + Math.cos(a) * r - 30, 560 + Math.sin(a) * r * .6 - 30, 60, 60); }
        g.save(); g.globalCompositeOperation = 'lighter'; glow(960, 560, 380 + 300 * on, D.glow, .35 + .6 * on); g.restore();
        if (D.key === 'dao_hat_mam') {
          const h = lerp(380, 720, eout(on)); spr('t2', 960, 950, 380, { al: 1 - on }); spr('t3', 960, 950, h, { al: on });
          for (let i = 0; i < 40 * on; i++) { const x = 960 + (rnd(i) - .5) * 1300, y = ((rnd(i + 5) * 900 + tt * (60 + rnd(i + 9) * 50)) % 1000) - 40; g.fillStyle = ['#FF9EC8', '#FFD84D', '#FFFFFF'][i % 3]; g.save(); g.translate(x, y); g.rotate(tt * 2 + i); g.beginPath(); g.ellipse(0, 0, 9, 5, 0, 0, 7); g.fill(); g.restore(); }
        } else {
          spr('gateOff', 960, 950, 560); const im = IM.rainbow;
          if (im && im.width && on > 0) { const w = 430, h = w * im.height / im.width, x0 = 960 - w / 2, y0 = 950 - 560 * .9; g.save(); g.beginPath(); g.rect(x0, y0 - 20, w * on, h + 60); g.clip(); g.drawImage(im, x0, y0 + 40, w, h); g.restore(); }
          const bu = seg(t, ig + 1.2, d); spr('balloon', lerp(1500, 1250, bu), lerp(1000, 330, eout(bu)), 330 * clamp(bu * 4), { rot: .05 * Math.sin(tt * 2) });
        }
        const fl = clamp(1 - Math.abs(t - ig - .15) / .35); if (fl > 0) { g.fillStyle = `rgba(255,255,240,${fl * .7})`; g.fillRect(0, 0, W, H); }
        fireworks(tt, T.fw4);
        const ck = eout(seg(t, ig + .5, ig + 1.3));
        spr('anh', 300, 1080 + 40 * (1 - ck), 560 * ck); spr('ben', 1560, 1085 - 30 * Math.abs(Math.sin(t * 5)) * ck, 430 * ck); spr('mia', 1780, 1085 - 30 * Math.abs(Math.sin(t * 5 + 1)) * ck, 420 * ck);
        spr('pipReo', 560, 330 + 20 * Math.sin(t * 3), 200 * ck);
        text(D.big, W / 2, 140, 120, '#FFD84D', '#7A3A10', { k: back(seg(t, ig + .6, ig + 1.2)), al: clamp(seg(t, ig + .6, ig + .8)) });
      };
      sceneLitIsland = function (t, d) {
        const tt = T.s5 + t; camKeys(t, [[0, T0.x, T0.y - 100, .85], [d, 1672, 941, .6]]);
        const L = lights(); D.route.forEach((p, i) => { const k = seg(t, i * .07, i * .07 + .4); if (k > 0) L.push({ x: p.x, y: p.y, r: 130 * k, a: .85, col: 'rgba(255,225,140,A)' }); });
        drawMap(1, L); landmark(tt, 1); if (D.key === 'dao_cau_vong') { const p = TG(); spr('balloon', p.x + 260 * cam.z, p.y - 40 * cam.z - 30 * Math.sin(tt), 300 * cam.z); }
        skyStars(t, .7); fireworks(tt, T.fw5);
        D.friends.forEach((n, i) => { const k = back(seg(t, 1 + i * .25, 1.5 + i * .25)); if (k <= 0) return; const x = 330 + i * 180, y = 1060 - 26 * Math.abs(Math.sin(t * 5 + i)); g.save(); g.globalCompositeOperation = 'lighter'; glow(x, y - 60, 120, 'rgba(255,220,140,A)', .25); g.restore(); spr(n, x, y, 150 * k); });
        cap(t, d, D.lit, .8);
      };
      sceneFinal = function (t, d) {
        const tt = T.s7 + t; camKeys(t, [[0, 1672, 941, .6], [d, 1680, 880, .66]]);
        drawMap(1, lights(D.route.map(p => ({ x: p.x, y: p.y, r: 130, a: .85, col: 'rgba(255,225,140,A)' })))); landmark(tt, 1); skyStars(t, .7); fireworks(tt, T.fw7);
        g.fillStyle = 'rgba(5,10,30,.35)'; g.fillRect(0, 0, W, H);
        text('Chúc mừng cả lớp!', W / 2, 360, 140, '#FFD84D', '#7A3A10', { k: back(seg(t, .3, .9)), al: clamp(seg(t, .3, .5)) });
        text(D.thank[0], W / 2, 500, 50, '#FFFFFF', '#1F2D4A', { al: clamp(seg(t, 1.2, 1.7)) });
        text(D.thank[1], W / 2, 568, 50, '#FFFFFF', '#1F2D4A', { al: clamp(seg(t, 1.5, 2)) });
        text('Hẹn gặp lại ở chuyến phiêu lưu tiếp theo!', W / 2, 680, 56, '#9FF0E6', '#0D4D48', { al: clamp(seg(t, 2.6, 3.1)) });
        const ck = eout(seg(t, .8, 1.6));
        spr('anh', 330, H + 20, 430 * ck); spr('ben', W - 420, H + 20 - 24 * Math.abs(Math.sin(t * 5)), 330 * ck); spr('mia', W - 240, H + 20 - 24 * Math.abs(Math.sin(t * 5 + 1)), 320 * ck); spr('pipReo', W / 2, 250 + 14 * Math.sin(t * 3), 150 * ck);
        const fo = seg(t, d - 1.4, d); if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
      };
    },
  };
})();
