// ==========================================
// 1. SISTEMA DE PÉTALOS Y DESTELLOS (CANVAS)
// ==========================================
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Partículas de pétalos
const petals = [];
const sparkles = [];
const TOTAL_PETALS = 32;
const TOTAL_SPARKLES = 40;

class Petal {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -20;
    this.size = Math.random() * 12 + 10;
    this.speedY = Math.random() * 1.6 + 0.8;
    this.speedX = Math.random() * 1.2 - 0.6;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 2;
    this.oscillationSpeed = Math.random() * 0.03 + 0.01;
    this.angle = Math.random() * Math.PI * 2;
    // Tonalidades de amarillo
    const yellowTones = ['#ffd000', '#ffe66d', '#f59e0b', '#fff275'];
    this.color = yellowTones[Math.floor(Math.random() * yellowTones.length)];
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.angle += this.oscillationSpeed;
    this.x += Math.sin(this.angle) * 1.5 + this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;

    if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
      this.reset(false);
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    // Dibujar forma de pétalo orgánico
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size / 2, 0, this.size);
    ctx.bezierCurveTo(this.size / 2, this.size / 2, this.size / 2, -this.size / 2, 0, 0);
    ctx.fill();

    // Sombra suave en el pétalo
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

class Sparkle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.pulse = Math.random() * 0.05 + 0.02;
  }

  update() {
    this.y += this.speedY;
    this.alpha += Math.sin(Date.now() * this.pulse) * 0.02;
    if (this.y < -10) {
      this.y = height + 10;
      this.x = Math.random() * width;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = '#ffeaa7';
    ctx.shadowColor = '#ffd000';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < TOTAL_PETALS; i++) petals.push(new Petal());
for (let i = 0; i < TOTAL_SPARKLES; i++) sparkles.push(new Sparkle());

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  sparkles.forEach((s) => {
    s.update();
    s.draw();
  });

  petals.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// 2. EFECTO DE CONFETI CELEBRATORIO (CANVAS)
// ==========================================
const confettis = [];
function launchConfetti(count = 70) {
  const colors = ['#ffd700', '#ffb703', '#ffffff', '#fb8500', '#ff006e', '#ffdd00'];
  for (let i = 0; i < count; i++) {
    confettis.push({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      alpha: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'heart'
    });
  }
}

function updateConfetti() {
  for (let i = confettis.length - 1; i >= 0; i--) {
    const c = confettis[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.4; // Gravedad
    c.vx *= 0.98;
    c.rotation += c.rotSpeed;
    c.alpha -= 0.012;

    if (c.alpha <= 0) {
      confettis.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((c.rotation * Math.PI) / 180);
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = c.color;

    if (c.shape === 'rect') {
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
    } else {
      // Corazoncito
      ctx.font = `${c.size * 1.5}px serif`;
      ctx.fillText('💛', 0, 0);
    }
    ctx.restore();
  }

  requestAnimationFrame(updateConfetti);
}
updateConfetti();

// ==========================================
// 3. INTERACCIÓN CON LAS FLORES
// ==========================================
document.querySelectorAll('.flower').forEach((flower) => {
  flower.addEventListener('click', (e) => {
    // Pequeño rebote al hacer click
    flower.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    flower.style.transform = 'scale(1.15)';
    setTimeout(() => {
      flower.style.transform = '';
    }, 300);

    // Chispitas saliendo de la flor
    launchConfetti(20);
  });
});

// ==========================================
// 4. CONTROL DE LA CARTA / MODAL
// ==========================================
const openBtn = document.getElementById('open-letter-btn');
const closeBtn = document.getElementById('close-letter-btn');
const modal = document.getElementById('letter-modal');
const moreConfettiBtn = document.getElementById('card-confetti-btn');

function openModal() {
  modal.classList.remove('hidden');
  launchConfetti(80);
  // Si la música no está sonando, iniciarla al abrir la cartita
  if (florAudio && florAudio.paused) {
    playMusic();
  }
}

function closeModal() {
  modal.classList.add('hidden');
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

moreConfettiBtn.addEventListener('click', () => {
  launchConfetti(60);
});

// ==========================================
// 5. REPRODUCTOR DE FLORES AMARILLAS (FLORICIENTA)
// ==========================================
const florAudio = document.getElementById('flor-audio');
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');

function playMusic() {
  if (!florAudio) return;
  florAudio.play().then(() => {
    musicBtn.classList.add('playing');
    musicIcon.textContent = '⏸️';
  }).catch((err) => {
    console.log('Reproducción interactiva requerida:', err);
  });
}

function pauseMusic() {
  if (!florAudio) return;
  florAudio.pause();
  musicBtn.classList.remove('playing');
  musicIcon.textContent = '▶️';
}

function toggleMusic() {
  if (!florAudio) return;
  if (florAudio.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

musicBtn.addEventListener('click', toggleMusic);

florAudio.addEventListener('ended', () => {
  musicBtn.classList.remove('playing');
  musicIcon.textContent = '▶️';
});

