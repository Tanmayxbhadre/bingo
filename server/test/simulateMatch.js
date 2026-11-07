import { Room } from '../src/game/Room.js';
import { RoomManager } from '../src/services/RoomManager.js';

console.log('🎮 Starting 2-Player Turn-Based Bingo Simulation (skribbl.io style)...\n');

const manager = new RoomManager();
const room = manager.createRoom({
  socketId: 'sock-alice',
  sessionToken: 'token-alice',
  name: 'Alice',
  avatar: '😃',
});

room.addPlayer('sock-bob', 'token-bob', 'Bob', '😎');

console.log(`🏠 Room created: [${room.code}] with Alice and Bob`);

// Start game
room.startGame();
console.log('🚀 Game started! Initial turn player:', room.players.get(room.turnPlayerSessionToken).name);

let round = 1;
while (room.status === 'PLAYING' && round <= 75) {
  const activeToken = room.turnPlayerSessionToken;
  const activePlayer = room.players.get(activeToken);
  const opponentToken = activeToken === 'token-alice' ? 'token-bob' : 'token-alice';
  const opponent = room.players.get(opponentToken);

  // Active player picks an unmarked number from their card to call
  const myUnmarked = activePlayer.card.find((c) => !c.marked && !room.calledNumbersSet.has(c.number));
  if (!myUnmarked) break;

  const calledNum = myUnmarked.number;
  console.log(`\n--- Turn ${round}: ${activePlayer.name} calls [${calledNum}] ---`);

  // 1. Active player calls the number
  const callResult = room.callNumber(activeToken, calledNum);
  console.log(`   ${activePlayer.name} marked [${calledNum}] on their card (${activePlayer.completedCount}/5 lines)`);

  if (callResult.isWinner) {
    console.log(`🏆 BINGO! ${activePlayer.name} won the game with 5 completed lines!`);
    break;
  }

  // 2. Opponent clicks to mark the called number if on their card
  const opponentHasNumber = opponent.card.some((c) => c.number === calledNum);
  if (opponentHasNumber) {
    const markResult = room.markNumber(opponentToken, calledNum);
    console.log(`   👉 ${opponent.name} clicked and marked [${calledNum}] (${opponent.completedCount}/5 lines)`);

    if (markResult.isWinner) {
      console.log(`🏆 BINGO! ${opponent.name} won the game with 5 completed lines!`);
      break;
    }
  } else {
    console.log(`   ℹ️  ${opponent.name} does not have [${calledNum}] on their card`);
  }

  round++;
}

console.log(`\n🎉 Simulation finished! Total turns played: ${round - 1}`);
console.log('Game status:', room.status);
if (room.winner) {
  console.log(`Winner: ${room.winner.name} with ${room.winner.completedCount} lines!`);
}
room.destroy();
