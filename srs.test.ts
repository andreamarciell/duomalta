import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createSRSItem, 
  updateSRSItem, 
  calculatePriority, 
  getDueItems,
  sortByPriority 
} from './src/lib/srs/schedule';
import type { SRSItem } from './src/types';

describe('SRS System', () => {
  let testItem: SRSItem;

  beforeEach(() => {
    testItem = createSRSItem('test-item', 'test-lesson', 'test-unit');
  });

  describe('createSRSItem', () => {
    it('should create a new SRS item with correct initial values', () => {
      expect(testItem.itemId).toBe('test-item');
      expect(testItem.lessonId).toBe('test-lesson');
      expect(testItem.unitId).toBe('test-unit');
      expect(testItem.quality).toBe(0);
      expect(testItem.easiness).toBe(2.5);
      expect(testItem.interval).toBe(1);
      expect(testItem.repetitions).toBe(0);
      expect(testItem.attempts).toHaveLength(0);
    });

    it('should set due date to tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(testItem.dueDate.getDate()).toBe(tomorrow.getDate());
    });
  });

  describe('updateSRSItem', () => {
    it('should update item with correct quality score', () => {
      const updatedItem = updateSRSItem(
        testItem,
        5, // perfect score
        'user answer',
        'correct answer',
        1000 // response time
      );

      expect(updatedItem.quality).toBe(5);
      expect(updatedItem.repetitions).toBe(1);
      expect(updatedItem.attempts).toHaveLength(1);
      expect(updatedItem.attempts[0].quality).toBe(5);
      expect(updatedItem.attempts[0].isCorrect).toBe(true);
    });

    it('should reset interval for low quality scores', () => {
      const updatedItem = updateSRSItem(
        testItem,
        1, // low score
        'wrong answer',
        'correct answer',
        2000
      );

      expect(updatedItem.interval).toBe(1);
      expect(updatedItem.attempts[0].isCorrect).toBe(false);
    });

    it('should increase interval for high quality scores', () => {
      // First correct answer
      let updatedItem = updateSRSItem(
        testItem,
        5,
        'correct answer',
        'correct answer',
        1000
      );

      expect(updatedItem.interval).toBe(6); // First correct = 6 days

      // Second correct answer
      updatedItem = updateSRSItem(
        updatedItem,
        5,
        'correct answer',
        'correct answer',
        1000
      );

      expect(updatedItem.interval).toBeGreaterThan(6);
    });
  });

  describe('calculatePriority', () => {
    it('should calculate higher priority for overdue items', () => {
      const overdueItem = {
        ...testItem,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      };

      const priority = calculatePriority(overdueItem);
      expect(priority).toBeGreaterThan(0);
    });

    it('should calculate higher priority for difficult items', () => {
      const difficultItem = {
        ...testItem,
        easiness: 1.3 // minimum easiness
      };

      const priority = calculatePriority(difficultItem);
      expect(priority).toBeGreaterThan(0);
    });
  });

  describe('getDueItems', () => {
    it('should return items that are due for review', () => {
      const dueItem = {
        ...testItem,
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
      };

      const items = [dueItem, testItem];
      const dueItems = getDueItems(items);

      expect(dueItems).toHaveLength(1);
      expect(dueItems[0]).toBe(dueItem);
    });

    it('should not return future items', () => {
      const futureItem = {
        ...testItem,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
      };

      const items = [futureItem];
      const dueItems = getDueItems(items);

      expect(dueItems).toHaveLength(0);
    });
  });

  describe('sortByPriority', () => {
    it('should sort items by priority (highest first)', () => {
      const item1 = { ...testItem, id: '1' };
      const item2 = {
        ...testItem,
        id: '2',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      };
      const item3 = {
        ...testItem,
        id: '3',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      };

      const items = [item1, item2, item3];
      const sortedItems = sortByPriority(items);

      expect(sortedItems[0].id).toBe('2'); // Most overdue
      expect(sortedItems[1].id).toBe('3'); // Less overdue
      expect(sortedItems[2].id).toBe('1'); // Not overdue
    });
  });
});
