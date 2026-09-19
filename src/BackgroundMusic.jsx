import { useEffect } from 'react'
import bgm from '../song/Color Your Night.mp3'

// เพลงพื้นหลังของทั้งเว็บ: เล่นวนลูปตลอดขณะเปิดหน้าไว้ (เบา ๆ ไม่ทับเสียงอื่น)
// หมายเหตุ: เบราว์เซอร์บล็อก autoplay จนกว่าผู้ใช้จะ interact ครั้งแรก
// จึงลองเล่นทันที แล้วลองใหม่อัตโนมัติเมื่อผู้ใช้คลิก/กดปุ่ม/เลื่อนหน้าจอ
export default function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio(bgm)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.12

    let cancelled = false

    const tryPlay = () => {
      if (cancelled) return
      audio.play().catch(() => {
        // autoplay ถูกบล็อก → รอ interaction แรกแล้วลองใหม่ (ผ่าน listener ด้านล่าง)
      })
    }

    tryPlay()
    const unlock = () => tryPlay()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('wheel', unlock)

    return () => {
      cancelled = true
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('wheel', unlock)
      audio.pause()
      audio.src = ''
    }
  }, [])

  return null
}
