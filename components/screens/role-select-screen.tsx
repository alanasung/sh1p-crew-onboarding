'use client'

import { useState } from 'react'
import type { Role } from '@/lib/types'
import { CoinAnimation } from '@/components/doubloon-counter'
import { ding } from '@/lib/audio'

interface RoleSelectScreenProps {
  selectedRoles: Role[]
  onSelect: (roles: Role[]) => void
  onClaim: () => void
}

const roleInfo: { role: Role; icon: string; title: string; description: string }[] = [
  {
    role: 'growth',
    icon: '~',
    title: 'Growth',
    description: 'Grow the SH1P brand. Post. Engage. Represent.',
  },
  {
    role: 'venture',
    icon: '*',
    title: 'Venture Research',
    description: 'Scout the frontier. Post insights. Think like a VC.',
  },
  {
    role: 'cohort',
    icon: '+',
    title: 'Aspiring Cohort Member',
    description: 'Apply to the next SH1P cohort.',
  },
]

export function RoleSelectScreen({ selectedRoles, onSelect, onClaim }: RoleSelectScreenProps) {
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      onSelect(selectedRoles.filter(r => r !== role))
    } else {
      onSelect([...selectedRoles, role])
    }
  }

  const handleClaim = () => {
    if (selectedRoles.length === 0 || isAnimating) return
    setIsAnimating(true)
    setShowCoinAnimation(true)
    ding()
  }

  const handleAnimationComplete = () => {
    setShowCoinAnimation(false)
    setTimeout(() => {
      onClaim()
    }, 200)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-navy via-[#0d1e33] to-navy flex flex-col items-center justify-center p-4">
      {showCoinAnimation && <CoinAnimation onComplete={handleAnimationComplete} />}
      
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-5xl text-parchment mb-3">
          {"What's your role on the crew?"}
        </h2>
        <p className="font-mono text-gold text-sm">
          Pick as many as you want.
        </p>
      </div>

      {/* Role cards */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
        {roleInfo.map(({ role, icon, title, description }) => {
          const isSelected = selectedRoles.includes(role)
          return (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`flex-1 relative p-6 rounded-lg border-2 transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98] text-left
                ${isSelected 
                  ? 'border-gold bg-gold/10 glow-gold' 
                  : 'border-rope/30 bg-navy/50 hover:border-rope/60'
                }`}
            >
              {/* Check indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="text-navy">
                    <path
                      d="M2 7L5.5 10.5L12 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div className="font-mono text-3xl text-gold mb-3">{icon}</div>
              <h3 className="font-serif text-xl text-parchment mb-2">{title}</h3>
              <p className="font-mono text-sm text-parchment/70">{description}</p>
            </button>
          )
        })}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleClaim}
        disabled={selectedRoles.length === 0 || isAnimating}
        className={`mt-10 px-8 py-4 font-mono font-bold text-lg rounded-lg transition-all duration-300
          ${selectedRoles.length > 0 && !isAnimating
            ? 'bg-gold text-navy hover:bg-rope hover:scale-105 active:scale-95 shadow-lg shadow-gold/20 cursor-pointer'
            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          }`}
      >
        Claim 10 Doubloons &rarr;
      </button>
    </div>
  )
}
