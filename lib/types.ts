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
  email: string
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

export interface EngagementTask {
  id: string
  title: string
  doubloonValue: number
  completed: boolean
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
  cohortApplied: boolean
  engagementTasks: EngagementTask[]
}

export const initialUserData: UserData = {
  firstName: '',
  lastName: '',
  linkedIn: '',
  email: '',
  phone: '',
  nationality: '',
  residence: '',
}

export const initialEngagementTasks: EngagementTask[] = [
  { id: '1', title: "Like Krishna's launch post", doubloonValue: 1, completed: false },
  { id: '2', title: 'Repost SH1P Cohort 4 announcement', doubloonValue: 1, completed: false },
  { id: '3', title: 'Comment on the Bounty teaser', doubloonValue: 1, completed: false },
]

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
  cohortApplied: false,
  engagementTasks: initialEngagementTasks,
}
