import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Copy, Check, Share2, Crown, Home, Palette, Pencil } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblHeader } from '../components/SkribblHeader.jsx';
import { SkribblBingoCard } from '../components/SkribblBingoCard.jsx';
import { SkribblPlayerList } from '../components/SkribblPlayerList.jsx';
import { SkribblChat } from '../components/SkribblChat.jsx';
import { WinnerModal } from '../components/WinnerModal.jsx';
import { EmojiReactionTray } from '../components/EmojiReactionTray.jsx';
import { CustomizeProfileModal } from '../components/CustomizeProfileModal.jsx';
import { CharacterAvatar } from '../components/CharacterAvatar.jsx';
import { ROOM_STATUS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const {
    roomState,
    joinRoom,
    leaveRoom,
    startGame,
    connected,
    sessionToken,
    error,
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [joinFailed, setJoinFailed] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [mobileTab, setMobileTab] = useState('card'); // 'card' | 'players' | 'chat'
  const hasPromptedCustomizeRef = useRef(false);

  useEffect(() => {
    if (roomCode && connected && !joinFailed) {
      if (!roomState || roomState.roomCode !== roomCode) {
        joinRoom(roomCode).catch(() => {
          setJoinFailed(true);
        });
      }
    }
  }, [roomCode, roomState?.roomCode, connected, joinFailed]);

  useEffect(() => {
    if (!roomState && !roomCode) {
      navigate('/', { replace: true });
    }
  }, [roomState, roomCode, navigate]);

  // If player joined directly via link with default name, auto-prompt them to customize
  useEffect(() => {
    if (roomState && roomState.status === ROOM_STATUS.LOBBY) {
      const me = roomState.players?.find((p) => p.sessionToken === sessionToken);
      if (me && me.name === 'Player' && !hasPromptedCustomizeRef.current) {
        hasPromptedCustomizeRef.current = true;
        setShowCustomizeModal(true);
      }
    }
  }, [roomState, sessionToken]);

  const handleCopyLink = () => {
    sounds.playPop();
    const url = `${window.location.origin}/room/${roomCode || roomState?.roomCode}`;
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
        <div className="text-center space-y-3.5 bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-7 sm:p-8 text-[#0b2c4d] max-w-sm w-full animate-pop">
          <div className="text-5xl animate-bounce">🎯</div>
          <h2 className="text-2xl font-black">
            {error ? 'Room Notice' : `Joining Room ${roomCode}...`}
          </h2>
          <p className="text-slate-500 font-bold text-xs">
            {error ? 'Could not connect to this room.' : 'Getting your 1–25 card ready!'}
          </p>
          {error && (
            <div className="bg-rose-50 text-rose-700 font-black text-xs p-2.5 rounded-xl border border-rose-200">
              {error}
            </div>
          )}
          <button
            onClick={() => {
              sounds.playPop();
              leaveRoom();
              navigate('/', { replace: true });
            }}
            className="w-full skribbl-btn-blue py-2.5 rounded-2xl text-sm flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
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
            <div className="bg-gradient-to-b from-white via-white to-sky-50/50 rounded-[32px] border-4 border-[#0b2c4d] shadow-[0_10px_0_#072847,0_20px_35px_rgba(7,43,77,0.3)] p-6 sm:p-8 text-center text-[#0b2c4d]">
              <div className="inline-block bg-sky-100 text-[#0284c7] font-black text-xs uppercase px-3 py-1 rounded-full border border-sky-300 mb-2">
                🎮 BINGO.IO GAME LOBBY
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mt-1 mb-4 text-[#072847]">
                Waiting for Players
              </h2>

              {/* Big Room Code Box */}
              <div className="inline-flex items-center space-x-3 bg-white border-3 border-[#0b2c4d] px-6 py-2.5 rounded-2xl mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_3px_0_#072847]">
                <span className="text-xs font-black uppercase text-slate-500">Room Code:</span>
                <span className="font-mono text-3xl font-black text-[#0284c7] tracking-wider">
                  {roomState.roomCode}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="bg-yellow-400 hover:bg-yellow-300 p-2 rounded-xl border-2 border-[#0b2c4d] transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4 text-[#072847]" />}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-3 text-xs font-bold text-slate-600">
                <button
                  onClick={handleCopyLink}
                  className="skribbl-btn-blue px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{copied ? 'Copied Link!' : 'Copy Invite Link'}</span>
                </button>
                <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  Turn Timer: <span className="text-[#0284c7] font-black">{roomState.turnDurationSec}s</span>
                </span>
              </div>
            </div>

            {/* Players in Lobby Grid */}
            <div className="bg-gradient-to-b from-white via-white to-sky-50/50 rounded-[32px] border-4 border-[#0b2c4d] shadow-[0_10px_0_#072847,0_20px_35px_rgba(7,43,77,0.3)] p-5 sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 mb-4 px-1">
                <span className="font-black text-sm text-[#072847] uppercase tracking-wide flex items-center space-x-1.5">
                  <span>👥 Connected Players</span>
                  <span className="bg-sky-100 text-[#0284c7] text-xs px-2 py-0.5 rounded-full border border-sky-300">
                    {roomState.playerCount}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setShowCustomizeModal(true);
                  }}
                  className="skribbl-btn-yellow text-xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer"
                  title="Customize your character & name"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Customize Character ✏️</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {roomState.players.map((p) => {
                  const isMe = p.sessionToken === sessionToken;
                  return (
                    <div
                      key={p.sessionToken}
                      onClick={isMe ? () => { sounds.playPop(); setShowCustomizeModal(true); } : undefined}
                      className={`flex flex-col items-center p-3 rounded-2xl border-3 transition-all ${
                        isMe
                          ? 'bg-blue-50 border-blue-400 shadow-sm cursor-pointer hover:scale-105 hover:border-[#0084ff]'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                      title={isMe ? 'Click to customize character & name!' : undefined}
                    >
                      <div className="mb-1 flex-shrink-0">
                        <CharacterAvatar id={p.avatar} color={p.color || '#55b338'} size={48} />
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
                          <span className="bg-[#0084ff] text-white text-[9px] font-black px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                            <Pencil className="w-2 h-2" />
                            <span>YOU (EDIT)</span>
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

            {/* Quick Lobby Reactions */}
            <div className="pt-2">
              <EmojiReactionTray />
            </div>
          </div>
        ) : (
          /* ==================== SKRIBBL 3-COLUMN GAMEPLAY VIEW ==================== */
          <div className="flex flex-col pt-1">
            {/* Mobile Tab Toggle Pills (visible only on mobile/tablet < lg) */}
            <div className="flex lg:hidden items-center justify-center space-x-2 mb-2.5">
              <button
                type="button"
                onClick={() => setMobileTab('card')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                  mobileTab === 'card'
                    ? 'bg-yellow-400 text-yellow-950 border-[#0b2c4d] shadow-[0_3px_0_#08233d]'
                    : 'bg-white/20 text-white border-white/20'
                }`}
              >
                🎯 Bingo Card
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('players')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                  mobileTab === 'players'
                    ? 'bg-yellow-400 text-yellow-950 border-[#0b2c4d] shadow-[0_3px_0_#08233d]'
                    : 'bg-white/20 text-white border-white/20'
                }`}
              >
                👥 Players ({roomState.playerCount})
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('chat')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                  mobileTab === 'chat'
                    ? 'bg-yellow-400 text-yellow-950 border-[#0b2c4d] shadow-[0_3px_0_#08233d]'
                    : 'bg-white/20 text-white border-white/20'
                }`}
              >
                💬 Chat
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start justify-center">
              {/* Left Column: skribbl Player Table */}
              <div className={`w-full lg:w-64 flex-shrink-0 ${mobileTab === 'players' ? 'block' : 'hidden lg:block'}`}>
                <SkribblPlayerList />
              </div>

              {/* Middle Column: Central Game Board & Action Banner */}
              <div className={`flex-1 w-full max-w-lg flex flex-col items-center space-y-2.5 ${mobileTab === 'card' ? 'flex' : 'hidden lg:flex'}`}>
                {/* Turn Callout Banner */}
                <div className="w-full text-center">
                  {isMyTurn ? (
                    <div className="bg-emerald-400 text-emerald-950 border-3 border-[#0b2c4d] shadow-[0_4px_0_#08233d] py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5">
                      <span>✏️</span>
                      <span>Pick any number on your card to call it!</span>
                    </div>
                  ) : currentCalled ? (
                    <div className="bg-amber-300 text-amber-950 border-3 border-[#0b2c4d] shadow-[0_4px_0_#08233d] py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 animate-pulse">
                      <span>👉</span>
                      <span>{turnPlayerName} called [{currentCalled}]! Tap {currentCalled} to stamp ✕!</span>
                    </div>
                  ) : (
                    <div className="bg-white text-[#0b2c4d] border-3 border-[#0b2c4d] shadow-[0_4px_0_#08233d] py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5">
                      <span>⏳</span>
                      <span>Waiting for {turnPlayerName} to choose...</span>
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
                  completedLines={roomState.myCompletedLines || []}
                />
              </div>

              {/* Right Column: skribbl Chat & Called Numbers */}
              <div className={`w-full lg:w-80 flex-shrink-0 ${mobileTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
                <SkribblChat calledNumbers={roomState.calledNumbers} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* WINNER CELEBRATION MODAL */}
      {roomState.winner && (
        <WinnerModal winner={roomState.winner} />
      )}

      {/* CHARACTER / PROFILE CUSTOMIZATION MODAL */}
      <CustomizeProfileModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
      />
    </div>
  );
}
