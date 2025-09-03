/**
 * Utility per la normalizzazione del testo maltese
 * Gestisce diacritici, fonemi speciali e varianti ortografiche
 */

// Mapping per i fonemi maltesi speciali
const MALTESE_PHONEME_MAP = {
  // Diacritici standard
  'Ħ': 'H', 'ħ': 'h',
  'Ġ': 'G', 'ġ': 'g',
  'Ż': 'Z', 'ż': 'z',
  
  // Varianti senza diacritici (per input lenient)
  'H': ['Ħ', 'ħ'],
  'h': ['ħ'],
  'G': ['Ġ', 'ġ'],
  'g': ['ġ'],
  'Z': ['Ż', 'ż'],
  'z': ['ż'],
  
  // Fonemi speciali maltesi
  'għ': 'gh',
  'Għ': 'Gh',
  'GH': 'gh',
  'gh': 'għ',
  
  // Q glottale (spesso silente)
  'q': 'q',
  'Q': 'Q',
  
  // X fricativa palatale (pronunciata come 'sh')
  'x': 'x',
  'X': 'X',
  
  // Varianti comuni per input tollerante
  'sh': 'x',
  'SH': 'X',
  'Sh': 'X'
} as const;

// Caratteri maltesi speciali
export const MALTESE_SPECIAL_CHARS = ['Ħ', 'ħ', 'Ġ', 'ġ', 'Ż', 'ż', 'għ', 'Għ'];

/**
 * Normalizza il testo maltese per la comparazione
 * @param input - Testo da normalizzare
 * @param mode - Modalità di normalizzazione ('strict' | 'lenient')
 * @returns Testo normalizzato
 */
export function normalizeMaltese(input: string, mode: 'strict' | 'lenient' = 'lenient'): string {
  if (!input) return '';
  
  let normalized = input.trim();
  
  if (mode === 'lenient') {
    // Rimuovi spazi multipli
    normalized = normalized.replace(/\s+/g, ' ');
    
    // Converti in minuscolo per comparazione case-insensitive
    normalized = normalized.toLowerCase();
    
    // Normalizza fonemi speciali per input tollerante
    normalized = normalized
      .replace(/gh/g, 'għ')
      .replace(/sh/g, 'x')
      .replace(/ħ/g, 'h')
      .replace(/ġ/g, 'g')
      .replace(/ż/g, 'z');
      
  } else {
    // Modalità strict - mantieni diacritici originali
    normalized = normalized
      .replace(/\s+/g, ' ') // Solo spazi multipli
      .trim();
  }
  
  return normalized;
}

/**
 * Verifica se due testi maltesi sono equivalenti
 * @param userInput - Input dell'utente
 * @param correctAnswer - Risposta corretta
 * @param mode - Modalità di comparazione
 * @returns True se equivalente
 */
export function isMalteseEquivalent(
  userInput: string, 
  correctAnswer: string, 
  mode: 'strict' | 'lenient' = 'lenient'
): boolean {
  const normalizedInput = normalizeMaltese(userInput, mode);
  const normalizedAnswer = normalizeMaltese(correctAnswer, mode);
  
  return normalizedInput === normalizedAnswer;
}

/**
 * Verifica se l'input è accettabile rispetto a una lista di risposte valide
 * @param userInput - Input dell'utente
 * @param validAnswers - Lista di risposte valide
 * @param mode - Modalità di comparazione
 * @returns True se accettabile
 */
export function isAcceptableAnswer(
  userInput: string,
  validAnswers: string[],
  mode: 'strict' | 'lenient' = 'lenient'
): boolean {
  return validAnswers.some(answer => 
    isMalteseEquivalent(userInput, answer, mode)
  );
}

/**
 * Genera suggerimenti per correzioni ortografiche
 * @param userInput - Input dell'utente
 * @param correctAnswer - Risposta corretta
 * @returns Suggerimenti per la correzione
 */
export function getMalteseSuggestions(userInput: string, correctAnswer: string): string[] {
  const suggestions: string[] = [];
  
  // Controlla se mancano diacritici
  if (userInput.toLowerCase() === correctAnswer.toLowerCase() && 
      userInput !== correctAnswer) {
    suggestions.push('Controlla i diacritici (Ħ, ħ, Ġ, ġ, Ż, ż)');
  }
  
  // Controlla fonemi speciali
  if (userInput.includes('gh') && correctAnswer.includes('għ')) {
    suggestions.push('Usa "għ" invece di "gh"');
  }
  
  if (userInput.includes('sh') && correctAnswer.includes('x')) {
    suggestions.push('In maltese, "x" si pronuncia come "sh"');
  }
  
  // Controlla spazi extra
  if (userInput.trim() !== userInput) {
    suggestions.push('Rimuovi gli spazi extra');
  }
  
  return suggestions;
}

/**
 * Valuta la qualità della risposta (0-5 per SRS)
 * @param userInput - Input dell'utente
 * @param correctAnswer - Risposta corretta
 * @param mode - Modalità di valutazione
 * @returns Punteggio da 0 a 5
 */
export function evaluateMalteseAnswer(
  userInput: string,
  correctAnswer: string,
  mode: 'strict' | 'lenient' = 'lenient'
): number {
  if (isMalteseEquivalent(userInput, correctAnswer, mode)) {
    return 5; // Perfetto
  }
  
  const normalizedInput = normalizeMaltese(userInput, 'lenient');
  const normalizedAnswer = normalizeMaltese(correctAnswer, 'lenient');
  
  if (normalizedInput === normalizedAnswer) {
    return 4; // Corretto ma senza diacritici
  }
  
  // Calcola similarità
  const similarity = calculateSimilarity(normalizedInput, normalizedAnswer);
  
  if (similarity > 0.8) return 3; // Molto simile
  if (similarity > 0.6) return 2; // Simile
  if (similarity > 0.4) return 1; // Poco simile
  
  return 0; // Completamente sbagliato
}

/**
 * Calcola la similarità tra due stringhe (algoritmo di Levenshtein semplificato)
 */
function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0) return 0;
  if (str2.length === 0) return 0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Calcola la distanza di Levenshtein tra due stringhe
 */
function levenshteinDistance(str1: string, str2: string): number {
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

/**
 * Formatta il testo maltese per la visualizzazione
 * @param text - Testo da formattare
 * @returns Testo formattato con evidenziazione dei fonemi speciali
 */
export function formatMalteseText(text: string): string {
  return text
    .replace(/(għ)/gi, '<span class="text-maltese-500 font-semibold">$1</span>')
    .replace(/(ħ)/gi, '<span class="text-maltese-600 font-semibold">$1</span>')
    .replace(/(ġ)/gi, '<span class="text-maltese-600 font-semibold">$1</span>')
    .replace(/(ż)/gi, '<span class="text-maltese-600 font-semibold">$1</span>')
    .replace(/(x)/gi, '<span class="text-maltese-500 font-semibold">$1</span>');
}

/**
 * Estrae i fonemi speciali da un testo maltese
 * @param text - Testo maltese
 * @returns Array di fonemi speciali trovati
 */
export function extractMaltesePhonemes(text: string): string[] {
  const phonemes: string[] = [];
  const regex = /[ĦħĠġŻżgħGħ]/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (!phonemes.includes(match[0])) {
      phonemes.push(match[0]);
    }
  }
  
  return phonemes;
}
