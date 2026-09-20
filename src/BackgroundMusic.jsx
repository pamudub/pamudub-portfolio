import { useEffect } from 'react'
import { tryStartBgm } from './bgm'

// เพลงพื้นหลังของทั้งเว็บ: เล่นวนลูปตลอดขณะเปิดหน้าไว้ (เบา ๆ ไม่ทับเสียงอื่น)
// อินสแตนซ์เพลงเก็บที่ src/bgm.js (shared กับปุ่ม MUSIC ON/OFF หน้าแรก)
// เบราว์เซอร์บล็อก autoplay จนกว่าผู้ใช้จะ interact ครั้งแรก จึงลองเล่นทันที
// แล้วลองใหม่อัตโนมัติเมื่อผู้ใช้คลิก/กดปุ่ม/เลื่อนหน้าจอ
export default function BackgroundMusic() {
  useEffect(() => {
    const unlock = () => tryStartBgm()
    unlock()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('wheel', unlock)
    window.addEventListener('touchend', unlock)

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('touchend', unlock)
      // ไม่ pause ตอน unmount — เพลงเล่นต่อข้ามหน้า (audio อยู่ที่ bgm.js)
    }
  }, [])

  return null
}
