'use client'

import { useState, useEffect } from 'react'

interface WheelScreenProps {
  onContinue: () => void
}

const welcomeMessages = [
  'Welcome to the SH1P Crew',
  'Earn Doubloons.',
  'Get real opportunities.',
  'Best team on earth.',
]

export function WheelScreen({ onContinue }: WheelScreenProps) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev < welcomeMessages.length) return prev + 1
        return prev
      })
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-navy via-[#0d1e33] to-navy flex flex-col items-center justify-center overflow-hidden">
      {/* Ship wheel */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className={`drop-shadow-2xl transition-all duration-1000 ${
            isHovering ? 'animate-spin-slower' : 'animate-spin-slow'
          }`}
        >
          <defs>
            <radialGradient id="wheelGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#8b6914" />
              <stop offset="50%" stopColor="#5c4a1f" />
              <stop offset="100%" stopColor="#3d3115" />
            </radialGradient>
            <filter id="woodNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="#c9922a" surfaceScale="1">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
            </filter>
          </defs>
          
          {/* Outer ring */}
          <circle cx="160" cy="160" r="150" fill="none" stroke="url(#wheelGradient)" strokeWidth="12" />
          
          {/* Inner ring */}
          <circle cx="160" cy="160" r="120" fill="none" stroke="url(#wheelGradient)" strokeWidth="8" />
          
          {/* Center hub */}
          <circle cx="160" cy="160" r="45" fill="url(#wheelGradient)" stroke="#3d3115" strokeWidth="3" />
          <circle cx="160" cy="160" r="30" fill="#3d3115" stroke="#5c4a1f" strokeWidth="2" />
          
          {/* 8 Spokes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const x1 = 160 + 45 * Math.cos(angle)
            const y1 = 160 + 45 * Math.sin(angle)
            const x2 = 160 + 150 * Math.cos(angle)
            const y2 = 160 + 150 * Math.sin(angle)
            
            return (
              <g key={i}>
                {/* Spoke */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#wheelGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Handle at end */}
                <circle
                  cx={160 + 155 * Math.cos(angle)}
                  cy={160 + 155 * Math.sin(angle)}
                  r="12"
                  fill="url(#wheelGradient)"
                  stroke="#3d3115"
                  strokeWidth="2"
                />
              </g>
            )
          })}
        </svg>

        {/* Center text - doesn't rotate */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 flex items-center justify-center">
            <span className="font-serif text-gold text-xl font-bold">SH1P</span>
          </div>
        </div>
      </div>

      {/* Welcome messages */}
      <div className="mt-12 h-40 flex flex-col items-center justify-start gap-2">
        {welcomeMessages.map((message, index) => (
          <p
            key={index}
            className={`font-serif text-xl md:text-2xl text-parchment text-center transition-all duration-500 ${
              index < visibleMessages
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {message}
          </p>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onContinue}
        className={`mt-8 px-8 py-4 bg-gold text-navy font-mono font-bold text-lg rounded-lg 
          hover:bg-rope transition-all duration-300 hover:scale-105 active:scale-95
          shadow-lg shadow-gold/20 ${
            visibleMessages >= welcomeMessages.length
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
      >
        Come Aboard
      </button>
    </div>
  )
}
