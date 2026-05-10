'use client'

import type { Role, DoubloonEvent, UserData } from '@/lib/types'

interface DashboardScreenProps {
  userData: UserData
  selectedRoles: Role[]
  completedRoles: Role[]
  doubloons: number
  doubloonHistory: DoubloonEvent[]
  growthPosts: string[]
  venturePosts: string[]
  onAddRole: (role: Role) => void
  onNavigateToRole: (role: Role) => void
}

const newsSources = [
  { name: 'TechCrunch', url: 'https://techcrunch.com' },
  { name: 'Crunchbase', url: 'https://news.crunchbase.com' },
  { name: 'Product Hunt', url: 'https://producthunt.com' },
  { name: 'The Information', url: 'https://theinformation.com' },
]

const roleLabels: Record<Role, { title: string; icon: string }> = {
  growth: { title: 'Growth', icon: '~' },
  venture: { title: 'Venture Research', icon: '*' },
  cohort: { title: 'Cohort Applicant', icon: '+' },
}

export function DashboardScreen({
  userData,
  selectedRoles,
  completedRoles,
  doubloons,
  doubloonHistory,
  growthPosts,
  venturePosts,
  onAddRole,
  onNavigateToRole,
}: DashboardScreenProps) {
  const validGrowthPosts = growthPosts.filter(p => p.trim()).length
  const validVenturePosts = venturePosts.filter(p => p.trim()).length
  
  const availableRoles = (['growth', 'venture', 'cohort'] as Role[]).filter(
    role => !selectedRoles.includes(role)
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-[#0d1e33] to-navy">
      {/* Header */}
      <header className="border-b border-border/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-2xl text-parchment">BOUNTY</h1>
            <span className="font-mono text-gold/60 text-sm">by SH1P</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-parchment">
              Welcome back, {userData.firstName}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRoles.map(role => (
                <span
                  key={role}
                  className="px-3 py-1 bg-gold/20 border border-gold/30 rounded-full 
                    font-mono text-xs text-gold"
                >
                  {roleLabels[role].icon} {roleLabels[role].title}
                </span>
              ))}
            </div>
          </div>
          
          {/* Doubloon summary */}
          <div className="flex items-center gap-3 px-5 py-3 bg-card rounded-lg border border-gold/20">
            <svg width="32" height="32" viewBox="0 0 28 28" className="shrink-0">
              <defs>
                <radialGradient id="dashCoinGrad" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#e5b84a" />
                  <stop offset="50%" stopColor="#c9922a" />
                  <stop offset="100%" stopColor="#8b6914" />
                </radialGradient>
              </defs>
              <circle cx="14" cy="14" r="13" fill="url(#dashCoinGrad)" stroke="#8b6914" strokeWidth="1" />
              <text x="14" y="18" textAnchor="middle" className="font-serif text-xs fill-navy font-bold">$</text>
            </svg>
            <div>
              <div className="font-mono text-2xl text-gold font-bold">{doubloons}</div>
              <div className="font-mono text-xs text-parchment/60">Doubloons</div>
            </div>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* My Roles */}
          <div className="bg-card rounded-lg border border-border/30 p-6">
            <h3 className="font-serif text-xl text-parchment mb-4">My Roles</h3>
            <div className="space-y-4">
              {selectedRoles.includes('growth') && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-parchment">~ Growth Team</span>
                    <span className="font-mono text-xs text-gold">
                      {validGrowthPosts}/3 posts
                    </span>
                  </div>
                  <div className="h-2 bg-navy rounded-full overflow-hidden">
                    <div 
                      className="h-full progress-gold transition-all duration-500"
                      style={{ width: `${Math.min((validGrowthPosts / 3) * 100, 100)}%` }}
                    />
                  </div>
                  {completedRoles.includes('growth') && (
                    <p className="mt-2 font-mono text-xs text-seafoam">Onboarding complete</p>
                  )}
                </div>
              )}
              
              {selectedRoles.includes('venture') && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-parchment">* Venture Research</span>
                    <span className="font-mono text-xs text-gold">
                      {validVenturePosts}/5 posts
                    </span>
                  </div>
                  <div className="h-2 bg-navy rounded-full overflow-hidden">
                    <div 
                      className="h-full progress-gold transition-all duration-500"
                      style={{ width: `${Math.min((validVenturePosts / 5) * 100, 100)}%` }}
                    />
                  </div>
                  {completedRoles.includes('venture') && (
                    <p className="mt-2 font-mono text-xs text-seafoam">Onboarding complete</p>
                  )}
                </div>
              )}
              
              {selectedRoles.includes('cohort') && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-parchment">+ Cohort Applicant</span>
                    <a 
                      href="https://sh1p.co/apply"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-seafoam hover:underline"
                    >
                      View application &rarr;
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Doubloon History */}
          <div className="bg-card rounded-lg border border-border/30 p-6">
            <h3 className="font-serif text-xl text-parchment mb-4">Doubloon History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {doubloonHistory.length === 0 ? (
                <p className="font-mono text-parchment/50 text-sm">No earnings yet</p>
              ) : (
                doubloonHistory.map(event => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <span className="font-mono text-sm text-parchment/80">{event.reason}</span>
                    <span className="font-mono text-sm text-gold">+{event.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resources */}
          {(selectedRoles.includes('growth') || selectedRoles.includes('venture')) && (
            <div className="bg-card rounded-lg border border-border/30 p-6">
              <h3 className="font-serif text-xl text-parchment mb-4">Resources</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-sm text-gold mb-2">News Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {newsSources.map(source => (
                      <a
                        key={source.name}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-secondary rounded-lg font-mono text-xs text-parchment
                          hover:bg-secondary/80 transition-colors border border-border/30"
                      >
                        {source.name}
                      </a>
                    ))}
                  </div>
                </div>
                <a
                  href="#graphics"
                  className="block px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg
                    font-mono text-sm text-gold hover:bg-gold/20 transition-colors text-center"
                >
                  Graphics Reservoir
                </a>
              </div>
            </div>
          )}

          {/* Engagement Inbox */}
          <div className="bg-card rounded-lg border border-border/30 p-6">
            <h3 className="font-serif text-xl text-parchment mb-4">Engagement Inbox</h3>
            <div className="p-8 border-2 border-dashed border-border/30 rounded-lg text-center">
              <p className="font-mono text-parchment/50 text-sm">
                {"You'll receive engagement tasks here. Check back soon."}
              </p>
            </div>
          </div>
        </div>

        {/* Add a Role */}
        {availableRoles.length > 0 && (
          <div className="bg-card rounded-lg border border-border/30 p-6">
            <h3 className="font-serif text-xl text-parchment mb-4">Add a Role</h3>
            <div className="flex flex-wrap gap-4">
              {availableRoles.map(role => (
                <button
                  key={role}
                  onClick={() => onAddRole(role)}
                  className="flex-1 min-w-[200px] p-4 border-2 border-rope/30 rounded-lg 
                    hover:border-gold transition-all duration-300 hover:scale-[1.02] text-left"
                >
                  <div className="font-mono text-xl text-gold mb-1">{roleLabels[role].icon}</div>
                  <h4 className="font-serif text-lg text-parchment">{roleLabels[role].title}</h4>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cohort Application - always visible */}
        {!selectedRoles.includes('cohort') && (
          <div className="bg-card rounded-lg border border-gold/30 p-6 text-center">
            <h3 className="font-serif text-xl text-parchment mb-2">Ready for the next level?</h3>
            <p className="font-mono text-parchment/70 text-sm mb-4">
              Apply to join the next SH1P cohort
            </p>
            <button
              onClick={() => onAddRole('cohort')}
              className="px-6 py-3 bg-gold text-navy font-mono font-bold rounded-lg
                hover:bg-rope transition-colors"
            >
              Apply Now
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
