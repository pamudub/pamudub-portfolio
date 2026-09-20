// ── เพลงพื้นหลัง (singleton ระดับแอป) ──
// เก็บอินสแตนซ์ Audio ไว้ที่ module เดียว เพื่อให้ปุ่มเปิด/ปิดเพลง
// (P3Menu) ควบคุมตัวเดียวกับที่ BackgroundMusic เล่น และจำสถานะไว้ใน localStorage
import { useSyncExternalStore, useCallback } from 'react'
import bgmSrc from '../song/Color Your Night.mp3'

let audio = null
let muted = (() => {
  try { return localStorage.getItem('p3bgm-muted') === '1' } catch { return false }
})()
const listeners = new Set()

function ensure() {
  if (!audio) {
    audio = new Audio(bgmSrc)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.12
    audio.muted = muted
  }
  return audio
}

export function isBgmMuted() { return muted }

export function toggleBgmMuted() {
  muted = !muted
  try { localStorage.setItem('p3bgm-muted', muted ? '1' : '0') } catch { /* ignore */ }
  ensure().muted = muted
  listeners.forEach((fn) => fn(muted))
  return muted
}

export function onBgmChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function tryStartBgm() {
  ensure().play().catch(() => { /* รอ interaction ถัดไป */ })
}

// ── React hook สำหรับปุ่ม MUSIC ON/OFF ──
// sync กับสถานะ muted ของ singleton (useSyncExternalStore = re-render ถูกต้องทุกครั้ง)
export function useBgmMuted() {
  const isMuted = useSyncExternalStore(
    (notify) => onBgmChange(notify),
    () => muted,
  )
  const toggle = useCallback(() => { toggleBgmMuted() }, [])
  return [isMuted, toggle]
}
