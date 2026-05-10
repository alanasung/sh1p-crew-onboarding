'use client'

import { PirateScroll, ScrollButton } from '@/components/pirate-scroll'

interface CohortScreenProps {
  onComplete: () => void
}

export function CohortScreen({ onComplete }: CohortScreenProps) {
  return (
    <PirateScroll 
      scenes={[
        <div key="cohort" className="space-y-8 text-center">
          <div className="text-6xl mb-4">+</div>
          <h2 className="font-serif text-3xl text-navy">
            {"Think you've got what it takes?"}
          </h2>
          <p className="font-mono text-navy/80 leading-relaxed">
            Apply to be in the next SH1P cohort and join the ranks of the best builders on earth.
          </p>
          
          <div className="flex flex-col gap-4 mt-8">
            <a
              href="https://sh1p.co/apply"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-navy text-gold font-mono font-bold text-lg rounded-lg 
                border-2 border-gold/30 transition-all duration-300 
                hover:scale-[1.02] active:scale-[0.98] hover:bg-navy/90 inline-block"
            >
              Apply Here &rarr;
            </a>
            
            <ScrollButton onClick={onComplete} variant="outline">
              Back to Dashboard
            </ScrollButton>
          </div>
        </div>
      ]}
      onBack={onComplete}
    />
  )
}
