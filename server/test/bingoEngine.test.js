import { describe, it, expect } from 'vitest';
import { BingoEngine } from '../../shared/game-rules/BingoEngine.js';
import { GAME_CONFIG } from '../../shared/constants/gameConstants.js';

describe('BingoEngine - Card Generation (1-25 Scrambled)', () => {
  it('generates a card with exactly 25 numbers', () => {
    const card = BingoEngine.generateCard();
    expect(card).toHaveLength(25);
  });

  it('ensures every number on the card is between 1 and 25', () => {
    const card = BingoEngine.generateCard();
    card.forEach((cell) => {
      expect(cell.number).toBeGreaterThanOrEqual(1);
      expect(cell.number).toBeLessThanOrEqual(25);
    });
  });

  it('contains no duplicate numbers and has all numbers 1 to 25', () => {
    const card = BingoEngine.generateCard();
    const numbers = card.map((c) => c.number);
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(25);
    for (let i = 1; i <= 25; i++) {
      expect(uniqueNumbers.has(i)).toBe(true);
    }
  });

  it('passes validateCard check', () => {
    const card = BingoEngine.generateCard();
    const validation = BingoEngine.validateCard(card);
    expect(validation.valid).toBe(true);
  });

  it('gives players the same set of numbers (1-25) in a scrambled order', () => {
    const card1 = BingoEngine.generateCard();
    const card2 = BingoEngine.generateCard();
    const numbers1 = card1.map((c) => c.number);
    const numbers2 = card2.map((c) => c.number);

    // Both cards must contain the exact same sorted set [1..25]
    expect([...numbers1].sort((a, b) => a - b)).toEqual([...numbers2].sort((a, b) => a - b));

    // But the scrambled grid layout should be different
    expect(numbers1).not.toEqual(numbers2);
  });
});

describe('BingoEngine - Calling Pool (1 to 25)', () => {
  it('creates a pool containing numbers 1 to 25 without duplicates', () => {
    const pool = BingoEngine.createCallerPool();
    expect(pool).toHaveLength(25);
    const unique = new Set(pool);
    expect(unique.size).toBe(25);
  });

  it('draws 25 unique numbers until pool is exhausted', () => {
    const pool = BingoEngine.createCallerPool();
    const drawn = [];
    while (pool.length > 0) {
      const num = pool.pop();
      expect(drawn).not.toContain(num);
      drawn.push(num);
    }
    expect(drawn).toHaveLength(25);
    expect(pool.length).toBe(0);
  });
});

describe('BingoEngine - Automatic & Manual Marking', () => {
  it('marks matching number', () => {
    const card = BingoEngine.generateCard();
    const targetNumber = card[7].number;

    const result = BingoEngine.markNumber(card, targetNumber);
    expect(result.marked).toBe(true);
    expect(result.cellIndex).toBe(7);
    expect(card[7].marked).toBe(true);
  });
});

describe('BingoEngine - Winning Detection (12 possible lines, 5 needed to win)', () => {
  function createTestCard() {
    const cells = [];
    for (let i = 0; i < 25; i++) {
      cells.push({
        index: i,
        row: Math.floor(i / 5),
        col: i % 5,
        number: i + 1,
        marked: false,
      });
    }
    return cells;
  }

  it('accurately detects a single horizontal line', () => {
    const card = createTestCard();
    [0, 1, 2, 3, 4].forEach((idx) => {
      card[idx].marked = true;
    });

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toEqual(['row-0']);
    expect(res.completedCount).toBe(1);
    expect(res.isWinner).toBe(false);
  });

  it('does NOT declare a winner with 4 completed lines', () => {
    const card = createTestCard();
    for (let i = 0; i < 20; i++) {
      card[i].marked = true;
    }

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedCount).toBe(4);
    expect(res.isWinner).toBe(false);
  });

  it('wins with five horizontal lines (full card)', () => {
    const card = createTestCard();
    for (let i = 0; i < 25; i++) {
      card[i].marked = true;
    }

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedCount).toBeGreaterThanOrEqual(5);
    expect(res.isWinner).toBe(true);
  });

  it('detects both diagonals correctly', () => {
    const card = createTestCard();
    [0, 6, 12, 18, 24].forEach((i) => (card[i].marked = true));
    [4, 8, 12, 16, 20].forEach((i) => (card[i].marked = true));

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toContain('diag-main');
    expect(res.completedLines).toContain('diag-anti');
    expect(res.completedCount).toBe(2);
    expect(res.isWinner).toBe(false);
  });

  it('wins with mixed rows, columns, and diagonals', () => {
    const card = createTestCard();
    // Row 0
    [0, 1, 2, 3, 4].forEach((i) => (card[i].marked = true));
    // Row 4
    [20, 21, 22, 23, 24].forEach((i) => (card[i].marked = true));
    // Col 0
    [5, 10, 15].forEach((i) => (card[i].marked = true));
    // Col 4
    [9, 14, 19].forEach((i) => (card[i].marked = true));
    // Main diagonal
    [6, 12, 18].forEach((i) => (card[i].marked = true));

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedCount).toBeGreaterThanOrEqual(5);
    expect(res.isWinner).toBe(true);
  });

  it('correctly calculates 12 maximum lines and 25 winning cells when fully marked', () => {
    const card = createTestCard();
    for (let i = 0; i < 25; i++) {
      card[i].marked = true;
    }

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedCount).toBe(12);
    expect(res.completedLines).toHaveLength(12);
    expect(res.winningCellIndices).toHaveLength(25);
    expect(res.isWinner).toBe(true);
  });
});
