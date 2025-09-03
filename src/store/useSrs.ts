import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SRSItem, ExerciseSession, ExerciseResult, Unit, Lesson } from '@/types';
import { 
  createSRSItem, 
  updateSRSItem, 
  generateDailyQueue, 
  calculateSRSStats 
} from '@/lib/srs/schedule';

interface SRSState {
  // SRS items
  srsItems: SRSItem[];
  dailyQueue: SRSItem[];
  
  // Sessioni di esercizi
  currentSession: ExerciseSession | null;
  completedSessions: ExerciseSession[];
  
  // Progresso
  completedLessons: string[];
  completedUnits: string[];
  
  // Statistiche
  stats: {
    totalItems: number;
    dueItems: number;
    totalAttempts: number;
    avgQuality: number;
    retentionRate: number;
    nextReview: number | null;
  };
  
  // Actions
  addSRSItem: (itemId: string, lessonId: string, unitId: string) => void;
  updateSRSItem: (itemId: string, quality: number, userAnswer: string, correctAnswer: string, responseTime: number) => void;
  generateDailyQueue: () => void;
  
  // Sessioni
  startSession: (lessonId: string, items: any[]) => void;
  completeSession: () => void;
  addExerciseResult: (result: ExerciseResult) => void;
  
  // Progresso
  markLessonCompleted: (lessonId: string) => void;
  markUnitCompleted: (unitId: string) => void;
  
  // Statistiche
  updateStats: () => void;
  
  // Reset
  resetProgress: () => void;
  resetSRS: () => void;
}

export const useSRSStore = create<SRSState>()(
  persist(
    (set, get) => ({
      srsItems: [],
      dailyQueue: [],
      currentSession: null,
      completedSessions: [],
      completedLessons: [],
      completedUnits: [],
      stats: {
        totalItems: 0,
        dueItems: 0,
        totalAttempts: 0,
        avgQuality: 0,
        retentionRate: 0,
        nextReview: null,
      },

      addSRSItem: (itemId: string, lessonId: string, unitId: string) => {
        const existingItem = get().srsItems.find(item => item.itemId === itemId);
        if (!existingItem) {
          const newItem = createSRSItem(itemId, lessonId, unitId);
          set(state => ({
            srsItems: [...state.srsItems, newItem],
          }));
        }
      },

      updateSRSItem: (itemId: string, quality: number, userAnswer: string, correctAnswer: string, responseTime: number) => {
        set(state => {
          const itemIndex = state.srsItems.findIndex(item => item.itemId === itemId);
          if (itemIndex !== -1) {
            const updatedItem = updateSRSItem(
              state.srsItems[itemIndex],
              quality,
              userAnswer,
              correctAnswer,
              responseTime
            );
            
            const newSrsItems = [...state.srsItems];
            newSrsItems[itemIndex] = updatedItem;
            
            return { srsItems: newSrsItems };
          }
          return state;
        });
        
        // Aggiorna le statistiche
        get().updateStats();
      },

      generateDailyQueue: () => {
        const { srsItems } = get();
        const dailyQueue = generateDailyQueue(srsItems, 20);
        set({ dailyQueue });
      },

      startSession: (lessonId: string, items: any[]) => {
        const session: ExerciseSession = {
          id: crypto.randomUUID(),
          lessonId,
          startTime: new Date(),
          currentItemIndex: 0,
          items,
          results: [],
          score: 0,
          isCompleted: false,
        };
        
        set({ currentSession: session });
      },

      completeSession: () => {
        const { currentSession } = get();
        if (currentSession) {
          const completedSession = {
            ...currentSession,
            endTime: new Date(),
            isCompleted: true,
          };
          
          set(state => ({
            completedSessions: [...state.completedSessions, completedSession],
            currentSession: null,
          }));
        }
      },

      addExerciseResult: (result: ExerciseResult) => {
        const { currentSession } = get();
        if (currentSession) {
          set(state => ({
            currentSession: {
              ...state.currentSession!,
              results: [...state.currentSession!.results, result],
              currentItemIndex: state.currentSession!.currentItemIndex + 1,
              score: state.currentSession!.score + (result.isCorrect ? 10 : 0),
            },
          }));
        }
      },

      markLessonCompleted: (lessonId: string) => {
        set(state => ({
          completedLessons: [...new Set([...state.completedLessons, lessonId])],
        }));
      },

      markUnitCompleted: (unitId: string) => {
        set(state => ({
          completedUnits: [...new Set([...state.completedUnits, unitId])],
        }));
      },

      updateStats: () => {
        const { srsItems } = get();
        const stats = calculateSRSStats(srsItems);
        set({ stats });
      },

      resetProgress: () => {
        set({
          completedLessons: [],
          completedUnits: [],
          completedSessions: [],
          currentSession: null,
        });
      },

      resetSRS: () => {
        set({
          srsItems: [],
          dailyQueue: [],
          stats: {
            totalItems: 0,
            dueItems: 0,
            totalAttempts: 0,
            avgQuality: 0,
            retentionRate: 0,
            nextReview: null,
          },
        });
      },
    }),
    {
      name: 'kellu-srs-storage',
      partialize: (state) => ({
        srsItems: state.srsItems,
        completedLessons: state.completedLessons,
        completedUnits: state.completedUnits,
        completedSessions: state.completedSessions,
      }),
    }
  )
);

