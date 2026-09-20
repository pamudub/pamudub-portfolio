// ── Touch/mouse handler factory สำหรับหัวข้อเลือกเมนู (ใช้ร่วมทุกหน้า) ──
//
// ปัญหาเดิมบนมือถือ: browser จำลอง mouse event ตอนแตะ ทำให้ onMouseEnter + onClick
// ทำงานต่อกันในจังหวะเดียว → แตะปุ๊บ = เลือกแล้วเปิดหน้าทันที ไม่มีขั้น "ดูก่อน"
// (แถมแตะแล้วเห็นบล็อกสีฟ้า flash จาก tap highlight ของ browser)
//
// พฤติกรรมใหม่:
//   • เมาส์ (PC): เหมือนเดิม 100% — hover = เลือก, คลิก = เปิด
//   • จอสัมผัส: นิ้วแตะลง = เลือกทันที (ไฮไลต์+เสียง แบบเดียวกับ hover บน PC)
//     แตะครั้งแรกบนหัวข้อที่ยังไม่เลือก = แค่เลือก ไม่เปิด / แตะซ้ำ = เปิด
//   • ปัดเลื่อมือ (นิ้วขยับ > 12px) = ไม่นับเป็นการแตะ → scroll ทำงานปกติ
//
// เป็น plain function factory ไม่ใช่ React hook — เรียกใน JSX/map ได้อิสระ
// (gesture state เก็บระดับ module เพื่อรอดจาก re-render ระหว่าง gesture)

let gesture = null;            // gesture ปัจจุบัน { sx, sy, moved, wasActive }
let lastTouchEnd = 0;          // เวลาที่นิ้วยกล่าสุด — ใช้แยก click จากการแตะ vs เมาส์จริง
let lastTouchActivateAt = 0;   // กันเสียง hover ซ้ำจาก simulated mouseenter หลังแตะ

export function makeTouchSelectHandlers({ isActive, onActivate, onSelect, onTap } = {}) {
  return {
    // นิ้วแตะลง → เลือกทันที = effect แบบ hover บน PC
    onTouchStart: (e) => {
      if (e.touches?.length !== 1) { gesture = null; return; }
      const t = e.touches[0];
      gesture = { sx: t.clientX, sy: t.clientY, moved: false, wasActive: !!isActive };
      if (!isActive && onActivate) {
        lastTouchActivateAt = Date.now();
        onActivate();
      }
    },

    // นิ้วขยับเกิน 12px = กำลังปัด scroll → ทำเครื่องหมายว่าไม่ใช่การแตะ
    onTouchMove: (e) => {
      if (!gesture) return;
      const t = e.touches?.[0];
      if (!t) return;
      const dx = t.clientX - gesture.sx;
      const dy = t.clientY - gesture.sy;
      if (Math.sqrt(dx * dx + dy * dy) > 12) gesture.moved = true;
    },

    onTouchEnd: () => { lastTouchEnd = Date.now(); },
    onTouchCancel: () => {
      lastTouchEnd = Date.now();
      if (gesture) gesture.moved = true; // ยกเลิก gesture ที่ถูกขัดจังหวะ
    },

    // เมาส์ PC: hover = เลือก (บนจอสัมผัส browser จะยิง simulated mouseenter
    // ตามหลัง onTouchStart → เช็คช่วงเวลาแล้วข้าม ไม่งั้นเสียง hover ดังซ้ำ)
    onMouseEnter: () => {
      if (Date.now() - lastTouchActivateAt < 600) return;
      if (!isActive && onActivate) onActivate();
    },

    // คลิก:
    //  • เมาส์จริง (ไม่มี touch gesture ค้าง + ไม่ได้แตะภายใน ~700ms) → เปิดเหมือนเดิม
    //  • มาจากการแตะ → เปิดเฉพาะเมื่อหัวข้อถูกเลือกอยู่ก่อนแตะแล้ว (two-phase)
    onClick: (e) => {
      e.preventDefault(); // กัน href="#"/href="/" ของ <a> กระโดดหน้า
      const g = gesture;
      gesture = null;
      const fromTouch = !!g || Date.now() - lastTouchEnd < 700;
      if (!fromTouch) { onSelect?.(e); return; } // คลิกเมาส์บน PC
      if (!g || g.moved) return;   // เป็นการปัด scroll ไม่ใช่แตะ
      onTap?.(e);                  // แตะจริง (ทุก phase) — ใช้ทำ side effect เช่นเลื่อนจอ
      if (!g.wasActive) return;    // แตะครั้งแรก = เลือกอย่างเดียว ยังไม่เปิด
      onSelect?.(e);               // แตะซ้ำบนหัวข้อที่เลือกอยู่ = เปิด
    },

    // กันเมนู long-press ของ browser บัง effect ตอนกดค้าง
    onContextMenu: (e) => e.preventDefault(),
  };
}
