import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import bgVideo from '../../assets/background.mp4'

const FADE_S = 1.8

export default function AuthLayout() {
  const v1 = useRef(null)
  const v2 = useRef(null)
  const activeRef = useRef(1)
  const crossfading = useRef(false)

  function handleCanPlay(e) {
    e.target.playbackRate = 0.55
  }

  function handleTimeUpdate() {
    const primary = activeRef.current === 1 ? v1.current : v2.current
    const secondary = activeRef.current === 1 ? v2.current : v1.current
    if (!primary?.duration || crossfading.current) return

    const remaining = primary.duration - primary.currentTime
    if (remaining < FADE_S + 0.3) {
      crossfading.current = true
      secondary.currentTime = 0
      secondary.playbackRate = 0.55
      secondary.play()
      primary.style.opacity = '0'
      secondary.style.opacity = '1'

      setTimeout(() => {
        primary.pause()
        primary.currentTime = 0
        activeRef.current = activeRef.current === 1 ? 2 : 1
        crossfading.current = false
      }, (FADE_S + 0.5) * 1000)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <video
        ref={v1}
        autoPlay
        muted
        playsInline
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, opacity: 1, transition: `opacity ${FADE_S}s ease-in-out` }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <video
        ref={v2}
        muted
        playsInline
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, opacity: 0, transition: `opacity ${FADE_S}s ease-in-out` }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0" style={{ background: 'rgba(20,10,50,0.12)', zIndex: 1 }} />

      <div style={{ zIndex: 2, width: '100%', maxWidth: '28rem' }}>
        <Outlet />
      </div>
    </div>
  )
}
