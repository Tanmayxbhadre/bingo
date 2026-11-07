import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Copy, Check, Share2, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblHeader } from '../components/SkribblHeader.jsx';
import { SkribblBingoCard } from '../components/SkribblBingoCard.jsx';
import { SkribblPlayerList } from '../components/SkribblPlayerList.jsx';
import { SkribblChat } from '../components/SkribblChat.jsx';
import { WinnerModal } from '../components/WinnerModal.jsx';
import { ROOM_STATUS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const {
    roomState,
    joinRoom,
    startGame,
    connected,
    sessionToken,
    error,
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (roomCode && connected) {
      if (!roomState || roomState.roomCode !== roomCode) {
        joinRoom(roomCode).catch(() => {});
      }
    }
  }, [roomCode, roomState?.roomCode, connected]);

  useEffect(() => {
    if (!roomState && !roomCode) {
      navigate('/');
    }
  }, [roomState, roomCode, navigate]);

  const handleCopyLink = () => {
    sounds.playPop();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = async () => {
    try {
      setIsStarting(true);
      sounds.playPop();
      await startGame();
    } catch (e) {
    } finally {
      setIsStarting(false);
    }
  };

  if (!roomState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center space-y-3 bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-8 text-[#0b2c4d] max-w-sm w-full">
          <div className="text-5xl animate-bounce">🎯</div>
          <h2 className="text-2xl font-black">Joining Room {roomCode}...</h2>
          <p className="text-slate-500 font-bold text-xs">Getting your 1–25 card ready!</p>
          {error && <p className="text-rose-500 font-black text-xs">{error}</p>}
        </div>
      </div>
    );
  }

  const isLobby = roomState.status === ROOM_STATUS.LOBBY;
  const isMyTurn = roomState.isMyTurn;
  const turnPlayerName = roomState.turnPlayerName || 'Opponent';
  const currentCalled = roomState.currentCalledNumber;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* skribbl.io Top Bar Header */}
      <SkribblHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full p-2 sm:p-4">
        {isLobby ? (
          /* ==================== SKRIBBL LOBBY VIEW ==================== */
          <div className="max-w-2xl mx-auto space-y-4 animate-pop my-auto pt-6">
            <div className="bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-6 sm:p-8 text-center text-[#0b2c4d]">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                skribbl.io Game Lobby
              </div>
              <h2 className="text-3xl font-black mt-1 mb-3">
                Waiting for Players
              </h2>

              {/* Big Room Code Box */}
              <div className="inline-flex items-center space-x-3 bg-[#f0f4f8] border-3 border-[#0b2c4d] px-6 py-2.5 rounded-2xl mb-3 shadow-inner">
                <span className="text-xs font-black uppercase text-slate-500">Room Code:</span>
                <span className="font-mono text-3xl font-black text-[#0084ff] tracking-wider">
                  {roomState.roomCode}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="bg-white hover:bg-slate-100 p-2 rounded-xl border-2 border-[#0b2c4d] transition-all active:scale-95"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#0b2c4d]" />}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-3 text-xs font-bold text-slate-600">
                <button
                  onClick={handleCopyLink}
                  className="skribbl-btn-blue px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Invite Link'}</span>
                </button>
                <span>Turn Timer: <span className="text-[#0084ff] font-black">{roomState.turnDurationSec}s</span></span>
              </div>
            </div>

            {/* Players in Lobby Grid */}
            <div className="bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_6px_0_#08233d] p-5">
              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 mb-3 px-1">
                <span className="font-black text-sm text-[#0b2c4d] uppercase tracking-wide">
                  Connected Players ({roomState.playerCount})
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Max: {roomState.maxPlayers}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {roomState.players.map((p) => {
                  const isMe = p.sessionToken === sessionToken;
                  return (
                    <div
                      key={p.sessionToken}
                      className={`flex flex-col items-center p-3 rounded-2xl border-3 transition-all ${
                        isMe ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl border-2 border-[#0b2c4d] flex items-center justify-center text-3xl mb-1 shadow-sm"
                        style={{ backgroundColor: p.color || '#55b338' }}
                      >
                        {p.avatar}
                      </div>
                      <span className="font-extrabold text-xs text-[#0b2c4d] truncate max-w-full">
                        {p.name}
                      </span>
                      <div className="flex items-center space-x-1 mt-0.5">
                        {p.isHost && (
                          <span className="bg-yellow-400 text-yellow-950 text-[9px] font-black px-1.5 py-0.2 rounded border border-yellow-600 flex items-center space-x-0.5">
                            <Crown className="w-2.5 h-2.5 fill-yellow-950" />
                            <span>HOST</span>
                          </span>
                        )}
                        {isMe && (
                          <span className="bg-[#0084ff] text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start Game Action */}
            <div className="text-center pt-2">
              {roomState.isHost ? (
                <button
                  onClick={handleStartGame}
                  disabled={isStarting}
                  className="skribbl-btn-green py-3.5 px-10 rounded-2xl text-xl inline-flex items-center space-x-2 tracking-wide"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{isStarting ? 'Starting...' : 'Start Game!'}</span>
                </button>
              ) : (
                <div className="bg-white/10 text-white font-extrabold text-sm py-3 px-6 rounded-2xl border-2 border-white/20 inline-block animate-pulse">
                  ⏳ Waiting for the room host to start the game...
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================== SKRIBBL 3-COLUMN GAMEPLAY VIEW ==================== */
          <div className="flex flex-col lg:flex-row gap-3.5 items-stretch justify-center pt-1">
            {/* Left Column: skribbl Player Table */}
            <div className="w-full lg:w-60 flex-shrink-0">
              <SkribblPlayerList />
            </div>

            {/* Middle Column: Central Game Board & Action Banner */}
            <div className="flex-1 w-full max-w-xl flex flex-col items-center space-y-2.5">
              {/* Turn Callout Banner */}
              <div className="w-full text-center">
                {isMyTurn ? (
                  <div className="bg-emerald-400 text-emerald-950 border-3 border-[#0b2c4d] shadow-[0_4px_0_#08233d] p-2.5 rounded-2xl font-black text-xs sm:text-sm animate-pulse">
                    <span>✏️ YOUR TURN! Click any number on your card to call it!</span>
                  </div>
                ) : currentCalled ? (
                  <div className="bg-yellow-300 text-yellow-950 border-3 border-[#0b2c4d] shadow-[0_4px_0_#08233d] p-2.5 rounded-2xl font-black text-xs sm:text-sm">
                    <span>📢 {turnPlayerName} called [{currentCalled}]! Click {currentCalled} on your card to mark it!</span>
                  </div>
                ) : (
                  <div className="bg-white text-[#0b2c4d] border-3 border-[#0b2c4d] shadow-[0_4px_0_#08233d] p-2.5 rounded-2xl font-black text-xs sm:text-sm">
                    <span>⏳ Waiting for {turnPlayerName} to choose a number...</span>
                  </div>
                )}
              </div>

              {/* 5x5 skribbl Bingo Card */}
              <SkribblBingoCard
                card={roomState.myCard}
                isMyTurn={isMyTurn}
                currentCalledNumber={currentCalled}
                calledNumbers={roomState.calledNumbers}
                winningCells={roomState.myWinningCells}
                completedCount={roomState.myCompletedCount}
              />
            </div>

            {/* Right Column: skribbl Chat & Called Numbers */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <SkribblChat calledNumbers={roomState.calledNumbers} />
            </div>
          </div>
        )}
      </main>

      {/* WINNER CELEBRATION MODAL */}
      {roomState.winner && (
        <WinnerModal winner={roomState.winner} />
      )}
    </div>
  );
}
