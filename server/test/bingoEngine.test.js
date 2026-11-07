import { describe, it, expect } from 'vitest';
import { BingoEngine } from '../../shared/game-rules/BingoEngine.js';
import { GAME_CONFIG } from '../../shared/constants/gameConstants.js';

describe('BingoEngine - Card Generation', () => {
  it('generates a card with exactly 25 numbers', () => {
    const card = BingoEngine.generateCard();
    expect(card).toHaveLength(25);
  });

  it('ensures every number on the card is between 1 and 75', () => {
    const card = BingoEngine.generateCard();
    card.forEach((cell) => {
      expect(cell.number).toBeGreaterThanOrEqual(1);
      expect(cell.number).toBeLessThanOrEqual(75);
    });
  });

  it('contains no duplicate numbers within an individual card', () => {
    const card = BingoEngine.generateCard();
    const numbers = card.map((c) => c.number);
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(25);
  });

  it('passes validateCard check', () => {
    const card = BingoEngine.generateCard();
    const validation = BingoEngine.validateCard(card);
    expect(validation.valid).toBe(true);
  });

  it('independently randomizes different cards', () => {
    const card1 = BingoEngine.generateCard();
    const card2 = BingoEngine.generateCard();
    const numbers1 = card1.map((c) => c.number);
    const numbers2 = card2.map((c) => c.number);

    // It is mathematically near-impossible for two 25-number random draws
    // from 75 to have the exact same sequence
    expect(numbers1).not.toEqual(numbers2);
  });
});

describe('BingoEngine - Number Calling Pool', () => {
  it('creates a pool containing numbers 1 to 75 without duplicates', () => {
    const pool = BingoEngine.createCallerPool();
    expect(pool).toHaveLength(75);
    const unique = new Set(pool);
    expect(unique.size).toBe(75);
    pool.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(75);
    });
  });

  it('draws 75 unique numbers until pool is exhausted', () => {
    const pool = BingoEngine.createCallerPool();
    const drawn = [];
    while (pool.length > 0) {
      const num = pool.pop();
      expect(drawn).not.toContain(num);
      drawn.push(num);
    }
    expect(drawn).toHaveLength(75);
    expect(pool.length).toBe(0);
  });
});

describe('BingoEngine - Automatic Marking', () => {
  it('automatically marks a matching number', () => {
    const card = BingoEngine.generateCard();
    const targetNumber = card[7].number;

    const result = BingoEngine.markNumber(card, targetNumber);
    expect(result.marked).toBe(true);
    expect(result.cellIndex).toBe(7);
    expect(card[7].marked).toBe(true);
  });

  it('does not mark card if number is not present', () => {
    const card = BingoEngine.generateCard();
    const presentNumbers = new Set(card.map((c) => c.number));
    let missingNumber = 1;
    while (presentNumbers.has(missingNumber)) {
      missingNumber++;
    }

    const result = BingoEngine.markNumber(card, missingNumber);
    expect(result.marked).toBe(false);
    expect(result.cellIndex).toBe(-1);
  });
});

