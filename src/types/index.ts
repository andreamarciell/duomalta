// User and Session types
export interface User {
  id: string
  username: string
  email?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  xp: number
  streak: number
  dailyGoal: {
    type: 'minutes' | 'xp'
    target: number
    current: number
  }
  preferences: {
    language: 'it' | 'en'
    theme: 'light' | 'dark' | 'auto'
    audioEnabled: boolean
    ttsEnabled: boolean
    sttEnabled: boolean
  }
  createdAt: Date
  lastActive: Date
}

export interface Session {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

// Content types
export interface Unit {
  id: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
  isUnlocked: boolean
  requiredLevel?: number
}

export interface Lesson {
  id: string
  title: string
  description?: string
  order: number
  items: ExerciseItem[]
  estimatedDuration: number // in minutes
  isCompleted: boolean
  bestScore?: number
  attempts: number
}

export interface ExerciseItem {
  id: string
  type: ExerciseType
  prompt: string
  audio?: string
  image?: string
  choices?: string[]
  answer: string | string[]
  accept?: string[] // alternative acceptable answers
  explanation?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  tags: string[]
  metadata?: Record<string, any>
}

export type ExerciseType = 
  | 'multipleChoice'
  | 'matchPairs'
  | 'typeWhatYouHear'
  | 'speakThePhrase'
  | 'fillTheGap'
  | 'orderTheTokens'
  | 'rootPatternBuilder'
  | 'listeningDiscrimination'

// Exercise specific types
export interface MultipleChoiceItem extends ExerciseItem {
  type: 'multipleChoice'
  choices: string[]
  answer: string
  isMultiple?: boolean
}

export interface MatchPairsItem extends ExerciseItem {
  type: 'matchPairs'
  pairs: [string, string][]
  answer: string[]
}

export interface TypeWhatYouHearItem extends ExerciseItem {
  type: 'typeWhatYouHear'
  audio: string
  accept: string[]
}

export interface FillTheGapItem extends ExerciseItem {
  type: 'fillTheGap'
  text: string
  gap: string
  accept: string[]
}

export interface OrderTheTokensItem extends ExerciseItem {
  type: 'orderTheTokens'
  tokens: string[]
  accept: string[]
}

// SRS types
export interface SRSItem {
  id: string
  itemId: string
  lessonId: string
  unitId: string
  quality: number // 0-5
  easiness: number
  interval: number
  repetitions: number
  dueDate: Date
  lastReview: Date
  nextReview: Date
  attempts: SRSAttempt[]
}

export interface SRSAttempt {
  id: string
  timestamp: Date
  quality: number
  responseTime: number
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string
}

// Exercise session types
export interface ExerciseSession {
  id: string
  lessonId: string
  startTime: Date
  endTime?: Date
  currentItemIndex: number
  items: ExerciseItem[]
  results: ExerciseResult[]
  score: number
  isCompleted: boolean
}

export interface ExerciseResult {
  itemId: string
  userAnswer: string
  isCorrect: boolean
  responseTime: number
  quality?: number
  feedback?: string
  timestamp: Date
}

// Progress and analytics
export interface Progress {
  userId: string
  unitId: string
  lessonId: string
  completedAt: Date
  score: number
  timeSpent: number
  mistakes: number
  streak: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'achievement' | 'milestone' | 'special'
  unlockedAt?: Date
  requirements: BadgeRequirement[]
}

export interface BadgeRequirement {
  type: 'xp' | 'streak' | 'lessons' | 'accuracy' | 'custom'
  value: number
  description: string
}

// Maltese specific types
export interface MalteseWord {
  maltese: string
  english: string
  italian?: string
  pronunciation: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction'
  gender?: 'masculine' | 'feminine'
  number?: 'singular' | 'plural'
  root?: string
  pattern?: string
  examples?: string[]
}

export interface GrammarRule {
  id: string
  title: string
  description: string
  examples: string[]
  exercises: string[] // exercise item IDs
  difficulty: 1 | 2 | 3 | 4 | 5
  category: 'phonetics' | 'morphology' | 'syntax' | 'semantics'
}

// UI and theme types
export interface UIState {
  theme: 'light' | 'dark' | 'auto'
  sidebarOpen: boolean
  notifications: Notification[]
  modals: ModalState[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

export interface ModalState {
  id: string
  isOpen: boolean
  props?: Record<string, any>
}

// API and data types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Speech and audio types
export interface SpeechOptions {
  text: string
  language: 'mt' | 'en' | 'it'
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
}

export interface RecognitionOptions {
  language: 'mt' | 'en' | 'it'
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}
