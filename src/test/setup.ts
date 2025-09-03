import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Web Speech API
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(() => []),
  },
  writable: true,
})

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: class MockSpeechRecognition {
    start = vi.fn()
    stop = vi.fn()
    abort = vi.fn()
    addEventListener = vi.fn()
    removeEventListener = vi.fn()
  },
  writable: true,
})

// Mock IndexedDB
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
}

Object.defineProperty(window, 'indexedDB', {
  value: indexedDB,
  writable: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})
