// Bài hát theo unit cho phần "Hát và chant" trên đảo (phím C).
// Lời do Quần đảo Song Kim tự viết (không chép lời bài hát trong sách), câu ngắn, lặp lại, có động tác để trẻ hát theo nhịp trống.
// Bài hát trong sách (CD Amanda) cô vẫn mở bằng đĩa như thường; bài ở đây để cả lớp hát vui cùng Pip.
(function () {
  const S = {
    home: { ten: 'My House', dong: [
      ['This is my house, my house, my house!'], ['Here is the kitchen. Cook, cook, cook!', 'kitchen'], ['Here is the bedroom. Sleep, sleep, sleep!', 'bedroom'],
      ['Here is the bathroom. Splash, splash, splash!', 'bathroom'], ['Here is the living room. Sit, sit, sit!', 'living room'], ['I love my house, my house, my house!'] ] },
    toys: { ten: 'My Toys', dong: [
      ['One, two, three, come and play with me!'], ['A ball, a ball. Bounce, bounce, bounce!', 'ball'], ['A car, a car. Zoom, zoom, zoom!', 'car'],
      ['A doll, a doll. Dance, dance, dance!', 'doll'], ['A teddy, a teddy. Hug, hug, hug!', 'teddy'], ['A train, a train. Choo, choo, choo!', 'train'], ['I love my toys! Hooray!'] ] },
    body: { ten: 'Move Your Body', dong: [
      ['Head, head. Touch your head!', 'head'], ['Hands, hands. Clap your hands!', 'hand'], ['Feet, feet. Stamp your feet!', 'foot'],
      ['Arms, arms. Wave your arms!', 'arm'], ['Legs, legs. Jump, jump, jump!', 'leg'], ['Nose, nose. Touch your nose!', 'nose'], ['Move your body, one, two, three!'] ] },
    clothes: { ten: 'Getting Dressed', dong: [
      ["It's cold today! Brrr, brrr, brrr!"], ['Put on your scarf, your scarf, your scarf!', 'scarf'], ['Put on your boots, your boots, your boots!', 'boots'],
      ['Put on your T-shirt, one, two, three!', 'T-shirt'], ['Put on your socks and your shoes!', 'socks'], ['Put on your dress! Turn around!', 'dress'], ["Now I'm ready! Let's go!"] ] },
    animals: { ten: 'In the Jungle', dong: [
      ["Let's go to the jungle, the jungle, the jungle!"], ['I can see a lion. Roar, roar, roar!', 'lion'], ['I can see a monkey. Ooh, ooh, ah, ah!', 'monkey'],
      ['I can see a snake. Sss, sss, sss!', 'snake'], ['I can see an elephant. Stomp, stomp, stomp!', 'elephant'], ['I can see a giraffe. Tall, tall, tall!', 'giraffe'], ['Goodbye, animals! See you soon!'] ] },
    pets: { ten: 'My Pets', dong: [
      ['I have a pet, a pet, a pet!'], ['A dog says woof, woof, woof!', 'dog'], ['A cat says meow, meow, meow!', 'cat'],
      ['A bird says tweet, tweet, tweet!', 'bird'], ['A fish says blub, blub, blub!', 'fish'], ['A rabbit goes hop, hop, hop!', 'rabbit'], ['I love my pets!'] ] },
    food: { ten: 'Yummy, Yummy', dong: [
      ["I'm hungry, hungry, hungry!", 'hungry'], ['An apple, please! Yum, yum, yum!', 'apple'], ['A banana, please! Yum, yum, yum!', 'banana'],
      ['Some cake, please! Yum, yum, yum!', 'cake'], ["I'm thirsty, thirsty, thirsty!", 'thirsty'], ['Some milk, please! Gulp, gulp, gulp!', 'milk'], ['Thank you! Yummy, yummy!'] ] },
    school: { ten: 'At School', dong: [
      ['Good morning, school! Hello, hello!'], ['Open your bag, your bag, your bag!', 'bag'], ['Here is my book. Read, read, read!', 'book'],
      ['Here is my pencil. Write, write, write!', 'pencil'], ['Here is my crayon. Draw, draw, draw!', 'crayon'], ['Sit on your chair. One, two, three!', 'chair'] ] },
    family: { ten: 'My Family', dong: [
      ['This is my family, my family!'], ['This is my daddy. Hello, Daddy!', 'daddy'], ['This is my mummy. Hello, Mummy!', 'mummy'],
      ['This is my brother. Hello, brother!', 'brother'], ['This is my sister. Hello, sister!', 'sister'], ['This is my granny. Hello, Granny!', 'granny'], ['I love my family!'] ] },
    transport: { ten: "Let's Go!", dong: [
      ["Let's go, let's go, let's go!"], ['On the bus. Beep, beep, beep!', 'bus'], ['On the bike. Ring, ring, ring!', 'bike'],
      ['On the boat. Splash, splash, splash!', 'boat'], ['On the plane. Zoom, zoom, zoom!', 'plane'], ['On the train. Choo, choo, choo!', 'train'], ["Let's go, let's go, let's go!"] ] },
    numbers: { ten: 'Count With Me', dong: [
      ['One, two, three. Clap with me!', 'three'], ['Four, five, six. Jump, jump, jump!', 'six'], ['Seven, eight. Stamp your feet!', 'eight'],
      ['Nine, ten. Count again!', 'ten'], ['One, two, three, four, five!', 'five'], ['Six, seven, eight, nine, ten! Hooray!'] ] },
    colours: { ten: 'Rainbow Colours', dong: [
      ['Red, red, red. Red like an apple!', 'red'], ['Yellow, yellow. Yellow like the sun!', 'yellow'], ['Blue, blue, blue. Blue like the sea!', 'blue'],
      ['Green, green, green. Green like a tree!', 'green'], ['Orange, pink and purple too!', 'purple'], ['Rainbow colours! One, two, three!'] ] },
    halloween: { ten: 'Halloween Chant', dong: [
      ['Trick or treat! Trick or treat!'], ['A pumpkin, a pumpkin. Boo, boo, boo!', 'pumpkin'], ['A ghost, a ghost. Boo, boo, boo!', 'ghost'],
      ['A bat, a bat. Flap, flap, flap!', 'bat'], ['A witch, a witch. Ha, ha, ha!', 'witch'], ['Happy Halloween!'] ] },
    christmas: { ten: 'Merry Christmas', dong: [
      ['Ho, ho, ho! Merry Christmas!', 'Santa'], ['Look at the tree, the Christmas tree!', 'tree'], ['Look at the star. Twinkle, twinkle!', 'star'],
      ['Here are the presents. One, two, three!', 'presents'], ['Merry Christmas, everyone!', 'reindeer'] ] },
    trungthu: { ten: 'Mid-Autumn Song', dong: [
      ['Look at the moon, the big round moon!', 'moon'], ['Here is my lantern. Shine, shine, shine!', 'lantern'], ['Here is a mooncake. Yum, yum, yum!', 'mooncake'],
      ['Happy Mid-Autumn Festival!'] ] },
    tet: { ten: 'Happy Tet', dong: [
      ['Happy New Year! Happy New Year!'], ['Lucky money! Thank you, thank you!', 'lucky money'], ['Fireworks, fireworks! Boom, boom, boom!', 'fireworks'],
      ['Happy Tet, everyone!'] ] },
  };
  const NUM = /^(one|two|three|four|five|six|seven|eight|nine|ten)$/i, COL = /^(red|yellow|blue|green|orange|pink|purple|brown|black|white)$/i;
  const has = (ws, list) => ws.some(w => list.includes(w));
  // chọn bài: theo từ của tiết (số, màu, lễ hội) rồi theo tên unit; mua = 'trungthu' | 'tet' | ''
  function chon(unit, ws, mua, allUnits) {
    ws = (ws || []).map(w => String(w).toLowerCase().trim());
    if (ws.filter(w => NUM.test(w)).length >= 2) return S.numbers;
    if (ws.filter(w => COL.test(w)).length >= 2) return S.colours;
    const u = String(unit || '').toLowerCase();
    if (/festival/.test(u)) {
      if (has(ws, ['pumpkin', 'ghost', 'witch', 'bat', 'spider', 'monster', 'costume', 'candy'])) return S.halloween;
      if (has(ws, ['santa', 'tree', 'presents', 'star', 'reindeer', 'gift'])) return S.christmas;
      if (has(ws, ['lantern', 'mooncake', 'moon']) || mua === 'trungthu') return S.trungthu;
      if (has(ws, ['lucky money', 'fireworks']) || mua === 'tet') return S.tet;
      const m = new Date().getMonth() + 1; return m === 10 || m === 11 ? S.halloween : S.christmas;
    }
    const t = T.find(([r]) => r.test(u)); if (t) return S[t[1]];
    // tiết ôn tập / kiểm tra / củng cố: nối các bài của những unit được ôn (VD "Home + Toys", "Units 1–3"), không rõ thì lấy ba unit của đảo
    if (/review|assessment|consolidation/.test(u)) {
      const txt = ws.join(' '), keys = [];
      const add = s => T.forEach(([r, k]) => { if (r.test(String(s).toLowerCase()) && !keys.includes(k) && k !== 'colours') keys.push(k); });
      add(txt);
      const m = txt.match(/units?\s*(\d)\s*[–-]\s*(\d)/);
      if (m) (allUnits || []).forEach(x => { const n = +(String(x).match(/unit\s*(\d)/i) || [])[1]; if (n >= +m[1] && n <= +m[2]) add(x); });
      if (!keys.length) (allUnits || []).filter(x => /^unit/i.test(x)).forEach(add);
      const pick = keys.length > 3 && !m && !/\+/.test(txt) ? keys.sort(() => Math.random() - .5).slice(0, 3) : keys.slice(0, 3);
      if (pick.length) return { ten: 'Review Medley', dong: [["Let's sing and remember!"]].concat(...pick.map(k => S[k].dong.slice(0, 3)), [['Great singing, everyone!']]) };
    }
    return null;
  }
  const T = [[/home|house/, 'home'], [/toy/, 'toys'], [/body|face/, 'body'], [/cloth/, 'clothes'], [/animal/, 'animals'], [/pet/, 'pets'], [/food|drink/, 'food'], [/school/, 'school'], [/family/, 'family'], [/transport/, 'transport'], [/welcome|colou?r/, 'colours'], [/number/, 'numbers']];
  window.BAI_HAT = { S, chon };
})();
