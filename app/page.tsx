'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { Screen, Role, UserData, AppState, DoubloonEvent, EngagementTask } from '@/lib/types'
import { initialAppState } from '@/lib/types'
import { DoubloonCounter, useFlyingCoins } from '@/components/doubloon-counter'
import { ProgressBar } from '@/components/progress-bar'
import { IntroScreen } from '@/components/screens/intro-screen'
import { WheelScreen } from '@/components/screens/wheel-screen'
import { SignupScreen } from '@/components/screens/signup-screen'
import { RoleSelectScreen } from '@/components/screens/role-select-screen'
import { GrowthScreen } from '@/components/screens/growth-screen'
import { VentureScreen } from '@/components/screens/venture-screen'
import { CohortScreen } from '@/components/screens/cohort-screen'
import { DashboardScreen } from '@/components/screens/dashboard-screen'

const STORAGE_KEY = 'bounty_state_v1'

function loadState(): AppState | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Restore Date objects
      if (parsed.doubloonHistory) {
        parsed.doubloonHistory = parsed.doubloonHistory.map((e: DoubloonEvent) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }))
      }
      return parsed
    }
  } catch {
    // Ignore
  }
  return null
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore
  }
}

export default function BountyApp() {
  const [state, setState] = useState<AppState>(initialAppState)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [roleQueue, setRoleQueue] = useState<Role[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { triggerCoins, CoinRenderer } = useFlyingCoins()

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setState(saved)
      // Restore role queue from selected but not completed roles
      const remainingRoles = saved.selectedRoles.filter(
        r => !saved.completedRoles.includes(r)
      )
      setRoleQueue(remainingRoles)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (isLoaded) {
      saveState(state)
    }
  }, [state, isLoaded])

  const setScreen = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }))
  }, [])

  const handleSignup = useCallback((userData: UserData) => {
    setState(prev => ({ ...prev, userData, screen: 'roleSelect' }))
  }, [])

  const handleRoleSelect = useCallback((roles: Role[]) => {
    setState(prev => ({ ...prev, selectedRoles: roles }))
  }, [])

  const handleClaimDoubloons = useCallback((clickEvent?: React.MouseEvent) => {
    const roleOrder: Role[] = ['growth', 'venture', 'cohort']
    const sortedRoles = state.selectedRoles.sort(
      (a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b)
    )
    
    setState(prev => ({
      ...prev,
      doubloons: prev.doubloons + 10,
      doubloonHistory: [
        ...prev.doubloonHistory,
        {
          id: crypto.randomUUID(),
          amount: 10,
          reason: 'Joined the crew',
          timestamp: new Date(),
        },
      ],
    }))

    // Trigger flying coins from click position
    if (clickEvent) {
      triggerCoins(3, clickEvent.clientX, clickEvent.clientY)
    }
    
    setShowCoinAnimation(true)
    setRoleQueue(sortedRoles.slice(1))
    
    // Navigate to first role
    if (sortedRoles.length > 0) {
      setScreen(sortedRoles[0])
    } else {
      setScreen('dashboard')
    }
  }, [state.selectedRoles, setScreen, triggerCoins])

  const earnDoubloons = useCallback((amount: number, reason: string, clickX?: number, clickY?: number) => {
    const newEvent: DoubloonEvent = {
      id: crypto.randomUUID(),
      amount,
      reason,
      timestamp: new Date(),
    }
    setState(prev => ({
      ...prev,
      doubloons: prev.doubloons + amount,
      doubloonHistory: [...prev.doubloonHistory, newEvent],
    }))
    
    // Trigger flying coins if position provided
    if (clickX !== undefined && clickY !== undefined) {
      triggerCoins(Math.min(amount, 5), clickX, clickY)
    }
  }, [triggerCoins])

  const completeRoleOnboarding = useCallback((role: Role) => {
    setState(prev => ({
      ...prev,
      completedRoles: [...prev.completedRoles, role],
    }))
    
    // Check if there are more roles in queue (excluding current role)
    const remaining = roleQueue.filter(r => r !== role)
    if (remaining.length > 0) {
      const nextRole = remaining[0]
      setRoleQueue(remaining.slice(1))
      setScreen(nextRole)
    } else {
      setScreen('dashboard')
    }
  }, [roleQueue, setScreen])

  const handleAddRole = useCallback((role: Role) => {
    setState(prev => ({
      ...prev,
      selectedRoles: [...prev.selectedRoles, role],
    }))
    setScreen(role)
  }, [setScreen])

  const updateGrowthPosts = useCallback((posts: string[]) => {
    setState(prev => ({ ...prev, growthPosts: posts }))
  }, [])

  const updateVenturePosts = useCallback((posts: string[]) => {
    setState(prev => ({ ...prev, venturePosts: posts }))
  }, [])

  const getAvailableRoles = useCallback((): Role[] => {
    return (['growth', 'venture', 'cohort'] as Role[]).filter(
      role => !state.selectedRoles.includes(role) && !state.completedRoles.includes(role)
    )
  }, [state.selectedRoles, state.completedRoles])

  const handleCohortApply = useCallback(() => {
    setState(prev => ({ ...prev, cohortApplied: true }))
  }, [])

  const completeEngagementTask = useCallback((taskId: string) => {
    const task = state.engagementTasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    setState(prev => ({
      ...prev,
      engagementTasks: prev.engagementTasks.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      ),
      doubloons: prev.doubloons + task.doubloonValue,
      doubloonHistory: [
        ...prev.doubloonHistory,
        {
          id: crypto.randomUUID(),
          amount: task.doubloonValue,
          reason: task.title,
          timestamp: new Date(),
        },
      ],
    }))
  }, [state.engagementTasks])

  const handleUpdateUser = useCallback((userData: UserData) => {
    setState(prev => ({ ...prev, userData }))
  }, [])

  const resetState = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setState(initialAppState)
    setRoleQueue([])
  }, [])

  // Calculate role queue info
  const currentRoleIndex = state.selectedRoles.length > 0 
    ? state.selectedRoles.findIndex(r => r === state.screen) + 1
    : 0
  const totalRoles = state.selectedRoles.length

  // Render current screen
  const renderScreen = () => {
    switch (state.screen) {
      case 'intro':
        return <IntroScreen onComplete={() => setScreen('wheel')} />
      
      case 'wheel':
        return <WheelScreen onContinue={() => setScreen('signup')} />
      
      case 'signup':
        return (
          <SignupScreen
            initialData={state.userData}
            onSubmit={handleSignup}
          />
        )
      
      case 'roleSelect':
        return (
          <RoleSelectScreen
            selectedRoles={state.selectedRoles}
            onSelect={handleRoleSelect}
            onClaim={handleClaimDoubloons}
          />
        )
      
      case 'growth':
        return (
          <GrowthScreen
            posts={state.growthPosts}
            onUpdatePosts={updateGrowthPosts}
            onEarnDoubloons={earnDoubloons}
            onComplete={() => completeRoleOnboarding('growth')}
            currentRoleIndex={currentRoleIndex}
            totalRoles={totalRoles}
          />
        )
      
      case 'venture':
        return (
          <VentureScreen
            posts={state.venturePosts}
            onUpdatePosts={updateVenturePosts}
            onEarnDoubloons={earnDoubloons}
            onComplete={() => completeRoleOnboarding('venture')}
            currentRoleIndex={currentRoleIndex}
            totalRoles={totalRoles}
          />
        )
      
      case 'cohort':
        return (
          <CohortScreen
            onComplete={() => completeRoleOnboarding('cohort')}
            onEarnDoubloons={earnDoubloons}
            cohortApplied={state.cohortApplied}
            onCohortApply={handleCohortApply}
            currentRoleIndex={currentRoleIndex}
            totalRoles={totalRoles}
          />
        )
      
      case 'dashboard':
        return (
          <DashboardScreen
            userData={state.userData}
            selectedRoles={state.selectedRoles}
            completedRoles={state.completedRoles}
            doubloons={state.doubloons}
            doubloonHistory={state.doubloonHistory}
            growthPosts={state.growthPosts}
            venturePosts={state.venturePosts}
            engagementTasks={state.engagementTasks}
            onAddRole={handleAddRole}
            onNavigateToRole={(role) => setScreen(role)}
            onCompleteEngagementTask={completeEngagementTask}
            onUpdateUser={handleUpdateUser}
            onResetState={resetState}
            onEarnDoubloons={earnDoubloons}
          />
        )
      
      default:
        return <IntroScreen onComplete={() => setScreen('wheel')} />
    }
  }

  // Don't render until we've loaded state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="font-mono text-gold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <ProgressBar 
        currentScreen={state.screen} 
        completedRoles={state.completedRoles}
        selectedRoles={state.selectedRoles}
      />
      
      {state.screen !== 'intro' && state.screen !== 'wheel' && (
        <DoubloonCounter count={state.doubloons} showAnimation={showCoinAnimation} />
      )}
      
      {renderScreen()}
      <CoinRenderer />
    </div>
  )
}
