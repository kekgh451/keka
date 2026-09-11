// ========== УТИЛИТЫ ==========
function playSound(id) {
  const snd = document.getElementById(id);
  if (!snd) {
    console.log('❌ Нет элемента:', id);
    return;
  }
  snd.currentTime = 0;
  snd.play()
    .then(() => console.log('✅ Играет:', id))
    .catch(err => console.log('❌ Звук не сработал:', id, err));
}

function stageCoords(clientX, clientY) {
  const stage = document.getElementById('stage');
  const rect = stage.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top, stage };
}

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

function fartCloud(clientX, clientY) {
  const { x, y, stage } = stageCoords(clientX, clientY);
  const cloud = document.createElement('div');
  cloud.className = 'fart-cloud';
  cloud.style.left = (x - 45) + 'px';
  cloud.style.top  = (y - 45) + 'px';
  stage.appendChild(cloud);
  setTimeout(() => cloud.remove(), 2000);
}

function animate(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 700);
}

// ========== УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ==========
document.querySelectorAll('.hitbox[data-sound]').forEach(box => {
  box.addEventListener('click', function (e) {
    console.log('👆 Клик по', this.dataset.sound);
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
  const xPercent = (e.clientX - rect.left) / rect.width;
  const yPercent = (e.clientY - rect.top)  / rect.height;

  console.log('🎯 Красный/синий — x:', xPercent.toFixed(2), 'y:', yPercent.toFixed(2));

  const isRed = xPercent < 0.5;

  if (isRed) {
    // 🍑 попа красного
    if (yPercent > 0.7 && xPercent > 0.1 && xPercent < 0.4) {
      playSound('snd-fart');
      fartCloud(e.clientX, e.clientY);
      popEmoji(e.clientX, e.clientY, '💨');
      animate(this, 'animate-shake');
      return;
    }
    // 💋 лицо красного
    if (yPercent < 0.35 && xPercent < 0.4) {
      playSound('snd-kiss');
      attachHeart(e.clientX, e.clientY);
      attachHeart(e.clientX, e.clientY);
      popEmoji(e.clientX, e.clientY, '💖');
      animate(this, 'animate-wiggle');
      return;
    }
    // обычный тык
    playSound('snd-pop');
    popEmoji(e.clientX, e.clientY, '❤️');
    animate(this, 'animate-boing');
  } else {
    // 💙 синий — всегда поцелуй
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
  if (e.target === this) {
    playSound('snd-pop');
  }
});
