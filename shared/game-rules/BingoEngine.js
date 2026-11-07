import { GAME_CONFIG } from '../constants/gameConstants.js';

export class BingoEngine {
  /**
   * Generates a unique 5x5 card with 25 distinct numbers between 1 and 75.
   * Returns a 25-element flat array of cell objects:
   * { index, row, col, number, marked: false }
   */
  static generateCard() {
    const allNumbers = [];
    for (let i = GAME_CONFIG.MIN_NUMBER; i <= GAME_CONFIG.MAX_NUMBER; i++) {
      allNumbers.push(i);
    }

    // Fisher-Yates shuffle
    for (let i = allNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }

    // Pick first 25 unique numbers
    const selected = allNumbers.slice(0, GAME_CONFIG.TOTAL_CELLS);

    const cells = [];
    let idx = 0;
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        cells.push({
          index: idx,
          row,
          col,
          number: selected[idx],
          marked: false,
        });
        idx++;
      }
    }

    return cells;
  }

  /**
   * Validate that a card structure conforms to rules:
   * - Exactly 25 cells
   * - All numbers between 1 and 75
   * - No duplicate numbers
   */
  static validateCard(cells) {
    if (!Array.isArray(cells) || cells.length !== GAME_CONFIG.TOTAL_CELLS) {
      return { valid: false, reason: 'Card must contain exactly 25 cells' };
    }

    const seen = new Set();
    for (const cell of cells) {
      if (
        typeof cell.number !== 'number' ||
        cell.number < GAME_CONFIG.MIN_NUMBER ||
        cell.number > GAME_CONFIG.MAX_NUMBER
      ) {
        return {
          valid: false,
          reason: `Number ${cell.number} is out of range [${GAME_CONFIG.MIN_NUMBER}, ${GAME_CONFIG.MAX_NUMBER}]`,
        };
      }
      if (seen.has(cell.number)) {
        return { valid: false, reason: `Duplicate number found: ${cell.number}` };
      }
      seen.add(cell.number);
    }

    return { valid: true };
  }

  /**
   * Generates an array of all 12 line definitions:
   * 5 rows, 5 cols, 2 diagonals
   */
  static getLineDefinitions() {
    const lines = [];

    // 5 Rows
    for (let r = 0; r < 5; r++) {
      const cells = [];
      for (let c = 0; c < 5; c++) {
        cells.push(r * 5 + c);
      }
      lines.push({ id: `row-${r}`, type: 'row', index: r, cells });
    }

    // 5 Columns
    for (let c = 0; c < 5; c++) {
      const cells = [];
      for (let r = 0; r < 5; r++) {
        cells.push(r * 5 + c);
      }
      lines.push({ id: `col-${c}`, type: 'col', index: c, cells });
    }

    // Main diagonal (top-left to bottom-right: (0,0), (1,1), (2,2), (3,3), (4,4))
    const mainDiag = [];
    for (let i = 0; i < 5; i++) {
      mainDiag.push(i * 5 + i);
    }
    lines.push({ id: 'diag-main', type: 'diagonal', name: 'Main Diagonal', cells: mainDiag });

    // Anti diagonal (top-right to bottom-left: (0,4), (1,3), (2,2), (3,1), (4,0))
    const antiDiag = [];
    for (let i = 0; i < 5; i++) {
      antiDiag.push(i * 5 + (4 - i));
    }
    lines.push({ id: 'diag-anti', type: 'diagonal', name: 'Anti Diagonal', cells: antiDiag });

    return lines;
  }

  /**
   * Automatically marks a number on the card if present.
   * Returns { marked: boolean, cellIndex: number | -1 }
   */
  static markNumber(card, numberToMark) {
    const cell = card.find((c) => c.number === numberToMark);
    if (cell) {
      cell.marked = true;
      return { marked: true, cellIndex: cell.index };
    }
    return { marked: false, cellIndex: -1 };
  }

  /**
   * Calculates all completed lines on a card.
   * A line is complete when all 5 cells in that line are marked.
   * Returns:
   * {
   *   completedLines: string[], // line IDs
   *   completedCount: number,
   *   winningCellIndices: number[],
   *   isWinner: boolean
   * }
   */
  static evaluateLines(card) {
    const lineDefs = this.getLineDefinitions();
    const completedLines = [];
    const winningCellsSet = new Set();

    for (const line of lineDefs) {
      const isComplete = line.cells.every((idx) => card[idx] && card[idx].marked);
      if (isComplete) {
        completedLines.push(line.id);
        line.cells.forEach((idx) => winningCellsSet.add(idx));
      }
    }

    const completedCount = completedLines.length;
    const isWinner = completedCount >= GAME_CONFIG.WINNING_LINE_COUNT;

    return {
      completedLines,
      completedCount,
      winningCellIndices: Array.from(winningCellsSet),
      isWinner,
    };
  }

  /**
   * Authoritative verification of a player's card against all official drawn numbers.
   * Ensures that no client marks numbers that were never officially drawn.
   */
  static verifyCardAuthoritative(card, calledNumbersSet) {
    const sanitizedCard = card.map((cell) => ({
      ...cell,
      marked: calledNumbersSet.has(cell.number),
    }));

    const evaluation = this.evaluateLines(sanitizedCard);

    return {
      sanitizedCard,
      ...evaluation,
    };
  }

  /**
   * Initialize a fresh shuffled calling pool of numbers 1..75
   */
  static createCallerPool() {
    const pool = [];
    for (let i = GAME_CONFIG.MIN_NUMBER; i <= GAME_CONFIG.MAX_NUMBER; i++) {
      pool.push(i);
    }
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }
}
