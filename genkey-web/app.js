/**
 * KeyGen 32 - Website tạo 1 key 32 ký tự theo tên với animation cực đẹp
 * Thuật toán 100% chuẩn Python genkey.py:
 *   chars = string.ascii_lowercase + string.digits  (a-z0-9)
 *   suffix_length = 32 - len(prefix)
 *   suffix = random_choice(chars, suffix_length)
 *   key = prefix + suffix
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
const soundSwitch = document.getElementById('soundSwitch');
const toastEl = document.getElementById('toast');

const holoCard = document.getElementById('holoCard');
const cardWrapper = document.getElementById('cardWrapper');

let currentKey = '';
let isScrambling = false;

/* ==========================================================================
   Web Audio API - Âm thanh công nghệ Sci-Fi
   ========================================================================== */
function playSfx(type = 'generate') {
  if (!soundSwitch.checked) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'generate') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } else if (type === 'copy') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }
  } catch (e) {
    // Autoplay policy fallback
  }
}

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
  // Chuyển chữ thường, bỏ khoảng trắng thừa
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
  // Random suffix từ CHARS
  for (let i = 0; i < suffixLen; i++) {
    const idx = Math.floor(Math.random() * CHARS.length);
    suffix += CHARS[idx];
  }

  return {
    prefix: clean,
    suffix: suffix,
    fullKey: clean + suffix
  };
}

/* ==========================================================================
   Hiệu ứng Giải Mã Scramble Animation sinh động
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

  playSfx('generate');

  // Animation scramble trong 400ms
  let frame = 0;
  const totalFrames = 12;

  const interval = setInterval(() => {
    frame++;
    let randomSuffix = '';
    for (let i = 0; i < suffixLen; i++) {
      randomSuffix += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    suffixSpan.textContent = randomSuffix;
    playSfx('tick');

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

  playSfx('copy');
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

    const rotateX = ((y - centerY) / centerY) * -6; // max -6deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

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

// Khởi tạo key mẫu ban đầu
handleInputChange();
triggerGenerateKey();
