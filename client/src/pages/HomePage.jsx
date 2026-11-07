import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dices, Users, PlusCircle, ArrowRight, Globe, HelpCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { AvatarPicker } from '../components/AvatarPicker.jsx';
import { sounds } from '../services/soundEffects.js';

export function HomePage() {
  const {
    name,
    avatar,
    updateProfile,
    createRoom,
    joinRoom,
    publicRooms,
    fetchPublicRooms,
    error,
    clearError,
  } = useGame();

  const [inputName, setInputName] = useState(name);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [joinCode, setJoinCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Room creation settings
  const [callInterval, setCallInterval] = useState(4);
  const [maxPlayers, setMaxPlayers] = useState(12);
  const [isPublic, setIsPublic] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  const handleRandomizeName = () => {
    sounds.playPop();
    const adjectives = ['Lucky', 'Speedy', 'Sunny', 'Mega', 'Hyper', 'Super', 'Cozy', 'Brave', 'Golden'];
    const nouns = ['Player', 'Panda', 'Tiger', 'Eagle', 'Whiz', 'Star', 'Champion', 'Hero', 'Spark'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
    setInputName(randomName);
    updateProfile(randomName, selectedAvatar);
  };

  const handleAvatarChange = (newAvatar) => {
    setSelectedAvatar(newAvatar);
    updateProfile(inputName, newAvatar);
  };

  const handleNameBlur = () => {
    updateProfile(inputName.trim() || 'Player', selectedAvatar);
  };

  const handleCreateSubmit = async (e) => {
    e?.preventDefault();
    try {
      setIsLoading(true);
      sounds.playPop();
      updateProfile(inputName.trim() || 'Host', selectedAvatar);

      const res = await createRoom({
        callIntervalSec: Number(callInterval),
        maxPlayers: Number(maxPlayers),
        isPublic,
      });

      if (res?.success) {
        setShowCreateModal(false);
        navigate(`/room/${res.roomCode}`);
      }
    } catch (err) {
      // error handled by context
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
      updateProfile(inputName.trim() || 'Player', selectedAvatar);

      const res = await joinRoom(code);
      if (res?.success) {
        navigate(`/room/${res.roomCode}`);
      }
    } catch (err) {
      // error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header / Hero */}
        <div className="text-center my-6 sm:my-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-amber-500 p-1 rounded-3xl shadow-2xl mb-4 transform hover:scale-105 transition-transform">
            <div className="bg-slate-900 px-6 py-2 rounded-[22px] flex items-center space-x-2">
              <span className="text-3xl">🎯</span>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Bingo<span className="text-amber-300">.io</span>
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
            Let's Play Bingo!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-semibold mt-2 max-w-lg mx-auto">
            Play real-time 5×5 multiplayer Bingo with friends. Create a private room or jump into public games!
          </p>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="max-w-md mx-auto mb-6 bg-rose-500 text-white p-3 rounded-2xl flex items-center justify-between font-bold text-xs shadow-lg animate-pop">
            <span>⚠️ {error}</span>
            <button onClick={clearError} className="underline text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Central Gaming Hub Card */}
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          {/* 1. Player Profile Setup */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1.5">
                Your Display Name
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onBlur={handleNameBlur}
                  maxLength={16}
                  placeholder="Enter your name..."
                  className="flex-1 bg-white/20 border-2 border-white/20 focus:border-yellow-400 text-white placeholder-slate-400 rounded-2xl px-4 py-3 font-bold text-base focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  title="Randomize Name"
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 p-3 rounded-2xl shadow-bouncy active:scale-95 transition-all"
                >
                  <Dices className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Avatar Selector */}
            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelect={handleAvatarChange}
            />
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* 2. Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Create Room Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setShowCreateModal(true);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black py-4 px-5 rounded-2xl shadow-bouncy active:translate-y-1 transition-all flex items-center justify-center space-x-2 text-base"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Room</span>
            </button>

            {/* Public Rooms Button */}
            <button
              onClick={() => {
                sounds.playPop();
                fetchPublicRooms();
                setShowPublicModal(true);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black py-4 px-5 rounded-2xl shadow-bouncy active:translate-y-1 transition-all flex items-center justify-center space-x-2 text-base"
            >
              <Globe className="w-5 h-5" />
              <span>Public Games ({publicRooms.length})</span>
            </button>
          </div>

          {/* 3. Join by Room Code Box */}
          <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Have a Room Code?
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ENTER 6-DIGIT CODE"
                maxLength={6}
                className="flex-1 bg-white/15 border border-white/20 focus:border-yellow-400 text-yellow-300 placeholder-slate-400 font-mono font-black text-center tracking-widest text-lg rounded-2xl py-2.5 uppercase focus:outline-none"
              />
              <button
                onClick={() => handleJoinSubmit()}
                disabled={joinCode.trim().length < 4 || isLoading}
                className="bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-emerald-950 font-black px-5 py-3 rounded-2xl shadow-bouncy active:translate-y-0.5 transition-all flex items-center space-x-1"
              >
                <span>Join</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. How To Play Section */}
        <div className="max-w-2xl mx-auto mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-black tracking-wide">How To Play Bingo.io</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/10 p-3.5 rounded-2xl space-y-1.5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-pink-500 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="font-bold text-yellow-300 text-sm">5×5 Unique Card</h3>
              <p className="text-slate-300 leading-relaxed">
                You receive 25 random unique numbers from 1 to 75. Every player's card is independently generated.
              </p>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl space-y-1.5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="font-bold text-yellow-300 text-sm">Automatic Marking</h3>
              <p className="text-slate-300 leading-relaxed">
                The server automatically calls random numbers. Matching numbers on your card are marked immediately without manual effort!
              </p>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl space-y-1.5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="font-bold text-yellow-300 text-sm">5 Lines to Win!</h3>
              <p className="text-slate-300 leading-relaxed">
                Complete ANY 5 lines (rows, columns, or diagonals). The first player to reach 5 completed lines wins BINGO!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-12 mb-4 space-y-1">
        <p>🎯 Bingo.io — Real-time Multiplayer Web Game</p>
        <p className="opacity-60">Server-authoritative game state with Socket.IO</p>
      </footer>

      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="bg-slate-900 border-2 border-white/20 p-6 rounded-3xl max-w-md w-full text-white shadow-2xl space-y-4">
            <h2 className="text-2xl font-black text-yellow-300">Create Private Room</h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Calling Speed */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Number Calling Interval: <span className="text-yellow-300">{callInterval} seconds</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setCallInterval(sec)}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        callInterval === sec
                          ? 'bg-yellow-400 text-yellow-950 shadow-bouncy'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {sec}s {sec === 2 ? '⚡' : sec === 4 ? '👍' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Players */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Max Players: <span className="text-yellow-300">{maxPlayers}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl">
                <div>
                  <span className="font-bold text-sm block">List in Public Games</span>
                  <span className="text-[11px] text-slate-300">Allow other players to join from the homepage</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/15 hover:bg-white/25 text-white font-bold py-3 rounded-2xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3 rounded-2xl shadow-bouncy active:translate-y-0.5 text-sm"
                >
                  {isLoading ? 'Creating...' : 'Create & Enter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC ROOMS BROWSER MODAL */}
      {showPublicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="bg-slate-900 border-2 border-white/20 p-6 rounded-3xl max-w-lg w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-black text-white">Public Rooms</h2>
              </div>
              <button
                onClick={fetchPublicRooms}
                className="text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl text-slate-200"
              >
                Refresh
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {publicRooms.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No public rooms waiting right now. Create one and invite players!
                </div>
              ) : (
                publicRooms.map((room) => (
                  <div
                    key={room.code}
                    className="flex items-center justify-between bg-white/10 p-3 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-yellow-300 text-base">{room.code}</span>
                        <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Waiting in Lobby
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {room.playerCount} / {room.maxPlayers} Players • {room.callIntervalSec}s Speed
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowPublicModal(false);
                        handleJoinSubmit(room.code);
                      }}
                      className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs shadow-bouncy active:scale-95"
                    >
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowPublicModal(false)}
              className="w-full bg-white/15 hover:bg-white/25 text-white font-bold py-2.5 rounded-2xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