describe('BingoEngine - Winning Detection (12 possible lines, 5 needed to win)', () => {
  // Helper to construct a blank test card with deterministic numbers 1..25
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
    // Mark row 0: indices 0, 1, 2, 3, 4
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
    // Mark 4 rows: row 0, row 1, row 2, row 3
    for (let i = 0; i < 20; i++) {
      card[i].marked = true;
    }

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedCount).toBe(4);
    expect(res.isWinner).toBe(false);
  });

  it('wins with five horizontal lines (full card)', () => {
    const card = createTestCard();
    // Mark all 5 rows (all 25 cells)
    for (let i = 0; i < 25; i++) {
      card[i].marked = true;
    }

    const res = BingoEngine.evaluateLines(card);
    // All 5 rows, all 5 cols, 2 diagonals = 12 lines
    expect(res.completedLines).toContain('row-0');
    expect(res.completedLines).toContain('row-1');
    expect(res.completedLines).toContain('row-2');
    expect(res.completedLines).toContain('row-3');
    expect(res.completedLines).toContain('row-4');
    expect(res.completedCount).toBeGreaterThanOrEqual(5);
    expect(res.isWinner).toBe(true);
  });

  it('wins with five vertical lines', () => {
    const card = createTestCard();
    // If all 5 columns are marked, that marks all 25 cells
    for (let i = 0; i < 25; i++) {
      card[i].marked = true;
    }

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toContain('col-0');
    expect(res.completedLines).toContain('col-1');
    expect(res.completedLines).toContain('col-2');
    expect(res.completedLines).toContain('col-3');
    expect(res.completedLines).toContain('col-4');
    expect(res.isWinner).toBe(true);
  });

  it('detects both diagonals correctly', () => {
    const card = createTestCard();
    // Main diagonal: 0, 6, 12, 18, 24
    [0, 6, 12, 18, 24].forEach((i) => (card[i].marked = true));
    // Anti diagonal: 4, 8, 12, 16, 20
    [4, 8, 12, 16, 20].forEach((i) => (card[i].marked = true));

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toContain('diag-main');
    expect(res.completedLines).toContain('diag-anti');
    expect(res.completedCount).toBe(2);
    expect(res.isWinner).toBe(false);
  });

  it('wins with mixed horizontal and vertical lines (e.g. 3 rows + 2 cols)', () => {
    const card = createTestCard();
    // Complete row 0, 1, 2
    // Row 0: 0,1,2,3,4
    // Row 1: 5,6,7,8,9
    // Row 2: 10,11,12,13,14
    for (let i = 0; i < 15; i++) {
      card[i].marked = true;
    }
    // Complete col 0: 0, 5, 10, 15, 20
    card[15].marked = true;
    card[20].marked = true;
    // Complete col 1: 1, 6, 11, 16, 21
    card[16].marked = true;
    card[21].marked = true;

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toContain('row-0');
    expect(res.completedLines).toContain('row-1');
    expect(res.completedLines).toContain('row-2');
    expect(res.completedLines).toContain('col-0');
    expect(res.completedLines).toContain('col-1');
    expect(res.completedCount).toBeGreaterThanOrEqual(5);
    expect(res.isWinner).toBe(true);
  });

  it('wins with mixed rows, columns, and diagonals (e.g. 2 rows, 2 cols, 1 diagonal)', () => {
    const card = createTestCard();
    // Row 0: 0, 1, 2, 3, 4
    [0, 1, 2, 3, 4].forEach((i) => (card[i].marked = true));
    // Row 4: 20, 21, 22, 23, 24
    [20, 21, 22, 23, 24].forEach((i) => (card[i].marked = true));
    // Col 0: 0, 5, 10, 15, 20
    [5, 10, 15].forEach((i) => (card[i].marked = true));
    // Col 4: 4, 9, 14, 19, 24
    [9, 14, 19].forEach((i) => (card[i].marked = true));
    // Main diagonal: 0, 6, 12, 18, 24 -> need 6, 12, 18
    [6, 12, 18].forEach((i) => (card[i].marked = true));

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toContain('row-0');
    expect(res.completedLines).toContain('row-4');
    expect(res.completedLines).toContain('col-0');
    expect(res.completedLines).toContain('col-4');
    expect(res.completedLines).toContain('diag-main');
    expect(res.completedCount).toBeGreaterThanOrEqual(5);
    expect(res.isWinner).toBe(true);
  });

  it('correctly handles cells shared by multiple intersecting lines', () => {
    const card = createTestCard();
    // Center cell index 12 is shared by row-2, col-2, diag-main, and diag-anti!
    // Row 2: 10, 11, 12, 13, 14
    [10, 11, 12, 13, 14].forEach((i) => (card[i].marked = true));
    // Col 2: 2, 7, 12, 17, 22
    [2, 7, 17, 22].forEach((i) => (card[i].marked = true));

    const res = BingoEngine.evaluateLines(card);
    expect(res.completedLines).toContain('row-2');
    expect(res.completedLines).toContain('col-2');
    expect(res.winningCellIndices).toContain(12);
    expect(res.completedCount).toBe(2);
  });

  it('authoritatively validates card against called numbers', () => {
    const card = createTestCard();
    // Suppose client claimed they marked cells 0..4 (row 0), but the server only called numbers 1, 2, 3 (cells 0, 1, 2)
    const calledNumbersSet = new Set([1, 2, 3]);

    const verification = BingoEngine.verifyCardAuthoritative(card, calledNumbersSet);
    expect(verification.completedCount).toBe(0);
    expect(verification.isWinner).toBe(false);

    // If server also calls numbers 4 and 5:
    calledNumbersSet.add(4);
    calledNumbersSet.add(5);
    const updatedVerification = BingoEngine.verifyCardAuthoritative(card, calledNumbersSet);
    expect(updatedVerification.completedLines).toContain('row-0');
    expect(updatedVerification.completedCount).toBe(1);
  });
});

