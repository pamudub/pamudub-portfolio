// ── Web Audio UI SFX (prototype) ─────────────────────────────────────────────
// เสียงสไตล์ Persona 3 สำหรับ UI: เลื่อนเมนู / ยืนยัน / ย้อนกลับ / เปิดลิงก์
// กดปุ่ม "M" เพื่อปิด/เปิดเสียง (จำค่าไว้ใน localStorage)
// ลบไฟล์นี้ + ถอด import ออกจากทุกหน้า = ถอนการติดตั้งทั้งหมด

let ctx = null;
let muted = false;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem("p3sfx-muted") === "1";
  } catch (e) { /* ignore */ }

  // ── Unlock เสียงตั้งแต่ gesture แรก (สำคัญมากบนมือถือ) ──
  // iOS ไม่นับ touchstart เป็น gesture ที่ปลดล็อกเสียงได้ ต้องเป็น touchend/click
  // เลยฟังหลาย event ไว้เลย ใครมาก่อนเจอก่อน — ปลุก context ให้พร้อมก่อนเสียงแรก
  const unlock = () => {
    const c = ac();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("touchend", unlock, { passive: true });
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
}

function tone({ freq = 880, type = "square", dur = 0.07, vol = 0.08, slide = 0, delay = 0 }) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.09, vol = 0.05, delay = 0 }) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2200;
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.buffer = buf;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t0);
}

// ── Public SFX ────────────────────────────────────────────────────────────────
export const sfx = {
  // เลื่อนขึ้น/ลง: บลิปสั้นสองโทน
  move() {
    tone({ freq: 1180, dur: 0.045, vol: 0.05, type: "square" });
    tone({ freq: 1560, dur: 0.05, vol: 0.04, type: "square", delay: 0.03 });
  },
  // ยืนยัน / เปิดหน้า: คอร์ดขึ้น
  confirm() {
    tone({ freq: 740, dur: 0.07, vol: 0.06, type: "triangle" });
    tone({ freq: 1110, dur: 0.07, vol: 0.06, type: "triangle", delay: 0.05 });
    tone({ freq: 1480, dur: 0.1, vol: 0.07, type: "triangle", delay: 0.1 });
  },
  // ย้อนกลับ: สไลด์ลง
  back() {
    tone({ freq: 900, dur: 0.12, vol: 0.06, type: "sawtooth", slide: -500 });
    noise({ dur: 0.06, vol: 0.03 });
  },
  // เปิดลิงก์ภายนอก: ประกายสั้น
  open() {
    tone({ freq: 1320, dur: 0.05, vol: 0.05, type: "square" });
    tone({ freq: 1980, dur: 0.08, vol: 0.05, type: "square", delay: 0.04 });
    noise({ dur: 0.05, vol: 0.025, delay: 0.04 });
  },
  toggleMute() {
    muted = !muted;
    try {
      window.localStorage.setItem("p3sfx-muted", muted ? "1" : "0");
    } catch (e) { /* ignore */ }
    if (!muted) tone({ freq: 1200, dur: 0.08, vol: 0.07, type: "triangle" });
    return muted;
  },
  get muted() {
    return muted;
  },
};

// ผูกปุ่ม M = mute/unmute ทั้งเว็บ (ครั้งเดียว)
if (typeof window !== "undefined") {
  if (!window.__p3sfxBound) {
    window.__p3sfxBound = true;
    window.addEventListener("keydown", (e) => {
      if (e.key === "m" || e.key === "M") {
        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
          sfx.toggleMute();
        }
      }
    });
  }
}
