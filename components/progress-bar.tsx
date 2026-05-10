'use client'

import type { Screen, Role } from '@/lib/types'

interface ProgressBarProps {
  currentScreen: Screen
  completedRoles?: Role[]
  selectedRoles?: Role[]
}

// Progress calculation based on fixed step count
// intro=0, wheel=10, signup=25, roleSelect=40, each role onboarding = +15, dashboard = 100
function calculateProgress(
  screen: Screen,
  completedRoles: Role[] = [],
  selectedRoles: Role[] = []
): number {
  const baseProgress: Record<Screen, number> = {
    intro: 0,
    wheel: 10,
    signup: 25,
    roleSelect: 40,
    growth: 50,
    venture: 50,
    cohort: 50,
    dashboard: 100,
  }

  if (screen === 'dashboard') return 100
  if (screen === 'intro') return 0

  let progress = baseProgress[screen] || 0

  // Add progress for completed roles
  const rolesCount = Math.max(selectedRoles.length, 1)
  const progressPerRole = (100 - 40) / rolesCount // Remaining progress divided by roles
  
  progress += completedRoles.length * progressPerRole

  // If currently in a role screen, add partial progress
  if (['growth', 'venture', 'cohort'].includes(screen)) {
    // Currently working on this role - halfway through its allocation
    progress = 40 + (completedRoles.length + 0.5) * progressPerRole
  }

  return Math.min(Math.round(progress), 100)
}

export function ProgressBar({ currentScreen, completedRoles = [], selectedRoles = [] }: ProgressBarProps) {
  const progress = calculateProgress(currentScreen, completedRoles, selectedRoles)

  if (currentScreen === 'intro') return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-navy/50">
      <div 
        className="h-full progress-gold transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
