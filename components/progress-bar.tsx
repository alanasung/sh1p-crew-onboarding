'use client'

import type { Screen } from '@/lib/types'

const screenOrder: Screen[] = [
  'intro',
  'wheel', 
  'signup',
  'roleSelect',
  'growth',
  'venture',
  'cohort',
  'dashboard'
]

interface ProgressBarProps {
  currentScreen: Screen
}

export function ProgressBar({ currentScreen }: ProgressBarProps) {
  const currentIndex = screenOrder.indexOf(currentScreen)
  // Dashboard is 100%, intro is 0%
  const progress = currentScreen === 'dashboard' 
    ? 100 
    : Math.round((currentIndex / (screenOrder.length - 1)) * 100)

  if (currentScreen === 'intro') return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-navy/50">
      <div 
        className="h-full progress-gold transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
