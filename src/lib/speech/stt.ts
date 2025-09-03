/**
 * Adapter per il riconoscimento vocale (STT)
 * Supporta Web Speech Recognition API con fallback
 */

import type { RecognitionOptions } from '@/types';

// Configurazione predefinita
const DEFAULT_OPTIONS: Partial<RecognitionOptions> = {
  continuous: false,
  interimResults: false,
  maxAlternatives: 1,
};

export class STTService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-US';

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Controlla supporto per Web Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    } else {
      console.warn('Web Speech Recognition non supportata');
      this.isSupported = false;
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configurazione predefinita
    this.recognition.continuous = DEFAULT_OPTIONS.continuous;
    this.recognition.interimResults = DEFAULT_OPTIONS.interimResults;
    this.recognition.maxAlternatives = DEFAULT_OPTIONS.maxAlternatives;
  }

  /**
   * Avvia il riconoscimento vocale
   */
  start(options: RecognitionOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.recognition) {
        reject(new Error('STT non supportato'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Riconoscimento già in corso'));
        return;
      }

      try {
        // Configura le opzioni
        this.recognition.lang = options.language;
        this.recognition.continuous = options.continuous || DEFAULT_OPTIONS.continuous;
        this.recognition.interimResults = options.interimResults || DEFAULT_OPTIONS.interimResults;
        this.recognition.maxAlternatives = options.maxAlternatives || DEFAULT_OPTIONS.maxAlternatives;

        let finalTranscript = '';
        let interimTranscript = '';

        // Event listeners
        this.recognition.onstart = () => {
          console.log('Riconoscimento vocale iniziato');
          this.isListening = true;
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Se abbiamo risultati finali, risolvi la promise
          if (finalTranscript) {
            this.isListening = false;
            resolve(finalTranscript.trim());
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Errore riconoscimento vocale:', event.error);
          this.isListening = false;
          
          let errorMessage = 'Errore nel riconoscimento vocale';
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'Nessun discorso rilevato';
              break;
            case 'audio-capture':
              errorMessage = 'Errore nella cattura audio';
              break;
            case 'not-allowed':
              errorMessage = 'Permesso microfono negato';
              break;
            case 'network':
              errorMessage = 'Errore di rete';
              break;
            case 'service-not-allowed':
              errorMessage = 'Servizio non permesso';
              break;
            case 'bad-grammar':
              errorMessage = 'Errore nella grammatica';
              break;
            case 'language-not-supported':
              errorMessage = 'Lingua non supportata';
              break;
          }
          
          reject(new Error(errorMessage));
        };

        this.recognition.onend = () => {
          console.log('Riconoscimento vocale terminato');
          this.isListening = false;
          
          // Se non abbiamo ancora risolto, rifiuta con timeout
          if (this.isListening) {
            reject(new Error('Timeout nel riconoscimento vocale'));
          }
        };

        // Avvia il riconoscimento
        this.recognition.start();
        this.currentLanguage = options.language;

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Ferma il riconoscimento vocale
   */
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Annulla il riconoscimento vocale
   */
  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  /**
   * Verifica se STT è supportato
   */
  isSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Verifica se sta ascoltando
   */
  isListening(): boolean {
    return this.isListening;
  }

  /**
   * Ottiene la lingua corrente
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Riconosce testo maltese
   */
  recognizeMaltese(options?: Partial<RecognitionOptions>): Promise<string> {
    return this.start({
      language: 'mt-MT',
      ...options,
    });
  }

  /**
   * Riconosce testo inglese
   */
  recognizeEnglish(options?: Partial<RecognitionOptions>): Promise<string> {
    return this.start({
      language: 'en-GB',
      ...options,
    });
  }

  /**
   * Riconosce testo italiano
   */
  recognizeItalian(options?: Partial<RecognitionOptions>): Promise<string> {
    return this.start({
      language: 'it-IT',
      ...options,
    });
  }

  /**
   * Riconosce testo con modalità continua (per esercizi di conversazione)
   */
  recognizeContinuous(
    language: string = 'en-US',
    onInterimResult?: (text: string) => void,
    onFinalResult?: (text: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.recognition) {
        reject(new Error('STT non supportato'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Riconoscimento già in corso'));
        return;
      }

      try {
        // Configura per modalità continua
        this.recognition.lang = language;
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        let finalTranscript = '';
        let interimTranscript = '';

        this.recognition.onstart = () => {
          console.log('Riconoscimento continuo iniziato');
          this.isListening = true;
        };

        this.recognition.onresult = (event: any) => {
          interimTranscript = '';
          finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              if (onFinalResult) {
                onFinalResult(transcript.trim());
              }
            } else {
              interimTranscript += transcript;
              if (onInterimResult) {
                onInterimResult(transcript.trim());
              }
            }
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Errore riconoscimento continuo:', event.error);
          this.isListening = false;
          reject(new Error(`Errore STT: ${event.error}`));
        };

        this.recognition.onend = () => {
          console.log('Riconoscimento continuo terminato');
          this.isListening = false;
          resolve();
        };

        this.recognition.start();
        this.currentLanguage = language;

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Valuta la pronuncia confrontando con il testo target
   * @param spokenText - Testo pronunciato dall'utente
   * @param targetText - Testo target da pronunciare
   * @returns Punteggio di pronuncia (0-100)
   */
  evaluatePronunciation(spokenText: string, targetText: string): number {
    const normalizedSpoken = this.normalizeForComparison(spokenText);
    const normalizedTarget = this.normalizeForComparison(targetText);
    
    if (normalizedSpoken === normalizedTarget) {
      return 100; // Pronuncia perfetta
    }
    
    // Calcola similarità usando algoritmo di Levenshtein
    const similarity = this.calculateSimilarity(normalizedSpoken, normalizedTarget);
    return Math.round(similarity * 100);
  }

  /**
   * Normalizza il testo per la comparazione della pronuncia
   */
  private normalizeForComparison(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Rimuovi punteggiatura
      .replace(/\s+/g, ' ') // Normalizza spazi
      .trim();
  }

  /**
   * Calcola la similarità tra due stringhe
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0) return 0;
    if (str2.length === 0) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calcola la distanza di Levenshtein
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

// Istanza singleton
export const sttService = new STTService();

// Hook per React
export function useSTT() {
  return {
    start: sttService.start.bind(sttService),
    stop: sttService.stop.bind(sttService),
    abort: sttService.abort.bind(sttService),
    recognizeMaltese: sttService.recognizeMaltese.bind(sttService),
    recognizeEnglish: sttService.recognizeEnglish.bind(sttService),
    recognizeItalian: sttService.recognizeItalian.bind(sttService),
    recognizeContinuous: sttService.recognizeContinuous.bind(sttService),
    evaluatePronunciation: sttService.evaluatePronunciation.bind(sttService),
    isSupported: sttService.isSupported(),
    isListening: sttService.isListening(),
    getCurrentLanguage: sttService.getCurrentLanguage.bind(sttService),
  };
}
