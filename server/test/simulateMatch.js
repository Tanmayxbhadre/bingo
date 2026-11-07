import { Room } from '../src/game/Room.js';
import { RoomManager } from '../src/services/RoomManager.js';

console.log('🎮 2-Player Turn-Based Bingo Simulation (Numbers 1-25 Scrambled)...\n');

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
const alice = room.players.get('token-alice');
const bob = room.players.get('token-bob');

console.log('Alice Card numbers (scrambled 1-25):', alice.card.map((c) => c.number));
console.log('Bob Card numbers   (scrambled 1-25):', bob.card.map((c) => c.number));

let round = 1;
while (room.status === 'PLAYING' && round <= 25) {
  const activeToken = room.turnPlayerSessionToken;
  const activePlayer = room.players.get(activeToken);
  const opponentToken = activeToken === 'token-alice' ? 'token-bob' : 'token-alice';
  const opponent = room.players.get(opponentToken);

  // Active player picks an unmarked number from their card to call
  const myUnmarked = activePlayer.card.find((c) => !c.marked);
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

  // 2. Opponent clicks to mark the called number on their card! (In 1..25 mode, opponent ALWAYS has it!)
  const opponentHasNumber = opponent.card.some((c) => c.number === calledNum);
  if (opponentHasNumber) {
    const markResult = room.markNumber(opponentToken, calledNum);
    console.log(`   👉 ${opponent.name} clicked and marked [${calledNum}] (${opponent.completedCount}/5 lines)`);

    if (markResult.isWinner) {
      console.log(`🏆 BINGO! ${opponent.name} won the game with 5 completed lines!`);
      break;
    }
  }

  round++;
}

console.log(`\n🎉 Simulation finished! Total turns played: ${round}`);
console.log('Game status:', room.status);
if (room.winner) {
  console.log(`Winner: ${room.winner.name} with ${room.winner.completedCount} lines!`);
}
room.destroy();
