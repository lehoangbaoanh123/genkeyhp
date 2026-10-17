/**
 * KeyGen 32 - Single Key Visual Masterpiece
 * 100% Logic Python genkey.py:
 *   chars = string.ascii_lowercase + string.digits  # [a-z0-9]
 *   suffix_length = 32 - len(prefix)
 *   suffix = random_choice(chars, suffix_length)
 *   key = prefix + suffix (đúng 32 ký tự)
 */

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const TOTAL_LENGTH = 32;

// Elements
const nameInput = document.getElementById('nameInput');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const lengthWarning = document.getElementById('lengthWarning');
const genBtn = document.getElementById('genBtn');
const btnLabel = document.getElementById('btnLabel');

const keyScreen = document.getElementById('keyScreen');
const keyDisplayArea = document.getElementById('keyDisplayArea');
const prefixSpan = document.getElementById('prefixSpan');
const suffixSpan = document.getElementById('suffixSpan');
const metaPrefixLen = document.getElementById('metaPrefixLen');
const metaSuffixLen = document.getElementById('metaSuffixLen');
const statusTag = document.getElementById('statusTag');

const copyBtn = document.getElementById('copyBtn');
const copyIcon = document.getElementById('copyIcon');
const copyText = document.getElementById('copyText');
const regenBtn = document.getElementById('regenBtn');
const toastEl = document.getElementById('toast');

const holoCard = document.getElementById('holoCard');
const cardWrapper = document.getElementById('cardWrapper');

let currentKey = '';
let isScrambling = false;

/* ==========================================================================
   Web Audio API - Âm thanh công nghệ Sci-Fi (Tự động phát khi bấm)
   ========================================================================== */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Âm thanh khi bắt đầu tạo key (Power-up charge)
function playChargeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.18);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {}
}

// Âm thanh tích tắc trong lúc giải mã ký tự (Data tick)
function playTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400 + Math.random() * 500, now);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch (e) {}
}

// Âm thanh hoàn thành tạo key (Futuristic chime chord)
function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.03);

      gain.gain.setValueAtTime(0.045, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.03 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.38);
    });
  } catch (e) {}
}

// Âm thanh khi sao chép key (Crisp copy chime)
function playCopySound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.05); // E6

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);

    osc2.start(now + 0.05);
    osc2.stop(now + 0.22);
  } catch (e) {}
}

/* ==========================================================================
   Interactive Background Canvas - Cyber Particle Constellation
   ========================================================================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let width, height;
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initParticles();
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 2 + 1;
    this.baseColor = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(16, 185, 129, ';
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Tương tác với chuột
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * 2.5;
        this.y -= (dy / distance) * force * 2.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.baseColor + this.alpha + ')';
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.baseColor + '0.6)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((width * height) / 12000), 75);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  const maxDist = 130;
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.hypot(dx, dy);

      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.22;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
        ctx.lineWidth = 0.9;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateBackground() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  connectParticles();
  requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
animateBackground();

/* ==========================================================================
   Pháo hoa Confetti Animation
   ========================================================================== */
function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#6366f1', '#a7f3d0'],
      disableForReducedMotion: true
    });
  }
}

/* ==========================================================================
   Chuẩn hóa tên đầu vào
   ========================================================================== */
function cleanPrefix(val) {
  return val.trim().toLowerCase().replace(/\s+/g, '');
}

/* ==========================================================================
   Thuật toán tạo 1 Key chuẩn 100% Python
   ========================================================================== */
