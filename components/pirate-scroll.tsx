'use client'

import { useState, type ReactNode } from 'react'

interface PirateScrollProps {
  scenes: ReactNode[]
  onBack?: () => void
  showBackOnScene?: number
}

export function PirateScroll({ scenes, onBack, showBackOnScene = 1 }: PirateScrollProps) {
  const [currentScene, setCurrentScene] = useState(0)

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1)
    }
  }

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1)
    } else if (onBack) {
      onBack()
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-navy via-[#0d1e33] to-navy flex items-center justify-center p-4 overflow-hidden">
      {/* Parchment scroll */}
      <div className="relative w-full max-w-2xl">
        {/* Scroll top roll */}
        <div className="h-8 bg-gradient-to-b from-rope to-[#5c4a1f] rounded-t-lg shadow-lg relative">
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-b from-[#4a3d18] to-transparent" />
        </div>
        
        {/* Main scroll content */}
        <div 
          key={currentScene}
          className="parchment p-8 md:p-12 min-h-[400px] relative animate-scroll-unroll noise"
        >
          <div className="relative z-10">
            {scenes[currentScene]}
          </div>
        </div>

        {/* Scroll bottom roll */}
        <div className="h-8 bg-gradient-to-t from-rope to-[#5c4a1f] rounded-b-lg shadow-lg relative">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-t from-[#4a3d18] to-transparent" />
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScene ? 'bg-gold w-6' : 'bg-rope/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentScene >= showBackOnScene && onBack && (
        <button
          onClick={prevScene}
          className="fixed bottom-6 left-6 px-4 py-2 bg-navy/80 border border-rope/30 rounded-lg
            font-mono text-parchment text-sm hover:border-gold/50 transition-colors"
        >
          &larr; Back
        </button>
      )}

      {/* Scene indicator */}
      <div className="fixed bottom-6 right-6 font-mono text-parchment/50 text-sm">
        {currentScene + 1} / {scenes.length}
      </div>
    </div>
  )
}

// Button components for scroll scenes
export function ScrollButton({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  className = ''
}: { 
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  className?: string
}) {
  const variants = {
    primary: 'bg-navy text-gold border-gold/30 hover:bg-navy/90',
    secondary: 'bg-rope text-parchment border-rope hover:bg-rope/90',
    outline: 'bg-transparent text-navy border-navy/30 hover:border-navy/60',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 font-mono font-bold rounded-lg border-2 
        transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function NextButton({ onClick, children = 'Next' }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="mt-8 px-6 py-3 bg-navy text-gold font-mono font-bold rounded-lg border-2 border-gold/30
        transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-navy/90"
    >
      {children} &rarr;
    </button>
  )
}
