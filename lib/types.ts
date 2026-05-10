export type Screen = 
  | 'intro'
  | 'wheel'
  | 'signup'
  | 'roleSelect'
  | 'growth'
  | 'venture'
  | 'cohort'
  | 'dashboard'

export type Role = 'growth' | 'venture' | 'cohort'

export interface UserData {
  firstName: string
  lastName: string
  linkedIn: string
  gmail: string
  phone: string
  nationality: string
  residence: string
}

export interface DoubloonEvent {
  id: string
  amount: number
  reason: string
  timestamp: Date
}

export interface AppState {
  screen: Screen
  userData: UserData
  selectedRoles: Role[]
  completedRoles: Role[]
  doubloons: number
  doubloonHistory: DoubloonEvent[]
  growthPosts: string[]
  venturePosts: string[]
  engagementScreenshots: string[]
}

export const initialUserData: UserData = {
  firstName: '',
  lastName: '',
  linkedIn: '',
  gmail: '',
  phone: '',
  nationality: '',
  residence: '',
}

export const initialAppState: AppState = {
  screen: 'intro',
  userData: initialUserData,
  selectedRoles: [],
  completedRoles: [],
  doubloons: 0,
  doubloonHistory: [],
  growthPosts: ['', '', ''],
  venturePosts: ['', '', '', '', ''],
  engagementScreenshots: [],
}
