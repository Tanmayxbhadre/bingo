import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, PlusCircle, ArrowRight, Globe, HelpCircle, Sparkles, Volume2, VolumeX, Share2, Bot } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblLogo } from '../components/SkribblLogo.jsx';
import { SkribblAvatarCustomizer } from '../components/SkribblAvatarCustomizer.jsx';
import { PlayerStatsCard } from '../components/PlayerStatsCard.jsx';
import { AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function HomePage() {
  const {
    name,
    avatarIndex,
    avatarColor,
    updateProfile,
    createRoom,
    createBotGame,
    joinRoom,
    publicRooms,
    fetchPublicRooms,
    connected,
    error,
    clearError,
    isMuted,
    toggleSound,
  } = useGame();

  const [inputName, setInputName] = useState(name);
  const [currentAvatarIdx, setCurrentAvatarIdx] = useState(avatarIndex);
  const [currentColor, setCurrentColor] = useState(avatarColor);
  const [joinCode, setJoinCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [turnDuration, setTurnDuration] = useState(45);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  // Global keyboard shortcuts (M to mute)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSound]);

  const handleRandomize = () => {
    sounds.playPop();
    const randomAvatarIdx = Math.floor(Math.random() * AVATARS.length);
    const randomColor = SKRIBBL_COLORS[Math.floor(Math.random() * SKRIBBL_COLORS.length)];

    setCurrentAvatarIdx(randomAvatarIdx);
    setCurrentColor(randomColor);
    updateProfile(inputName, randomAvatarIdx, randomColor);
  };

  const handleNameChange = (e) => {
    setInputName(e.target.value);
  };

  const handleNameBlur = () => {
    updateProfile(inputName.trim() || 'Player', currentAvatarIdx, currentColor);
  };

  const handleAvatarChange = (idx) => {
    setCurrentAvatarIdx(idx);
    updateProfile(inputName, idx, currentColor);
  };

  const handleColorChange = (col) => {
    setCurrentColor(col);
    updateProfile(inputName, currentAvatarIdx, col);
  };

  // Quick Play button (like skribbl.io green Play button)
  // Either joins first available public room or creates one!
  const handleQuickPlay = async () => {
    try {
      setIsLoading(true);
      sounds.playPop();
      updateProfile(inputName.trim() || 'Player', currentAvatarIdx, currentColor);

      if (publicRooms.length > 0) {
        const targetRoom = publicRooms[0];
        const res = await joinRoom(targetRoom.code);
        if (res?.success) {
          navigate(`/room/${res.roomCode}`);
          return;
        }
      }

      // If no public rooms available, create one
      const res = await createRoom({
        turnDurationSec: 45,
        maxPlayers: 8,
        isPublic: true,
      });

      if (res?.success) {
        navigate(`/room/${res.roomCode}`);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVsBot = async () => {
    try {
      setIsLoading(true);
      sounds.playPop();
      updateProfile(inputName.trim() || 'Player', currentAvatarIdx, currentColor);

      const res = await createBotGame();
      if (res?.success) {
        navigate(`/room/${res.roomCode}`);
      }
    } catch (err) {
      console.error('Play vs bot error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e?.preventDefault();
    try {
      setIsLoading(true);
      sounds.playPop();
      updateProfile(inputName.trim() || 'Host', currentAvatarIdx, currentColor);

      const res = await createRoom({
        turnDurationSec: Number(turnDuration),
        maxPlayers: Number(maxPlayers),
        isPublic,
      });

      if (res?.success) {
        setShowCreateModal(false);
        navigate(`/room/${res.roomCode}`);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSubmit = async (codeToJoin) => {
    const code = (codeToJoin || joinCode).trim().toUpperCase();
    if (!code) return;

    try {
      setIsLoading(true);
      sounds.playPop();
      updateProfile(inputName.trim() || 'Player', currentAvatarIdx, currentColor);

      const res = await joinRoom(code);
      if (res?.success) {
        navigate(`/room/${res.roomCode}`);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-5 text-slate-800 select-none relative z-10">
      {/* Top Floating Controls Bar */}
      <header className="fixed top-3 right-3 sm:top-4 sm:right-5 z-40 flex items-center space-x-2">
        {/* Rules Guide Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setShowRulesModal(true);
          }}
          className="bg-white/90 hover:bg-white text-[#072847] p-2 sm:px-3 sm:py-2 rounded-2xl border-2 sm:border-3 border-[#0b2c4d] shadow-[0_4px_0_#072847] flex items-center space-x-1.5 font-black text-xs transition-all active:translate-y-0.5 cursor-pointer"
          title="How to Play / Rules"
        >
          <HelpCircle className="w-4 h-4 text-[#0284c7] stroke-[2.5]" />
          <span className="hidden sm:inline">How to Play</span>
        </button>

        {/* Mute Audio Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          className={`p-2 sm:px-3 sm:py-2 rounded-2xl border-2 sm:border-3 border-[#0b2c4d] shadow-[0_4px_0_#072847] flex items-center space-x-1.5 font-black text-xs transition-all active:translate-y-0.5 cursor-pointer ${
            isMuted
              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
          }`}
          title={isMuted ? 'Unmute Sound FX (M)' : 'Mute Sound FX (M)'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 stroke-[2.5]" /> : <Volume2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
        </button>
      </header>

      <div className="max-w-md mx-auto w-full my-auto flex flex-col items-center pt-2 sm:pt-4">
        {/* 3D Bingo Logo & Live Matchmaking Ribbon */}
        <div className="text-center mb-3 sm:mb-4 flex flex-col items-center">
          <SkribblLogo size="large" />

          {/* Glowing Live Party Ribbon */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-yellow-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full border-3 border-[#0b2c4d] shadow-[0_4px_0_#072847,0_10px_20px_rgba(245,158,11,0.3)] mt-2 transform hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-700 animate-ping inline-block" />
            <span>FAST 5×5 MULTIPLAYER RACER</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-3 w-full bg-[#e74c3c] text-white p-3 rounded-2xl border-3 border-[#962d22] font-black text-xs text-center shadow-lg animate-pop">
            <span>{error}</span>
            <button onClick={clearError} className="underline ml-2.5 hover:text-yellow-200">
              Dismiss
            </button>
          </div>
        )}

        {/* Server Cold-Start Awakening Banner */}
        {!connected && (
          <div className="mb-3 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-yellow-950 p-2.5 rounded-2xl border-3 border-amber-600 font-black text-xs text-center shadow-md animate-pulse flex items-center justify-center space-x-2">
            <span>⚡ Waking up game server... (first load may take ~30s)</span>
          </div>
        )}

        {/* Central Arcade Game Cabinet Card */}
        <div className="w-full bg-gradient-to-b from-white via-white to-sky-50/60 rounded-[32px] sm:rounded-[36px] border-4 border-[#0b2c4d] shadow-[0_12px_0_#072847,0_24px_45px_rgba(7,43,77,0.35)] p-4 sm:p-6 space-y-3 sm:space-y-3.5 relative overflow-hidden">
          {/* Subtle Top Gloss Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-300 via-yellow-300 to-emerald-300" />

          {/* 3D Character Hero Stage Customizer */}
          <SkribblAvatarCustomizer
            avatarIndex={currentAvatarIdx}
            avatarColor={currentColor}
            onChangeAvatar={handleAvatarChange}
            onChangeColor={handleColorChange}
            onRandomize={handleRandomize}
          />

          {/* Gamer Tag Input Box */}
          <div className="relative">
            <input
              type="text"
              value={inputName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              maxLength={16}
              placeholder="Enter your nickname"
              className="w-full bg-white border-3 sm:border-4 border-[#0b2c4d] text-[#0b2c4d] placeholder-slate-400 font-black text-center text-lg sm:text-xl rounded-2xl py-2.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.06),0_3px_0_rgba(11,44,77,0.12)] focus:outline-none focus:ring-4 focus:ring-yellow-400/70 focus:border-[#0084ff] transition-all tracking-wide"
            />
          </div>

          {/* Massive 3D Live Play Button (The Juice) */}
          <button
            type="button"
            onClick={handleQuickPlay}
            disabled={isLoading}
            className="w-full btn-arcade-green arcade-shimmer py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black flex flex-col items-center justify-center tracking-wider cursor-pointer group active:scale-98"
          >
            <div className="flex items-center space-x-2">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white group-hover:scale-110 transition-transform" />
              <span>{isLoading ? 'ENTERING...' : 'PLAY LIVE NOW!'}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-white/90 tracking-normal mt-0.5">
              ⚡ Instant Online Match • First to 5 Lines Wins
            </span>
          </button>

          {/* Instant Solo Play vs AI Bot Button */}
          <button
            type="button"
            onClick={handlePlayVsBot}
            disabled={isLoading}
            className="w-full btn-arcade-purple py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-black flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            <span>{isLoading ? 'Starting AI...' : 'Play vs AI Bot (Solo Practice)'}</span>
          </button>

          {/* Action Row: Create Private Room & Browse Lobbies */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowCreateModal(true);
              }}
              className="skribbl-btn-blue py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ Create Room</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                fetchPublicRooms();
                setShowPublicModal(true);
              }}
              className="skribbl-btn-orange py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Globe className="w-4 h-4 stroke-[2.5]" />
              <span>Lobbies ({publicRooms.length})</span>
            </button>
          </div>

          {/* Join by Room Code Box */}
          <div className="pt-2.5 border-t-2 border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                maxLength={6}
                className="flex-1 bg-white border-3 border-[#0b2c4d] text-center font-mono font-black text-[#0b2c4d] placeholder-slate-400 rounded-xl py-2 uppercase text-sm sm:text-base focus:outline-none focus:ring-3 focus:ring-[#0084ff] shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleJoinSubmit()}
                disabled={joinCode.trim().length < 4 || isLoading}
                className="skribbl-btn-green px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
              >
                <span>Join</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Player Stats & Win Streak Widget */}
        <div className="w-full mt-3.5">
          <PlayerStatsCard />
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-3 gap-2 w-full mt-3 select-none">
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border-2 border-[#0b2c4d] p-2 text-center shadow-[0_3px_0_#072847]">
            <span className="text-base block">⚡</span>
            <span className="text-[10px] font-black text-[#072847] block leading-tight">Instant &amp; Free</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border-2 border-[#0b2c4d] p-2 text-center shadow-[0_3px_0_#072847]">
            <span className="text-base block">🏆</span>
            <span className="text-[10px] font-black text-[#072847] block leading-tight">Win Streaks</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border-2 border-[#0b2c4d] p-2 text-center shadow-[0_3px_0_#072847]">
            <span className="text-base block">📱</span>
            <span className="text-[10px] font-black text-[#072847] block leading-tight">Mobile Ready</span>
          </div>
        </div>

        {/* Rules Guide Modal */}
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
            <div className="bg-gradient-to-b from-white via-white to-sky-50 border-4 border-[#0b2c4d] rounded-[32px] p-6 max-w-sm w-full text-[#072847] shadow-[0_12px_0_#072847,0_25px_40px_rgba(0,0,0,0.35)] space-y-4 relative">
              <div className="text-center">
                <div className="inline-block bg-yellow-100 text-yellow-900 font-black text-xs uppercase px-3 py-1 rounded-full border border-yellow-300 mb-1">
                  📖 QUICK RULEBOOK
                </div>
                <h3 className="text-2xl font-black text-[#072847]">How to Play Bingo.io</h3>
              </div>

              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-2xl border border-blue-200">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <span className="font-black text-[#0b2c4d] block">1. 5×5 Card Setup</span>
                    Every player receives a 5×5 grid with numbers 1 to 25 randomly arranged.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <span className="font-black text-amber-950 block">2. Call &amp; Stamp Numbers</span>
                    Players take turns calling a number. When a number is called, tap it on your card to stamp it <span className="text-rose-600 font-black">✕</span>!
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <span className="font-black text-emerald-950 block">3. Race to 5 Lines</span>
                    Complete 5 full lines (horizontal, vertical, or diagonal). First player to hit 5 lines yells <span className="text-emerald-700 font-black">BINGO</span> and wins!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setShowRulesModal(false);
                }}
                className="w-full skribbl-btn-green py-3 rounded-2xl text-sm font-black cursor-pointer"
              >
                Got It! Let's Play 🎮
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-white/80 mt-4 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-3 text-[11px] font-bold">
            <button
              onClick={() => {
                sounds.playPop();
                const shareData = {
                  title: 'Bingo.io - Live Multiplayer Bingo',
                  text: 'Play live 5x5 Bingo online with friends! No install required.',
                  url: window.location.origin,
                };
                if (navigator.share) {
                  navigator.share(shareData).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  alert('Game link copied to clipboard!');
                }
              }}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white flex items-center space-x-1 cursor-pointer transition-all border border-white/20"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Game</span>
            </button>
            <span className="text-white/40">•</span>
            <span>📱 Works in browser & mobile</span>
          </div>
          <span className="text-[10px] text-white/40">
            Bingo.io v1.2 — Live 5x5 skribbl-style multiplayer Bingo
          </span>
          <div className="flex items-center space-x-2 text-[10px] text-white/50 pt-0.5">
            <button onClick={() => navigate('/privacy')} className="hover:text-white hover:underline cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => navigate('/terms')} className="hover:text-white hover:underline cursor-pointer">Terms of Service</button>
          </div>
        </footer>
      </div>

      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="bg-gradient-to-b from-white via-white to-sky-50/50 border-4 border-[#0b2c4d] rounded-[32px] p-6 max-w-sm w-full text-[#072847] shadow-[0_12px_0_#072847,0_25px_40px_rgba(0,0,0,0.35)] space-y-4">
            <h2 className="text-2xl font-black text-center text-[#072847]">
              Create Private Room
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Turn Timer: <span className="text-[#0284c7] font-black">{turnDuration} seconds</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setTurnDuration(sec)}
                      className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                        turnDuration === sec
                          ? 'bg-[#0284c7] text-white border-[#0369a1] shadow-[0_3px_0_#072847] -translate-y-0.5'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Max Players: <span className="text-[#0284c7] font-black">{maxPlayers}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  className="w-full accent-[#0284c7] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border-2 border-slate-200">
                <span className="font-black text-xs text-[#072847]">Public Room</span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 accent-[#22c55e] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-xl text-xs border-2 border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 skribbl-btn-green py-3 rounded-xl text-sm font-black cursor-pointer shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC ROOMS MODAL */}
      {showPublicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="bg-gradient-to-b from-white via-white to-sky-50/50 border-4 border-[#0b2c4d] rounded-[32px] p-6 max-w-sm w-full text-[#072847] shadow-[0_12px_0_#072847,0_25px_40px_rgba(0,0,0,0.35)] space-y-3.5">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2.5">
              <span className="font-black text-xl text-[#072847]">Public Rooms</span>
              <button
                onClick={fetchPublicRooms}
                className="text-xs bg-white hover:bg-slate-100 border-2 border-slate-200 px-3 py-1 rounded-xl font-black text-[#0284c7] cursor-pointer shadow-sm"
              >
                Refresh
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {publicRooms.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic font-semibold">
                  No public rooms waiting. Create one now!
                </div>
              ) : (
                publicRooms.map((room) => (
                  <div
                    key={room.code}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-sm"
                  >
                    <div>
                      <div className="font-mono font-black text-[#0084ff] text-base">{room.code}</div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {room.playerCount} / {room.maxPlayers} Players
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowPublicModal(false);
                        handleJoinSubmit(room.code);
                      }}
                      className="skribbl-btn-green px-3 py-1.5 rounded-xl text-xs"
                    >
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowPublicModal(false)}
              className="w-full bg-slate-200 font-bold py-2 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
