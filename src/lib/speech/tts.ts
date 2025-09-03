/**
 * Adapter per la sintesi vocale (TTS)
 * Supporta Web Speech API con fallback per browser non supportati
 */

import type { SpeechOptions } from '@/types';

// Voci disponibili per il maltese (se supportate)
const MALTESE_VOICES = [
  'mt-MT',
  'en-GB',
  'en-US',
  'it-IT',
];

// Configurazione predefinita
const DEFAULT_OPTIONS: Partial<SpeechOptions> = {
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

export class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      
      // Event listener per quando le voci sono caricate
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      console.warn('Web Speech API non supportata');
      this.isSupported = false;
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    
    try {
      this.voices = this.synthesis.getVoices();
      console.log(`Caricate ${this.voices.length} voci TTS`);
    } catch (error) {
      console.error('Errore nel caricamento delle voci:', error);
    }
  }

  /**
   * Trova la migliore voce disponibile per la lingua specificata
   */
  private findBestVoice(language: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) return null;

    // Prima cerca una voce esatta per la lingua
    let voice = this.voices.find(v => v.lang === language);
    if (voice) return voice;

    // Fallback su voci simili
    const langCode = language.split('-')[0];
    voice = this.voices.find(v => v.lang.startsWith(langCode));
    if (voice) return voice;

    // Fallback su voce di default
    return this.voices[0];
  }

  /**
   * Riproduce il testo usando TTS
   */
  speak(options: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.synthesis) {
        reject(new Error('TTS non supportato'));
        return;
      }

      // Ferma eventuali riproduzioni in corso
      this.stop();

      try {
        const utterance = new SpeechSynthesisUtterance(options.text);
        
        // Configura la voce
        const voice = this.findBestVoice(options.language);
        if (voice) {
          utterance.voice = voice;
        }
        
        // Configura i parametri
        utterance.rate = options.rate || DEFAULT_OPTIONS.rate!;
        utterance.pitch = options.pitch || DEFAULT_OPTIONS.pitch!;
        utterance.volume = options.volume || DEFAULT_OPTIONS.volume!;
        utterance.lang = options.language;

        // Event listeners
        utterance.onstart = () => {
          console.log('TTS iniziato:', options.text);
        };

        utterance.onend = () => {
          console.log('TTS completato:', options.text);
          this.currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('Errore TTS:', event);
          this.currentUtterance = null;
          reject(new Error(`Errore TTS: ${event.error}`));
        };

        // Avvia la riproduzione
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Ferma la riproduzione corrente
   */
  stop(): void {
    if (this.synthesis && this.currentUtterance) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Pausa la riproduzione
   */
  pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  /**
   * Riprende la riproduzione
   */
  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Verifica se TTS è supportato
   */
  isSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Ottiene le voci disponibili
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return [...this.voices];
  }

  /**
   * Ottiene le voci per una lingua specifica
   */
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const langCode = language.split('-')[0];
    return this.voices.filter(v => v.lang.startsWith(langCode));
  }

  /**
   * Riproduce testo maltese con pronuncia corretta
   */
  speakMaltese(text: string, options?: Partial<SpeechOptions>): Promise<void> {
    return this.speak({
      text,
      language: 'mt-MT',
      rate: 0.8, // Più lento per il maltese
      ...options,
    });
  }

  /**
   * Riproduce testo inglese
   */
  speakEnglish(text: string, options?: Partial<SpeechOptions>): Promise<void> {
    return this.speak({
      text,
      language: 'en-GB',
      ...options,
    });
  }

  /**
   * Riproduce testo italiano
   */
  speakItalian(text: string, options?: Partial<SpeechOptions>): Promise<void> {
    return this.speak({
      text,
      language: 'it-IT',
      ...options,
    });
  }
}

// Istanza singleton
export const ttsService = new TTSService();

// Hook per React
export function useTTS() {
  return {
    speak: ttsService.speak.bind(ttsService),
    speakMaltese: ttsService.speakMaltese.bind(ttsService),
    speakEnglish: ttsService.speakEnglish.bind(ttsService),
    speakItalian: ttsService.speakItalian.bind(ttsService),
    stop: ttsService.stop.bind(ttsService),
    pause: ttsService.pause.bind(ttsService),
    resume: ttsService.resume.bind(ttsService),
    isSupported: ttsService.isSupported(),
    getAvailableVoices: ttsService.getAvailableVoices.bind(ttsService),
  };
}