// Hook per accedere facilmente ai dati SRS
export const useSRSItems = () => useSRSStore((state) => state.srsItems);
export const useDailyQueue = () => useSRSStore((state) => state.dailyQueue);
export const useCurrentSession = () => useSRSStore((state) => state.currentSession);
export const useCompletedLessons = () => useSRSStore((state) => state.completedLessons);
export const useCompletedUnits = () => useSRSStore((state) => state.completedUnits);
export const useSRSStats = () => useSRSStore((state) => state.stats);

// Hook per le azioni SRS
export const useSRSActions = () => useSRSStore((state) => ({
  addSRSItem: state.addSRSItem,
  updateSRSItem: state.updateSRSItem,
  generateDailyQueue: state.generateDailyQueue,
  startSession: state.startSession,
  completeSession: state.completeSession,
  addExerciseResult: state.addExerciseResult,
  markLessonCompleted: state.markLessonCompleted,
  markUnitCompleted: state.markUnitCompleted,
  updateStats: state.updateStats,
  resetProgress: state.resetProgress,
  resetSRS: state.resetSRS,
}));

// Hook per verificare se una lezione è completata
export const useIsLessonCompleted = (lessonId: string) => 
  useSRSStore((state) => state.completedLessons.includes(lessonId));

// Hook per verificare se un'unità è completata
export const useIsUnitCompleted = (unitId: string) => 
  useSRSStore((state) => state.completedUnits.includes(unitId));

// Hook per ottenere il progresso di un'unità
export const useUnitProgress = (unit: Unit) => {
  const completedLessons = useCompletedLessons();
  const totalLessons = unit.lessons.length;
  const completedCount = unit.lessons.filter(lesson => 
    completedLessons.includes(lesson.id)
  ).length;
  
  return {
    completed: completedCount,
    total: totalLessons,
    percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
  };
};

// Hook per ottenere il progresso di una lezione
export const useLessonProgress = (lesson: Lesson) => {
  const currentSession = useCurrentSession();
  const isCompleted = useIsLessonCompleted(lesson.id);
  
  return {
    isCompleted,
    isInProgress: currentSession?.lessonId === lesson.id,
    currentItem: currentSession?.currentItemIndex || 0,
    totalItems: lesson.items.length,
    progress: currentSession?.lessonId === lesson.id 
      ? Math.round((currentSession.currentItemIndex / lesson.items.length) * 100)
      : (isCompleted ? 100 : 0),
  };
};
