// Từ lễ hội Việt Nam (Trung thu, Tết) có hình vẽ sẵn (SVG), thêm vào trò Rương bí mật và kho từ chung.
(function () {
  const svg = s => 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' + s + '</svg>');
  const star = (cx, cy, R, r) => { let p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1)); } return p.join(' '); };
  // đèn ông sao
  const LANTERN = svg(`<defs><radialGradient id="l" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#FFE27A"/><stop offset=".55" stop-color="#F2483B"/><stop offset="1" stop-color="#B51F2B"/></radialGradient></defs>
    <line x1="150" y1="250" x2="262" y2="292" stroke="#8A5A2B" stroke-width="12" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="118" fill="#FFD23F" opacity=".22"/>
    <polygon points="${star(150, 150, 120, 50)}" fill="url(#l)" stroke="#FFD23F" stroke-width="9" stroke-linejoin="round"/>
    <polygon points="${star(150, 150, 60, 25)}" fill="#FFF3B0" opacity=".85"/>
    <path d="M60 262 q20 -30 0 -60 M240 82 q24 -10 30 -36" stroke="#FFD23F" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  // bánh trung thu
  let scal = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; scal += `<circle cx="${(150 + Math.cos(a) * 112).toFixed(1)}" cy="${(160 + Math.sin(a) * 112).toFixed(1)}" r="22" fill="#C98A3A"/>`; }
  const MOONCAKE = svg(`<ellipse cx="150" cy="276" rx="110" ry="14" fill="#000" opacity=".12"/>${scal}
    <circle cx="150" cy="160" r="112" fill="#D99A48"/><circle cx="150" cy="160" r="86" fill="#E8B062" stroke="#B87A2E" stroke-width="6"/>
    <circle cx="150" cy="160" r="30" fill="none" stroke="#B87A2E" stroke-width="7"/>
    ${[0, 1, 2, 3, 4, 5].map(i => { const a = i * Math.PI / 3; return `<ellipse cx="${(150 + Math.cos(a) * 56).toFixed(1)}" cy="${(160 + Math.sin(a) * 56).toFixed(1)}" rx="18" ry="9" transform="rotate(${i * 60} ${(150 + Math.cos(a) * 56).toFixed(1)} ${(160 + Math.sin(a) * 56).toFixed(1)})" fill="none" stroke="#B87A2E" stroke-width="6"/>`; }).join('')}
    <ellipse cx="112" cy="110" rx="34" ry="14" fill="#FFF" opacity=".25" transform="rotate(-30 112 110)"/>`);
  // trăng rằm
  const MOON = svg(`<circle cx="150" cy="150" r="135" fill="#FFE27A" opacity=".25"/><circle cx="150" cy="150" r="105" fill="#FFD84D"/>
    <circle cx="118" cy="120" r="20" fill="#F2C230"/><circle cx="182" cy="178" r="26" fill="#F2C230"/><circle cx="170" cy="105" r="11" fill="#F2C230"/><circle cx="112" cy="190" r="13" fill="#F2C230"/>
    <ellipse cx="105" cy="92" rx="30" ry="12" fill="#FFF" opacity=".45" transform="rotate(-35 105 92)"/>`);
  // lì xì
  const LUCKY = svg(`<ellipse cx="150" cy="282" rx="90" ry="10" fill="#000" opacity=".12"/>
    <rect x="70" y="30" width="160" height="240" rx="16" fill="#E0242F"/><path d="M70 46 q80 70 160 0 v-0 q0 -16 -16 -16 h-128 q-16 0 -16 16z" fill="#B8121F"/>
    <circle cx="150" cy="110" r="30" fill="#FFD23F" stroke="#E39A12" stroke-width="5"/><rect x="138" y="98" width="24" height="24" fill="#E0242F" rx="3"/>
    <path d="M95 190 h110 M95 215 h110" stroke="#FFD23F" stroke-width="7" stroke-linecap="round"/><path d="M105 240 h90" stroke="#FFD23F" stroke-width="5" stroke-linecap="round" opacity=".7"/>`);
  // pháo hoa
  const burst = (cx, cy, r, c) => { let s = ''; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += `<line x1="${(cx + Math.cos(a) * r * .25).toFixed(1)}" y1="${(cy + Math.sin(a) * r * .25).toFixed(1)}" x2="${(cx + Math.cos(a) * r).toFixed(1)}" y2="${(cy + Math.sin(a) * r).toFixed(1)}" stroke="${c}" stroke-width="7" stroke-linecap="round"/><circle cx="${(cx + Math.cos(a) * r * 1.08).toFixed(1)}" cy="${(cy + Math.sin(a) * r * 1.08).toFixed(1)}" r="5" fill="${c}"/>`; } return s; };
  const FIREWORKS = svg(`<rect x="10" y="10" width="280" height="280" rx="40" fill="#1F2D6A"/>${burst(110, 120, 70, '#FFD23F')}${burst(205, 95, 52, '#FF6BA8')}${burst(195, 210, 58, '#5FE3D0')}
    <circle cx="60" cy="235" r="4" fill="#fff"/><circle cx="250" cy="260" r="3" fill="#fff"/><circle cx="40" cy="60" r="3" fill="#fff"/>`);
  window.LE_HOI_VIET = [
    { w: 'lantern', img: LANTERN, alt: ['lanterns', 'lantan', 'land turn', 'lanton', 'lantin'], g: 'viet', mua: 'trungthu' },
    { w: 'mooncake', img: MOONCAKE, alt: ['moon cake', 'mooncakes', 'moon cakes', 'moon kate'], g: 'viet', mua: 'trungthu' },
    { w: 'moon', img: MOON, alt: ['moons', 'noon', 'mon', 'moo'], g: 'viet', mua: 'trungthu' },
    { w: 'lucky money', img: LUCKY, alt: ['lucky', 'money', 'luck money', 'lucky monkey', 'lucky many'], g: 'viet', mua: 'tet' },
    { w: 'fireworks', img: FIREWORKS, alt: ['firework', 'fire works', 'fire work', 'five works'], g: 'viet', mua: 'tet' },
  ];
})();
