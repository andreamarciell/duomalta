import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  
  // XP e progresso
  addXP: (amount: number) => void;
  updateStreak: () => void;
  updateDailyGoal: (progress: number) => void;
  resetDailyGoal: () => void;
  
  // Preferenze
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  toggleTheme: () => void;
  setLanguage: (language: 'it' | 'en') => void;
}

// Utente di default per demo
const DEFAULT_USER: User = {
  id: 'demo-user',
  username: 'DemoUser',
  email: 'demo@kellu.app',
  level: 'beginner',
  xp: 0,
  streak: 0,
  dailyGoal: {
    type: 'minutes',
    target: 15,
    current: 0,
  },
  preferences: {
    language: 'it',
    theme: 'auto',
    audioEnabled: true,
    ttsEnabled: true,
    sttEnabled: true,
  },
  createdAt: new Date(),
  lastActive: new Date(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      isAuthenticated: true, // Demo mode
      isLoading: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      addXP: (amount: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              xp: currentUser.xp + amount,
            },
          });
        }
      },

      updateStreak: () => {
        const currentUser = get().user;
        if (currentUser) {
          const now = new Date();
          const lastActive = new Date(currentUser.lastActive);
          const daysDiff = Math.floor(
            (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
          );

          let newStreak = currentUser.streak;
          if (daysDiff === 1) {
            // Giorno consecutivo
            newStreak += 1;
          } else if (daysDiff > 1) {
            // Streak interrotta
            newStreak = 1;
          }

          set({
            user: {
              ...currentUser,
              streak: newStreak,
              lastActive: now,
            },
          });
        }
      },

      updateDailyGoal: (progress: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              dailyGoal: {
                ...currentUser.dailyGoal,
                current: Math.min(currentUser.dailyGoal.current + progress, currentUser.dailyGoal.target),
              },
            },
          });
        }
      },

      resetDailyGoal: () => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              dailyGoal: {
                ...currentUser.dailyGoal,
                current: 0,
              },
            },
          });
        }
      },

      updatePreferences: (preferences: Partial<User['preferences']>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences,
                ...preferences,
              },
            },
          });
        }
      },

      toggleTheme: () => {
        const currentUser = get().user;
        if (currentUser) {
          const currentTheme = currentUser.preferences.theme;
          let newTheme: 'light' | 'dark' | 'auto';
          
          if (currentTheme === 'light') newTheme = 'dark';
          else if (currentTheme === 'dark') newTheme = 'auto';
          else newTheme = 'light';

          set({
            user: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences,
                theme: newTheme,
              },
            },
          });
        }
      },

      setLanguage: (language: 'it' | 'en') => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences,
                language,
              },
            },
          });
        }
      },
    }),
    {
      name: 'kellu-user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook per accedere facilmente ai dati dell'utente
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserXP = () => useUserStore((state) => state.user?.xp || 0);
export const useUserStreak = () => useUserStore((state) => state.user?.streak || 0);
export const useDailyGoal = () => useUserStore((state) => state.user?.dailyGoal);
export const useUserPreferences = () => useUserStore((state) => state.user?.preferences);
export const useUserTheme = () => useUserStore((state) => state.user?.preferences.theme || 'auto');
export const useUserLanguage = () => useUserStore((state) => state.user?.preferences.language || 'it');
