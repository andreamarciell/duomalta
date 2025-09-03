import { describe, it, expect } from 'vitest';
import {
  normalizeMaltese,
  isMalteseEquivalent,
  isAcceptableAnswer,
  getMalteseSuggestions,
  evaluateMalteseAnswer,
  extractMaltesePhonemes
} from '@/lib/maltese/normalize';

describe('Maltese Normalization', () => {
  describe('normalizeMaltese', () => {
    it('should normalize text in lenient mode', () => {
      const input = '  Għid  it-Tajjeb  ';
      const normalized = normalizeMaltese(input, 'lenient');
      
      expect(normalized).toBe('għid it-tajjeb');
    });

    it('should preserve diacritics in strict mode', () => {
      const input = '  Għid  it-Tajjeb  ';
      const normalized = normalizeMaltize(input, 'strict');
      
      expect(normalized).toBe('Għid it-Tajjeb');
    });

    it('should handle special Maltese characters', () => {
      const input = 'Ħobż ġdid żgħir';
      const normalized = normalizeMaltese(input, 'lenient');
      
      expect(normalized).toBe('ħobż ġdid żgħir');
    });

    it('should convert gh to għ in lenient mode', () => {
      const input = 'ghid ghada';
      const normalized = normalizeMaltese(input, 'lenient');
      
      expect(normalized).toBe('għid għada');
    });

    it('should convert sh to x in lenient mode', () => {
      const input = 'shab shab';
      const normalized = normalizeMaltese(input, 'lenient');
      
      expect(normalized).toBe('xab xab');
    });
  });

  describe('isMalteseEquivalent', () => {
    it('should match identical strings', () => {
      const result = isMalteseEquivalent('Bongu', 'Bongu', 'strict');
      expect(result).toBe(true);
    });

    it('should match case-insensitive in lenient mode', () => {
      const result = isMalteseEquivalent('bongu', 'Bongu', 'lenient');
      expect(result).toBe(true);
    });

    it('should match with normalized special characters in lenient mode', () => {
      const result = isMalteseEquivalent('ghid', 'għid', 'lenient');
      expect(result).toBe(true);
    });

    it('should not match with different special characters in strict mode', () => {
      const result = isMalteseEquivalent('ghid', 'għid', 'strict');
      expect(result).toBe(false);
    });

    it('should handle spaces correctly', () => {
      const result = isMalteseEquivalent('  Bongu  ', 'Bongu', 'lenient');
      expect(result).toBe(true);
    });
  });

  describe('isAcceptableAnswer', () => {
    it('should accept correct answer', () => {
      const validAnswers = ['Bongu', 'Bonswa'];
      const result = isAcceptableAnswer('Bongu', validAnswers, 'lenient');
      expect(result).toBe(true);
    });

    it('should accept normalized answer in lenient mode', () => {
      const validAnswers = ['għid'];
      const result = isAcceptableAnswer('ghid', validAnswers, 'lenient');
      expect(result).toBe(true);
    });

    it('should not accept wrong answer', () => {
      const validAnswers = ['Bongu', 'Bonswa'];
      const result = isAcceptableAnswer('Le', validAnswers, 'lenient');
      expect(result).toBe(false);
    });
  });

  describe('getMalteseSuggestions', () => {
    it('should suggest diacritics when missing', () => {
      const suggestions = getMalteseSuggestions('ghid', 'għid');
      expect(suggestions).toContain('Controlla i diacritici (Ħ, ħ, Ġ, ġ, Ż, ż)');
    });

    it('should suggest gh instead of għ', () => {
      const suggestions = getMalteseSuggestions('ghid', 'għid');
      expect(suggestions).toContain('Usa "għ" invece di "gh"');
    });

    it('should suggest x instead of sh', () => {
      const suggestions = getMalteseSuggestions('shab', 'xab');
      expect(suggestions).toContain('In maltese, "x" si pronuncia come "sh"');
    });

    it('should suggest removing extra spaces', () => {
      const suggestions = getMalteseSuggestions('  Bongu  ', 'Bongu');
      expect(suggestions).toContain('Rimuovi gli spazi extra');
    });
  });

  describe('evaluateMalteseAnswer', () => {
    it('should give perfect score for exact match', () => {
      const score = evaluateMalteseAnswer('Bongu', 'Bongu', 'strict');
      expect(score).toBe(5);
    });

    it('should give high score for normalized match in lenient mode', () => {
      const score = evaluateMalteseAnswer('ghid', 'għid', 'lenient');
      expect(score).toBe(4);
    });

    it('should give lower score for similar answers', () => {
      const score = evaluateMalteseAnswer('Bong', 'Bongu', 'lenient');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(4);
    });

    it('should give zero for completely wrong answers', () => {
      const score = evaluateMalteseAnswer('Le', 'Bongu', 'lenient');
      expect(score).toBe(0);
    });
  });

  describe('extractMaltesePhonemes', () => {
    it('should extract special Maltese characters', () => {
      const text = 'Ħobż ġdid żgħir';
      const phonemes = extractMaltesePhonemes(text);
      
      expect(phonemes).toContain('ħ');
      expect(phonemes).toContain('ġ');
      expect(phonemes).toContain('ż');
      expect(phonemes).toContain('għ');
    });

    it('should not duplicate phonemes', () => {
      const text = 'Ħobż ħobż ħobż';
      const phonemes = extractMaltesePhonemes(text);
      
      const uniquePhonemes = [...new Set(phonemes)];
      expect(phonemes).toHaveLength(uniquePhonemes.length);
    });

    it('should return empty array for text without special characters', () => {
      const text = 'Bongu bonswa';
      const phonemes = extractMaltesePhonemes(text);
      
      expect(phonemes).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      expect(normalizeMaltese('', 'lenient')).toBe('');
      expect(isMalteseEquivalent('', '', 'lenient')).toBe(true);
      expect(isAcceptableAnswer('', [], 'lenient')).toBe(false);
    });

    it('should handle strings with only spaces', () => {
      expect(normalizeMaltese('   ', 'lenient')).toBe('');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000) + 'Ħ' + 'b'.repeat(1000);
      const phonemes = extractMaltesePhonemes(longString);
      expect(phonemes).toContain('ħ');
    });
  });
});
