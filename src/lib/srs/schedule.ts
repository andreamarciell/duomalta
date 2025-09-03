/**
 * Sistema SRS (Spaced Repetition) basato su SM-2
 * Gestisce il scheduling degli item per la ripetizione
 */

import type { SRSItem, SRSAttempt } from '@/types';

// Parametri SM-2
const SRS_PARAMS = {
  INITIAL_EASINESS: 2.5,
  MIN_EASINESS: 1.3,
  EASINESS_FACTOR: 0.1,
  QUALITY_WEIGHTS: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // 0-5 quality scores
  INTERVAL_MODIFIER: 1.0,
} as const;

/**
 * Calcola il prossimo intervallo per un item SRS
 * @param item - Item SRS corrente
 * @param quality - Qualità della risposta (0-5)
 * @returns Nuovo item SRS aggiornato
 */
export function calculateNextReview(item: SRSItem, quality: number): SRSItem {
  const now = new Date();
  const newAttempt: SRSAttempt = {
    id: crypto.randomUUID(),
    timestamp: now,
    quality,
    responseTime: 0, // TODO: implementare tracking del tempo
    isCorrect: quality >= 3,
    userAnswer: '', // TODO: implementare tracking della risposta
    correctAnswer: '', // TODO: implementare tracking della risposta corretta
  };

  // Aggiorna le statistiche
  const newAttempts = [...item.attempts, newAttempt];
  const newRepetitions = item.repetitions + 1;

  // Calcola il nuovo easiness factor
  let newEasiness = item.easiness;
  if (quality >= 3) {
    // Risposta corretta - aumenta easiness
    newEasiness = Math.max(
      SRS_PARAMS.MIN_EASINESS,
      item.easiness + SRS_PARAMS.EASINESS_FACTOR * (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
  } else {
    // Risposta sbagliata - diminuisce easiness
    newEasiness = Math.max(
      SRS_PARAMS.MIN_EASINESS,
      item.easiness + SRS_PARAMS.EASINESS_FACTOR * (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
  }

  // Calcola il nuovo intervallo
  let newInterval: number;
  if (quality < 3) {
    // Risposta sbagliata - reset a 1 giorno
    newInterval = 1;
  } else if (newRepetitions === 1) {
    // Prima ripetizione corretta
    newInterval = 6;
  } else if (newRepetitions === 2) {
    // Seconda ripetizione corretta
    newInterval = Math.round(item.interval * newEasiness);
  } else {
    // Ripetizioni successive
    newInterval = Math.round(item.interval * newEasiness);
  }

  // Calcola le nuove date
  const newDueDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
  const newNextReview = newDueDate;

  return {
    ...item,
    quality,
    easiness: newEasiness,
    interval: newInterval,
    repetitions: newRepetitions,
    dueDate: newDueDate,
    lastReview: now,
    nextReview: newNextReview,
    attempts: newAttempts,
  };
}

/**
 * Calcola la priorità di un item per la coda SRS
 * @param item - Item SRS
 * @returns Punteggio di priorità (più alto = più prioritario)
 */
export function calculatePriority(item: SRSItem): number {
  const now = new Date();
  const daysOverdue = Math.max(0, (now.getTime() - item.dueDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // Priorità base basata su quanto è in ritardo
  let priority = daysOverdue * 10;
  
  // Bonus per item difficili (bassa easiness)
  priority += (3 - item.easiness) * 5;
  
  // Bonus per item con poche ripetizioni
  priority += Math.max(0, 5 - item.repetitions) * 2;
  
  // Bonus per item con bassa qualità media
  const avgQuality = item.attempts.length > 0 
    ? item.attempts.reduce((sum, a) => sum + a.quality, 0) / item.attempts.length
    : 0;
  priority += Math.max(0, 3 - avgQuality) * 3;
  
  return priority;
}

/**
 * Filtra gli item che sono pronti per la revisione
 * @param items - Lista di item SRS
 * @returns Item pronti per la revisione
 */
export function getDueItems(items: SRSItem[]): SRSItem[] {
  const now = new Date();
  return items.filter(item => item.dueDate <= now);
}

/**
 * Ordina gli item per priorità SRS
 * @param items - Lista di item SRS
 * @returns Item ordinati per priorità
 */
export function sortByPriority(items: SRSItem[]): SRSItem[] {
  return [...items].sort((a, b) => calculatePriority(b) - calculatePriority(a));
}

/**
 * Genera la coda giornaliera SRS
 * @param items - Tutti gli item SRS
 * @param maxItems - Numero massimo di item per sessione
 * @returns Coda ordinata per priorità
 */
export function generateDailyQueue(items: SRSItem[], maxItems: number = 20): SRSItem[] {
  const dueItems = getDueItems(items);
  const sortedItems = sortByPriority(dueItems);
  
  return sortedItems.slice(0, maxItems);
}

/**
 * Calcola le statistiche SRS per un utente
 * @param items - Tutti gli item SRS dell'utente
 * @returns Statistiche aggregate
 */
export function calculateSRSStats(items: SRSItem[]) {
  const now = new Date();
  const dueItems = getDueItems(items);
  const totalItems = items.length;
  const totalAttempts = items.reduce((sum, item) => sum + item.attempts.length, 0);
  
  // Calcola la qualità media
  const allAttempts = items.flatMap(item => item.attempts);
  const avgQuality = allAttempts.length > 0 
    ? allAttempts.reduce((sum, attempt) => sum + attempt.quality, 0) / allAttempts.length
    : 0;
  
  // Calcola la retention rate (item con qualità >= 3)
  const correctAttempts = allAttempts.filter(attempt => attempt.quality >= 3).length;
  const retentionRate = allAttempts.length > 0 ? correctAttempts / allAttempts.length : 0;
  
  // Calcola la distribuzione degli intervalli
  const intervalDistribution = items.reduce((acc, item) => {
    const interval = item.interval;
    acc[interval] = (acc[interval] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return {
    totalItems,
    dueItems: dueItems.length,
    totalAttempts,
    avgQuality: Math.round(avgQuality * 100) / 100,
    retentionRate: Math.round(retentionRate * 100) / 100,
    intervalDistribution,
    nextReview: dueItems.length > 0 ? Math.min(...dueItems.map(item => item.dueDate.getTime())) : null,
  };
}

/**
 * Crea un nuovo item SRS
 * @param itemId - ID dell'item
 * @param lessonId - ID della lezione
 * @param unitId - ID dell'unità
 * @returns Nuovo item SRS
 */
export function createSRSItem(itemId: string, lessonId: string, unitId: string): SRSItem {
  const now = new Date();
  const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 giorno
  
  return {
    id: crypto.randomUUID(),
    itemId,
    lessonId,
    unitId,
    quality: 0,
    easiness: SRS_PARAMS.INITIAL_EASINESS,
    interval: 1,
    repetitions: 0,
    dueDate,
    lastReview: now,
    nextReview: dueDate,
    attempts: [],
  };
}

/**
 * Aggiorna un item SRS con una nuova risposta
 * @param item - Item SRS corrente
 * @param quality - Qualità della risposta (0-5)
 * @param userAnswer - Risposta dell'utente
 * @param correctAnswer - Risposta corretta
 * @param responseTime - Tempo di risposta in millisecondi
 * @returns Item SRS aggiornato
 */
export function updateSRSItem(
  item: SRSItem,
  quality: number,
  userAnswer: string,
  correctAnswer: string,
  responseTime: number
): SRSItem {
  const now = new Date();
  const newAttempt: SRSAttempt = {
    id: crypto.randomUUID(),
    timestamp: now,
    quality,
    responseTime,
    isCorrect: quality >= 3,
    userAnswer,
    correctAnswer,
  };

  // Aggiorna le statistiche
  const newAttempts = [...item.attempts, newAttempt];
  const newRepetitions = item.repetitions + 1;

  // Calcola il nuovo easiness factor
  let newEasiness = item.easiness;
  if (quality >= 3) {
    newEasiness = Math.max(
      SRS_PARAMS.MIN_EASINESS,
      item.easiness + SRS_PARAMS.EASINESS_FACTOR * (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
  } else {
    newEasiness = Math.max(
      SRS_PARAMS.MIN_EASINESS,
      item.easiness + SRS_PARAMS.EASINESS_FACTOR * (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
  }

  // Calcola il nuovo intervallo
  let newInterval: number;
  if (quality < 3) {
    newInterval = 1;
  } else if (newRepetitions === 1) {
    newInterval = 6;
  } else if (newRepetitions === 2) {
    newInterval = Math.round(item.interval * newEasiness);
  } else {
    newInterval = Math.round(item.interval * newEasiness);
  }

  // Calcola le nuove date
  const newDueDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    ...item,
    quality,
    easiness: newEasiness,
    interval: newInterval,
    repetitions: newRepetitions,
    dueDate: newDueDate,
    lastReview: now,
    nextReview: newDueDate,
    attempts: newAttempts,
  };
}
