import { useCallback, useEffect, useRef } from 'react'

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export default function TurnstileWidget({ onToken }) {
  const containerRef = useRef(null)

  const render = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return
    return window.turnstile.render(containerRef.current, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      callback: onToken,
      'expired-callback': () => onToken(null),
      'error-callback': () => onToken(null),
    })
  }, [onToken])

  useEffect(() => {
    let widgetId
    if (window.turnstile) {
      widgetId = render()
    } else {
      const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)
      const script = existing || document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => { widgetId = render() }
      if (!existing) document.head.appendChild(script)
    }
    return () => {
      if (widgetId !== undefined) window.turnstile?.remove(widgetId)
    }
  }, [render])

  return <div ref={containerRef} className="min-h-[65px]" aria-label="Verifikasi keamanan" />
}
