import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crown, Play, Copy, Check, Users, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { Header } from '../components/Header.jsx';
import { BingoCard } from '../components/BingoCard.jsx';
import { NumberCaller } from '../components/NumberCaller.jsx';
import { LineProgress } from '../components/LineProgress.jsx';
import { PlayerSidebar } from '../components/PlayerSidebar.jsx';
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
    lastMarkedCell,
    error,
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // If user lands directly on /room/:code without joining yet, join automatically
  useEffect(() => {
    if (!roomState && roomCode && connected) {
      joinRoom(roomCode).catch((err) => {
        // failed to join
      });
    }
  }, [roomCode, roomState, connected]);

  // If user has left room or room was deleted
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
        <Header />
        <div className="my-auto text-center space-y-3 bg-white/10 p-8 rounded-3xl border border-white/15 backdrop-blur-md">
          <div className="text-4xl animate-bounce">🎯</div>
          <h2 className="text-2xl font-bold">Connecting to Room {roomCode}...</h2>
          <p className="text-slate-300 text-sm">Please wait while we set up your 5×5 card.</p>
          {error && <p className="text-rose-400 font-bold text-xs">{error}</p>}
        </div>
      </div>
    );
  }

  const isLobby = roomState.status === ROOM_STATUS.LOBBY;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation Header */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 lg:p-6">
        {isLobby ? (
          /* ==================== LOBBY VIEW ==================== */
          <div className="max-w-3xl mx-auto space-y-6 animate-pop">
            {/* Room Invitation Card */}
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl">
              <span className="text-xs uppercase tracking-widest font-black text-yellow-300">
                Multiplayer Lobby
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-3">
                Waiting for Players to Join
              </h2>

              {/* Big Room Code Display */}
              <div className="inline-flex items-center space-x-3 bg-black/30 border-2 border-white/20 px-6 py-3 rounded-2xl mb-4">
                <span className="text-slate-300 text-xs font-bold uppercase">Room Code:</span>
                <span className="font-mono text-3xl sm:text-4xl font-black text-yellow-300 tracking-wider">
                  {roomState.roomCode}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-xl text-white transition-all active:scale-95 ml-2"
                  title="Copy Invitation Link"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                </button>
                <div className="text-xs text-slate-300">
                  Calling Speed: <span className="font-bold text-yellow-300">{roomState.callIntervalSec}s</span>
                </div>
              </div>
            </div>

            {/* Players Grid in Lobby */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-yellow-300" />
                  <h3 className="font-extrabold text-base">Connected Players ({roomState.playerCount})</h3>
                </div>
                <span className="text-xs text-slate-300">
                  Max: {roomState.maxPlayers}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {roomState.players.map((p) => {
                  const isMe = p.sessionToken === sessionToken;
                  return (
                    <div
                      key={p.sessionToken}
                      className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                        isMe
                          ? 'bg-white/25 border-yellow-300/80 shadow-md scale-102'
                          : 'bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="text-4xl mb-2 drop-shadow-sm">{p.avatar}</div>
                      <div className="font-bold text-sm text-center truncate max-w-full">
                        {p.name}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {p.isHost && (
                          <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                            <Crown className="w-2.5 h-2.5 fill-yellow-950" />
                            <span>HOST</span>
                          </span>
                        )}
                        {isMe && (
                          <span className="bg-pink-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Start Game Action or Waiting Notice */}
            <div className="text-center pt-2">
              {roomState.isHost ? (
                <button
                  onClick={handleStartGame}
                  disabled={isStarting}
                  className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-emerald-950 font-black text-lg py-4 px-10 rounded-2xl shadow-bouncy active:translate-y-1 transition-all inline-flex items-center space-x-2"
                >
                  <Play className="w-6 h-6 fill-emerald-950" />
                  <span>{isStarting ? 'Starting...' : 'Start Game Now!'}</span>
                </button>
              ) : (
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl inline-block border border-white/15 text-white animate-pulse">
                  <span className="font-bold text-sm">
                    ⏳ Waiting for the room host to start the game...
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================== ACTIVE GAMEPLAY VIEW ==================== */
          <div className="flex flex-col lg:flex-row gap-5 items-start justify-center">
            {/* Left / Center Area: Bingo Board & Callers */}
            <div className="flex-1 w-full space-y-4">
              {/* Prominent Number Caller Component */}
              <NumberCaller
                currentNumber={roomState.currentNumber}
                calledNumbers={roomState.calledNumbers}
                callIntervalSec={roomState.callIntervalSec}
              />

              {/* 5-Line Progress Bar */}
              <LineProgress
                completedCount={roomState.myCompletedCount}
                completedLines={roomState.myCompletedLines}
              />

              {/* Authoritative 5×5 Bingo Card */}
              <BingoCard
                card={roomState.myCard}
                winningCells={roomState.myWinningCells}
                lastMarkedIndex={lastMarkedCell}
              />
            </div>

            {/* Right Area: Player List & Live Chat */}
            <PlayerSidebar />
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
