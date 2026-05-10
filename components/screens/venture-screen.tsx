'use client'

import { useState } from 'react'
import { PirateScroll, NextButton, ScrollButton } from '@/components/pirate-scroll'
import { CoinAnimation } from '@/components/doubloon-counter'
import { ding } from '@/lib/audio'
import type { Role } from '@/lib/types'

interface VentureScreenProps {
  posts: string[]
  onUpdatePosts: (posts: string[]) => void
  onEarnDoubloons: (amount: number, reason: string) => void
  onComplete: () => void
  onAddRole: (role: Role) => void
  availableRoles: Role[]
}

export function VentureScreen({ 
  posts, 
  onUpdatePosts, 
  onEarnDoubloons, 
  onComplete,
  onAddRole,
  availableRoles
}: VentureScreenProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [coinsToShow, setCoinsToShow] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [screenshotFile, setScreenshotFile] = useState('')
  const [showHelper, setShowHelper] = useState(false)

  const validPosts = posts.filter(p => p.trim().length > 0)

  const handleVerify = async () => {
    if (validPosts.length < 5) return
    setIsVerifying(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsVerifying(false)
    setVerified(true)
    
    const earnPerPost = 5
    for (let i = 0; i < validPosts.length; i++) {
      setTimeout(() => {
        setCoinsToShow(i + 1)
        ding()
        onEarnDoubloons(earnPerPost, `Venture post #${i + 1}`)
      }, i * 500)
    }
  }

  const updatePost = (index: number, value: string) => {
    const newPosts = [...posts]
    newPosts[index] = value
    onUpdatePosts(newPosts)
  }

  const scenes = [
    // Scene 1: The Mission
    <div key="mission" className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">The Mission</h2>
      <p className="font-mono text-navy/80 leading-relaxed">
        {"Venture Research is different from Growth. You're not just amplifying SH1P — you're bringing your own POV."}
      </p>
      <p className="font-mono text-navy/80 leading-relaxed">
        Post <strong>original insights 5 days a week</strong> on LinkedIn.
      </p>
      <NextButton onClick={() => setSceneIndex(1)}>Accept Mission</NextButton>
    </div>,

    // Scene 2: How to Research
    <div key="research" className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">How to Research</h2>
      <p className="font-mono text-navy/80 text-sm leading-relaxed">
        Before you post: go to one of the sources in your dashboard (TechCrunch, Crunchbase, etc.). Find something dated within the <strong>last 24 hours</strong>.
      </p>
      <p className="font-mono text-navy/80 text-sm leading-relaxed">
        A funding round, product launch, or breakthrough in tech or research you believe will be <strong>globally influential</strong>.
      </p>
      <div className="p-4 bg-navy/10 rounded-lg border border-rope/30">
        <p className="font-mono text-navy/80 text-sm">
          <strong>Important:</strong> Stay away from politics, geopolitics, and current conflicts. {"You're representing a brand — no sides on divisive issues."}
        </p>
      </div>
      
      <button
        onClick={() => setShowHelper(true)}
        className="font-mono text-seafoam text-sm underline hover:no-underline"
      >
        Questions? Ask SH1P Helper
      </button>

      {showHelper && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="parchment p-8 rounded-lg max-w-md w-full text-center">
            <h3 className="font-serif text-2xl text-navy mb-4">SH1P Helper</h3>
            <p className="font-mono text-navy/80 text-sm mb-6">
              SH1P Helper coming soon — email <a href="mailto:ecosystem@sh1p.co" className="text-seafoam underline">ecosystem@sh1p.co</a>
            </p>
            <button
              onClick={() => setShowHelper(false)}
              className="px-6 py-2 bg-navy text-gold font-mono rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <NextButton onClick={() => setSceneIndex(2)}>Continue</NextButton>
    </div>,

    // Scene 3: Submit Posts
    <div key="posts" className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Submit Your Posts</h2>
      <p className="font-mono text-navy/80 text-sm">
        Drop your post URLs below. You need at least 5 to unlock your spot.
      </p>
      
      <div className="space-y-3">
        {posts.map((post, index) => (
          <input
            key={index}
            type="url"
            value={post}
            onChange={(e) => updatePost(index, e.target.value)}
            placeholder={`LinkedIn post URL #${index + 1}`}
            className="w-full px-4 py-3 bg-navy/5 border-2 border-rope/30 rounded-lg font-mono text-navy text-sm
              focus:outline-none focus:border-gold transition-colors placeholder:text-navy/40"
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <ScrollButton 
          onClick={handleVerify} 
          disabled={validPosts.length < 5 || isVerifying || verified}
        >
          {isVerifying ? 'Verifying...' : verified ? 'Verified!' : 'Verify Posts'}
        </ScrollButton>
        
        {verified && <span className="font-mono text-seafoam">+{validPosts.length * 5} Doubloons!</span>}
      </div>

      {coinsToShow > 0 && Array.from({ length: coinsToShow }).map((_, i) => (
        <CoinAnimation key={i} onComplete={() => {}} />
      ))}

      {verified && (
        <NextButton onClick={() => setSceneIndex(3)}>Continue</NextButton>
      )}
    </div>,

    // Scene 4: You're In
    <div key="success" className="space-y-6 text-center">
      <div className="text-6xl mb-4">*</div>
      <h2 className="font-serif text-3xl text-navy">{"You're In!"}</h2>
      <p className="font-mono text-navy/80">
        {"Congrats — you're part of the SH1P Venture Research Team."}
      </p>
      
      <div className="flex flex-col gap-3 mt-8">
        <a
          href="https://www.linkedin.com/share?mini=true&title=I%20just%20joined%20SH1P%20Venture%20Research!"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-navy text-gold font-mono font-bold rounded-lg border-2 border-gold/30
            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-navy/90 inline-block"
        >
          Make your acceptance post &rarr;
        </a>
        <a
          href="#graphics"
          className="px-6 py-3 bg-transparent text-navy font-mono font-bold rounded-lg border-2 border-navy/30
            transition-all duration-300 hover:border-navy/60 inline-block"
        >
          Grab graphics
        </a>
      </div>

      <div className="mt-6">
        <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-2">
          Submit screenshot verification
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshotFile(e.target.files?.[0]?.name || '')}
          className="w-full px-4 py-3 bg-navy/5 border-2 border-rope/30 rounded-lg font-mono text-navy text-sm
            file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-navy file:text-gold file:font-mono"
        />
        {screenshotFile && (
          <p className="mt-2 font-mono text-seafoam text-xs">Uploaded: {screenshotFile}</p>
        )}
      </div>
      
      <NextButton onClick={() => setSceneIndex(4)}>Continue</NextButton>
    </div>,

    // Scene 5: Join Another Team
    <div key="addRole" className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Join Another Team?</h2>
      
      {availableRoles.length > 0 ? (
        <>
          <p className="font-mono text-navy/80 text-sm">
            You can add more roles to your crew membership.
          </p>
          <div className="space-y-3">
            {availableRoles.includes('growth') && (
              <button
                onClick={() => onAddRole('growth')}
                className="w-full p-4 text-left border-2 border-rope/30 rounded-lg hover:border-gold transition-colors"
              >
                <div className="font-mono text-xl text-gold mb-1">~</div>
                <h3 className="font-serif text-lg text-navy">Growth</h3>
                <p className="font-mono text-xs text-navy/70">Grow the SH1P brand. Post. Engage.</p>
              </button>
            )}
            {availableRoles.includes('cohort') && (
              <button
                onClick={() => onAddRole('cohort')}
                className="w-full p-4 text-left border-2 border-rope/30 rounded-lg hover:border-gold transition-colors"
              >
                <div className="font-mono text-xl text-gold mb-1">+</div>
                <h3 className="font-serif text-lg text-navy">Aspiring Cohort Member</h3>
                <p className="font-mono text-xs text-navy/70">Apply to the next SH1P cohort.</p>
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="font-mono text-navy/80 text-sm">
          {"You've joined all available teams!"}
        </p>
      )}

      <ScrollButton onClick={onComplete} variant="primary">
        Go to Dashboard &rarr;
      </ScrollButton>
    </div>,
  ]

  return (
    <PirateScroll 
      scenes={[scenes[sceneIndex]]} 
      onBack={sceneIndex > 0 ? () => setSceneIndex(sceneIndex - 1) : undefined}
    />
  )
}
