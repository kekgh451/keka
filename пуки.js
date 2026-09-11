// ========== УТИЛИТЫ ==========

function playSound(id) {
  const snd = document.getElementById(id);
  if (!snd) return;
  snd.currentTime = 0;
  snd.play().catch(() => {});
}

function stageCoords(clientX, clientY) {
  const stage = document.getElementById('stage');
  const rect = stage.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
    stage
  };
}

// Летящий эмодзи из точки клика
function popEmoji(clientX, clientY, symbol) {
  const { x, y, stage } = stageCoords(clientX, clientY);
  const el = document.createElement('div');
  el.className = 'emoji-pop';
  el.textContent = symbol;
  el.style.left = (x - 30) + 'px';
  el.style.top  = (y - 30) + 'px';
  stage.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// Прилепить сердечко рядом с точкой клика
function attachHeart(clientX, clientY) {
  const { x, y, stage } = stageCoords(clientX, clientY);
  const heart = document.createElement('div');
  heart.className = 'heart-attach';
  heart.textContent = '💖';
  heart.style.left = (x + (Math.random() * 60 - 30)) + 'px';
  heart.style.top  = (y + (Math.random() * 60 - 30)) + 'px';
  stage.appendChild(heart);
  setTimeout(() => heart.remove(), 1500);
}

// Облачко пука
function fartCloud(clientX, clientY) {
  const { x, y, stage } = stageCoords(clientX, clientY);
  const cloud = document.createElement('div');
  cloud.className = 'fart-cloud';
  cloud.style.left = (x - 45) + 'px';
  cloud.style.top  = (y - 45) + 'px';
  stage.appendChild(cloud);
  setTimeout(() => cloud.remove(), 2000);
}

// Анимация хитбокса (короткая, чтобы не сбивать позиционирование)
function animate(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 700);
}

// ========== УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ==========
// Для всех хитбоксов, у которых есть data-sound / data-emoji

document.querySelectorAll('.hitbox[data-sound]').forEach(box => {
  box.addEventListener('click', function (e) {
    const sound = this.dataset.sound;
    const emoji = this.dataset.emoji;
    const anim  = this.dataset.anim;

    if (sound) playSound(sound);
    if (emoji) popEmoji(e.clientX, e.clientY, emoji);
    if (anim)  animate(this, 'animate-' + anim);
  });
});

// ========== СПЕЦ-ЛОГИКА ДЛЯ КРАСНОГО + СИНЕГО ==========

const redblue = document.getElementById('hit-redblue');

redblue.addEventListener('click', function (e) {
  const rect = this.getBoundingClientRect();
  const xPercent = (e.clientX - rect.left) / rect.width; // 0..1
  const yPercent = (e.clientY - rect.top)  / rect.height; // 0..1

  // Красный персонаж — левая половина
  const isRed = xPercent < 0.5;

  if (isRed) {
    // 🍑 Зона попы красного: низ левой половины
    if (yPercent > 0.7 && xPercent > 0.1 && xPercent < 0.4) {
      playSound('snd-fart');
      fartCloud(e.clientX, e.clientY);
      popEmoji(e.clientX, e.clientY, '💨');
      animate(this, 'animate-shake');
      return;
    }

    // 💋 Зона лица красного: верх левой половины
    if (yPercent < 0.35 && xPercent < 0.4) {
      playSound('snd-kiss');
      attachHeart(e.clientX, e.clientY);
      attachHeart(e.clientX, e.clientY);
      popEmoji(e.clientX, e.clientY, '💖');
      animate(this, 'animate-wiggle');
      return;
    }

    // Обычный тык по красному
    playSound('snd-pop');
    popEmoji(e.clientX, e.clientY, '❤️');
    animate(this, 'animate-boing');

  } else {
    // 💙 Синий персонаж — всегда поцелуй и сердечки
    playSound('snd-kiss');
    attachHeart(e.clientX, e.clientY);
    attachHeart(e.clientX, e.clientY);
    popEmoji(e.clientX, e.clientY, '💙');
    popEmoji(e.clientX, e.clientY, '💋');
    animate(this, 'animate-wiggle');
  }
});

// ========== КЛИК ПО ПУСТОМУ МЕСТУ ==========
document.getElementById('stage').addEventListener('click', function (e) {
  // Если кликнули именно по фону (не по хитбоксу)
  if (e.target.classList.contains('collage') || e.target === this) {
    playSound('snd-pop');
  }
});