import { GAME_CONFIG } from '../constants/gameConstants.js';

export class BingoEngine {
  /**
   * Generates a 5x5 card with numbers 1 to 25 scrambled randomly.
   * Every player gets all 25 numbers (1..25) in a different shuffled layout.
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

    const cells = [];
    let idx = 0;
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        cells.push({
          index: idx,
          row,
          col,
          number: allNumbers[idx],
          marked: false,
        });
        idx++;
      }
    }

    return cells;
  }

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

    // Verify all 1..25 numbers are present
    if (seen.size !== 25) {
      return { valid: false, reason: 'Card must contain all numbers from 1 to 25' };
    }

    return { valid: true };
  }

  static getLineDefinitions() {
    const lines = [];

    // 5 Rows
    for (let r = 0; r < 5; r++) {
      const cells = [];
      for (let c = 0; c < 5; c++) {
        cells.push(r * 5 + c);
      }
      lines.push({ id: `row-${r}`, type: 'row', name: `Row ${r + 1}`, index: r, cells });
    }

    // 5 Columns
    for (let c = 0; c < 5; c++) {
      const cells = [];
      for (let r = 0; r < 5; r++) {
        cells.push(r * 5 + c);
      }
      lines.push({ id: `col-${c}`, type: 'col', name: `Column ${c + 1}`, index: c, cells });
    }

    // Main diagonal
    const mainDiag = [];
    for (let i = 0; i < 5; i++) {
      mainDiag.push(i * 5 + i);
    }
    lines.push({ id: 'diag-main', type: 'diagonal', name: 'Main Diagonal ↘', cells: mainDiag });

    // Anti diagonal
    const antiDiag = [];
    for (let i = 0; i < 5; i++) {
      antiDiag.push(i * 5 + (4 - i));
    }
    lines.push({ id: 'diag-anti', type: 'diagonal', name: 'Anti Diagonal ↗', cells: antiDiag });

    return lines;
  }

  static markNumber(card, numberToMark) {
    const cell = card.find((c) => c.number === numberToMark);
    if (cell) {
      cell.marked = true;
      return { marked: true, cellIndex: cell.index };
    }
    return { marked: false, cellIndex: -1 };
  }

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

  static canCallNumber(number, calledNumbersSet) {
    if (
      typeof number !== 'number' ||
      number < GAME_CONFIG.MIN_NUMBER ||
      number > GAME_CONFIG.MAX_NUMBER
    ) {
      return { valid: false, reason: `Number must be between ${GAME_CONFIG.MIN_NUMBER} and ${GAME_CONFIG.MAX_NUMBER}` };
    }
    if (calledNumbersSet.has(number)) {
      return { valid: false, reason: `Number ${number} has already been called!` };
    }
    return { valid: true };
  }

  static createCallerPool() {
    const pool = [];
    for (let i = GAME_CONFIG.MIN_NUMBER; i <= GAME_CONFIG.MAX_NUMBER; i++) {
      pool.push(i);
    }
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }

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
}
