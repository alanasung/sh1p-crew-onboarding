'use client'

import { useState, useCallback } from 'react'
import type { Screen, Role, UserData, AppState, DoubloonEvent } from '@/lib/types'
import { initialAppState } from '@/lib/types'
import { DoubloonCounter } from '@/components/doubloon-counter'
import { ProgressBar } from '@/components/progress-bar'
import { IntroScreen } from '@/components/screens/intro-screen'
import { WheelScreen } from '@/components/screens/wheel-screen'
import { SignupScreen } from '@/components/screens/signup-screen'
import { RoleSelectScreen } from '@/components/screens/role-select-screen'
import { GrowthScreen } from '@/components/screens/growth-screen'
import { VentureScreen } from '@/components/screens/venture-screen'
import { CohortScreen } from '@/components/screens/cohort-screen'
import { DashboardScreen } from '@/components/screens/dashboard-screen'

export default function BountyApp() {
  const [state, setState] = useState<AppState>(initialAppState)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [roleQueue, setRoleQueue] = useState<Role[]>([])

  const setScreen = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }))
  }, [])

  const handleSignup = useCallback((userData: UserData) => {
    setState(prev => ({ ...prev, userData, screen: 'roleSelect' }))
  }, [])

  const handleRoleSelect = useCallback((roles: Role[]) => {
    setState(prev => ({ ...prev, selectedRoles: roles }))
  }, [])

  const handleClaimDoubloons = useCallback(() => {
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
    
    setShowCoinAnimation(true)
    setRoleQueue(sortedRoles.slice(1))
    
    // Navigate to first role
    if (sortedRoles.length > 0) {
      setScreen(sortedRoles[0])
    } else {
      setScreen('dashboard')
    }
  }, [state.selectedRoles, setScreen])

  const earnDoubloons = useCallback((amount: number, reason: string) => {
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
  }, [])

  const completeRoleOnboarding = useCallback((role: Role) => {
    setState(prev => ({
      ...prev,
      completedRoles: [...prev.completedRoles, role],
    }))
    
    // Check if there are more roles in queue
    if (roleQueue.length > 0) {
      const nextRole = roleQueue[0]
      setRoleQueue(roleQueue.slice(1))
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
            onAddRole={handleAddRole}
            availableRoles={getAvailableRoles()}
          />
        )
      
      case 'venture':
        return (
          <VentureScreen
            posts={state.venturePosts}
            onUpdatePosts={updateVenturePosts}
            onEarnDoubloons={earnDoubloons}
            onComplete={() => completeRoleOnboarding('venture')}
            onAddRole={handleAddRole}
            availableRoles={getAvailableRoles()}
          />
        )
      
      case 'cohort':
        return (
          <CohortScreen
            onComplete={() => completeRoleOnboarding('cohort')}
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
            onAddRole={handleAddRole}
            onNavigateToRole={(role) => setScreen(role)}
          />
        )
      
      default:
        return <IntroScreen onComplete={() => setScreen('wheel')} />
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <ProgressBar currentScreen={state.screen} />
      
      {state.screen !== 'intro' && state.screen !== 'wheel' && (
        <DoubloonCounter count={state.doubloons} showAnimation={showCoinAnimation} />
      )}
      
      {renderScreen()}
    </div>
  )
}
