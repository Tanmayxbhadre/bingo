import { describe, it, expect } from 'vitest';
import { BingoEngine } from '../../shared/game-rules/BingoEngine.js';

describe('Bingo Card Accessibility and Grid Calculations', () => {
  it('generates 25 unique cell indices corresponding to a 5x5 grid', () => {
    const card = BingoEngine.generateCard();
    expect(card).toHaveLength(25);

    const indices = card.map((c) => c.index);
    const uniqueIndices = new Set(indices);
    expect(uniqueIndices.size).toBe(25);

    // Verify row and col calculation for each index
    card.forEach((cell) => {
      const expectedRow = Math.floor(cell.index / 5);
      const expectedCol = cell.index % 5;
      expect(cell.row).toBe(expectedRow);
      expect(cell.col).toBe(expectedCol);
    });
  });

  it('provides line definitions that cover all 12 winning paths', () => {
    const defs = BingoEngine.getLineDefinitions();
    expect(defs).toHaveLength(12);

    const rowDefs = defs.filter((d) => d.id.startsWith('row-'));
    const colDefs = defs.filter((d) => d.id.startsWith('col-'));
    const diagDefs = defs.filter((d) => d.id.startsWith('diag-'));

    expect(rowDefs).toHaveLength(5);
    expect(colDefs).toHaveLength(5);
    expect(diagDefs).toHaveLength(2);

    // Each line must have exactly 5 cells
    defs.forEach((d) => {
      expect(d.cells).toHaveLength(5);
    });
  });
});
