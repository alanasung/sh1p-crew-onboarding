'use client'

import { useEffect, useState } from 'react'

interface DoubloonCounterProps {
  count: number
  showAnimation?: boolean
}

export function DoubloonCounter({ count, showAnimation }: DoubloonCounterProps) {
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    if (showAnimation) {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 300)
      return () => clearTimeout(timer)
    }
  }, [count, showAnimation])

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-navy/80 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-2">
      <div className={`relative ${isPulsing ? 'animate-counter-pulse' : ''}`}>
        {/* Gold Doubloon SVG */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="drop-shadow-lg"
        >
          <defs>
            <radialGradient id="coinGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#e5b84a" />
              <stop offset="50%" stopColor="#c9922a" />
              <stop offset="100%" stopColor="#8b6914" />
            </radialGradient>
            <filter id="coinShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <circle cx="14" cy="14" r="13" fill="url(#coinGradient)" filter="url(#coinShadow)" stroke="#8b6914" strokeWidth="1" />
          <text
            x="14"
            y="18"
            textAnchor="middle"
            className="font-serif text-xs fill-navy font-bold"
          >
            $
          </text>
        </svg>
      </div>
      <span className="font-mono text-gold font-bold text-lg tabular-nums">
        {count}
      </span>
    </div>
  )
}

export function CoinAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 28 28"
        className="animate-coin-flip"
      >
        <defs>
          <radialGradient id="coinGradientAnim" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#e5b84a" />
            <stop offset="50%" stopColor="#c9922a" />
            <stop offset="100%" stopColor="#8b6914" />
          </radialGradient>
        </defs>
        <circle cx="14" cy="14" r="13" fill="url(#coinGradientAnim)" stroke="#8b6914" strokeWidth="1" />
        <text
          x="14"
          y="18"
          textAnchor="middle"
          className="font-serif text-xs fill-navy font-bold"
        >
          $
        </text>
      </svg>
    </div>
  )
}
