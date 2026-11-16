import { describe, it, expect } from 'vitest';
import { BingoEngine } from '../../shared/game-rules/BingoEngine.js';

describe('Diagonal Line Win Condition Edge Cases', () => {
  it('correctly detects main diagonal line completion (indices 0, 6, 12, 18, 24)', () => {
    const card = BingoEngine.generateCard();
    const mainDiagIndices = [0, 6, 12, 18, 24];

    mainDiagIndices.forEach((idx) => {
      card[idx].marked = true;
    });

    const result = BingoEngine.evaluateLines(card);
    expect(result.completedLines).toContain('diag-main');
    expect(result.completedCount).toBeGreaterThanOrEqual(1);
    expect(result.winningCellIndices).toEqual(expect.arrayContaining(mainDiagIndices));
  });

  it('correctly detects anti-diagonal line completion (indices 4, 8, 12, 16, 20)', () => {
    const card = BingoEngine.generateCard();
    const antiDiagIndices = [4, 8, 12, 16, 20];

    antiDiagIndices.forEach((idx) => {
      card[idx].marked = true;
    });

    const result = BingoEngine.evaluateLines(card);
    expect(result.completedLines).toContain('diag-anti');
    expect(result.completedCount).toBeGreaterThanOrEqual(1);
    expect(result.winningCellIndices).toEqual(expect.arrayContaining(antiDiagIndices));
  });

  it('completes both diagonals when center tile (index 12) is the final marked number', () => {
    const card = BingoEngine.generateCard();
    // Mark both diagonals except center cell 12
    [0, 6, 18, 24, 4, 8, 16, 20].forEach((idx) => {
      card[idx].marked = true;
    });

    // Before center cell is marked
    const beforeResult = BingoEngine.evaluateLines(card);
    expect(beforeResult.completedLines).not.toContain('diag-main');
    expect(beforeResult.completedLines).not.toContain('diag-anti');

    // Mark center cell 12
    card[12].marked = true;
    const afterResult = BingoEngine.evaluateLines(card);

    expect(afterResult.completedLines).toContain('diag-main');
    expect(afterResult.completedLines).toContain('diag-anti');
    expect(afterResult.completedCount).toBeGreaterThanOrEqual(2);
  });
});