function generateSingleKey(prefix) {
  const clean = cleanPrefix(prefix);
  const suffixLen = TOTAL_LENGTH - clean.length;

  if (suffixLen < 0) {
    throw new Error('Tên quá dài, tối đa 31 ký tự!');
  }

  let suffix = '';
  // Sử dụng window.crypto nếu có hoặc Math.random() chuẩn xác
  const hasCrypto = typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues;

  if (hasCrypto && suffixLen > 0) {
    const randomVals = new Uint32Array(suffixLen);
    window.crypto.getRandomValues(randomVals);
    for (let i = 0; i < suffixLen; i++) {
      suffix += CHARS[randomVals[i] % CHARS.length];
    }
  } else {
    for (let i = 0; i < suffixLen; i++) {
      suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  }

  return {
    prefix: clean,
    suffix: suffix,
    fullKey: clean + suffix
  };
}

/* ==========================================================================
   Hiệu ứng Giải Mã Scramble Animation & Âm Thanh
   ========================================================================== */
function triggerGenerateKey() {
  if (isScrambling) return;

  const rawInput = nameInput.value;
  const prefix = cleanPrefix(rawInput);

  if (prefix.length === 0) {
    showToast('⚠️ Vui lòng nhập tên hoặc tiền tố!');
    nameInput.focus();
    return;
  }

  if (prefix.length >= TOTAL_LENGTH) {
    showToast('⚠️ Tên quá dài! Tối đa 31 ký tự để tạo key 32 ký tự.');
    return;
  }

  isScrambling = true;
  genBtn.disabled = true;
  regenBtn.disabled = true;
  btnLabel.textContent = 'Đang giải mã key...';
  statusTag.textContent = '⚡ Đang tạo mã';
  statusTag.style.color = '#38bdf8';
  statusTag.style.borderColor = 'rgba(56, 189, 248, 0.4)';

  const targetKeyData = generateSingleKey(prefix);
  currentKey = targetKeyData.fullKey;

  const targetSuffix = targetKeyData.suffix;
  const suffixLen = targetSuffix.length;

  prefixSpan.textContent = targetKeyData.prefix;
  keyDisplayArea.classList.add('scrambling');

  // Phát âm thanh công nghệ lúc bắt đầu
  playChargeSound();

  // Animation scramble xoay ký tự
  let frame = 0;
  const totalFrames = 12;

  const interval = setInterval(() => {
    frame++;
    let randomSuffix = '';
    for (let i = 0; i < suffixLen; i++) {
      randomSuffix += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    suffixSpan.textContent = randomSuffix;
    
    // Tiếng bíp mã hóa nhẹ
    playTickSound();

    if (frame >= totalFrames) {
      clearInterval(interval);
      suffixSpan.textContent = targetSuffix;
      keyDisplayArea.classList.remove('scrambling');

      // Cập nhật thống kê độ dài
      metaPrefixLen.textContent = `${targetKeyData.prefix.length} ký tự`;
      metaSuffixLen.textContent = `${suffixLen} ký tự`;

      statusTag.textContent = '✓ 32 Ký tự hoàn tất';
      statusTag.style.color = '#34d399';
      statusTag.style.borderColor = 'rgba(16, 185, 129, 0.4)';

      isScrambling = false;
      genBtn.disabled = false;
      regenBtn.disabled = false;
      btnLabel.textContent = 'Tạo Lại Key Mới';

      // Phát âm thanh thành công & pháo hoa
      playSuccessSound();
      fireConfetti();
      showToast('✨ Đã tạo 1 key 32 ký tự thành công!');
    }
  }, 35);
}

/* ==========================================================================
   Sao Chép Key
   ========================================================================== */
async function copyCurrentKey() {
  if (!currentKey) {
    currentKey = prefixSpan.textContent + suffixSpan.textContent;
  }

  try {
    await navigator.clipboard.writeText(currentKey);
  } catch (e) {
    // Fallback
    const t = document.createElement('textarea');
    t.value = currentKey;
    t.style.position = 'fixed';
    t.style.left = '-9999px';
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
  }

  playCopySound();
  copyBtn.classList.add('copied');
  copyIcon.textContent = '✓';
  copyText.textContent = 'Đã Sao Chép!';
  showToast(`📋 Đã chép: ${currentKey}`);

  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyIcon.textContent = '📋';
    copyText.textContent = 'Sao Chép Key';
  }, 1600);
}

/* ==========================================================================
   Validate Input thời gian thực
   ========================================================================== */
function handleInputChange() {
  const clean = cleanPrefix(nameInput.value);
  const len = clean.length;
  charCount.textContent = `${len} / ${TOTAL_LENGTH}`;

  if (len >= TOTAL_LENGTH) {
    lengthWarning.classList.remove('hidden');
    genBtn.disabled = true;
    charCount.style.color = '#ef4444';
  } else {
    lengthWarning.classList.add('hidden');
    genBtn.disabled = false;
    charCount.style.color = 'var(--cyan-neon)';
  }
}

/* ==========================================================================
   3D Tilt Card Effect khi di chuột
   ========================================================================== */
if (cardWrapper && holoCard) {
  cardWrapper.addEventListener('mousemove', (e) => {
    const rect = cardWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    holoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  cardWrapper.addEventListener('mouseleave', () => {
    holoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   Toast Bubble
   ========================================================================== */
let toastTimeout;
function showToast(msg) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2200);
}

/* ==========================================================================
   Event Listeners
   ========================================================================== */
nameInput.addEventListener('input', handleInputChange);

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    triggerGenerateKey();
  }
});

clearBtn.addEventListener('click', () => {
  nameInput.value = '';
  handleInputChange();
  nameInput.focus();
});

// Khởi tạo hiển thị ban đầu (không auto play sound trước khi user bấm)
handleInputChange();
const initialKey = generateSingleKey('rasellinkedin');
currentKey = initialKey.fullKey;
prefixSpan.textContent = initialKey.prefix;
suffixSpan.textContent = initialKey.suffix;
metaPrefixLen.textContent = `${initialKey.prefix.length} ký tự`;
metaSuffixLen.textContent = `${initialKey.suffix.length} ký tự`;
statusTag.textContent = '✓ 32 Ký tự hoàn tất';
