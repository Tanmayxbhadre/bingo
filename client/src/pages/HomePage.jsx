import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, PlusCircle, ArrowRight, Globe, HelpCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblLogo } from '../components/SkribblLogo.jsx';
import { SkribblAvatarCustomizer } from '../components/SkribblAvatarCustomizer.jsx';
import { AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function HomePage() {
  const {
    name,
    avatarIndex,
    avatarColor,
    updateProfile,
    createRoom,
    joinRoom,
    publicRooms,
    fetchPublicRooms,
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  const handleRandomize = () => {
    sounds.playPop();
    const adjectives = ['Happy', 'Speedy', 'Cool', 'Lucky', 'Super', 'Cozy', 'Brave', 'Golden'];
    const nouns = ['Player', 'Panda', 'Tiger', 'Artist', 'Star', 'Hero', 'Gamer', 'Doodler'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
    const randomAvatarIdx = Math.floor(Math.random() * AVATARS.length);
    const randomColor = SKRIBBL_COLORS[Math.floor(Math.random() * SKRIBBL_COLORS.length)];

    setInputName(randomName);
    setCurrentAvatarIdx(randomAvatarIdx);
    setCurrentColor(randomColor);
    updateProfile(randomName, randomAvatarIdx, randomColor);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 text-slate-800 select-none">
      <div className="max-w-md mx-auto w-full my-auto flex flex-col items-center">
        {/* skribbl.io Logo */}
        <div className="text-center mb-3">
          <SkribblLogo size="large" />
          <div className="text-white font-extrabold text-xs sm:text-sm mt-1 flex items-center justify-center space-x-1.5 drop-shadow-sm">
            <span>🎉</span>
            <span>Live Multiplayer 5×5 Bingo!</span>
            <span>🎯</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-3 w-full bg-[#e74c3c] text-white p-2.5 rounded-2xl border-2 border-[#962d22] font-black text-xs text-center shadow-md animate-pop">
            <span>{error}</span>
            <button onClick={clearError} className="underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Central skribbl.io Box */}
        <div className="w-full bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-4 sm:p-5 space-y-3">
          {/* Avatar Customizer */}
          <SkribblAvatarCustomizer
            avatarIndex={currentAvatarIdx}
            avatarColor={currentColor}
            onChangeAvatar={handleAvatarChange}
            onChangeColor={handleColorChange}
            onRandomize={handleRandomize}
          />

          {/* Name Input */}
          <div>
            <input
              type="text"
              value={inputName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              maxLength={16}
              placeholder="Enter your name"
              className="w-full bg-[#f4f7fa] border-4 border-[#0b2c4d] text-[#0b2c4d] placeholder-slate-400 font-black text-center text-lg rounded-2xl py-2.5 focus:outline-none focus:ring-4 focus:ring-[#0084ff]/30 transition-all"
            />
          </div>

          {/* Giant skribbl Green Play Button */}
          <button
            onClick={handleQuickPlay}
            disabled={isLoading}
            className="w-full skribbl-btn-green py-3.5 rounded-2xl text-xl font-black flex items-center justify-center space-x-2 tracking-wide cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>{isLoading ? 'Entering...' : 'Play!'}</span>
          </button>

          {/* Action Row: Create Private Room & Public Games */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <button
              onClick={() => {
                sounds.playPop();
                setShowCreateModal(true);
              }}
              className="skribbl-btn-blue py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Room</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                fetchPublicRooms();
                setShowPublicModal(true);
              }}
              className="skribbl-btn-orange py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Rooms ({publicRooms.length})</span>
            </button>
          </div>

          {/* Join by Room Code Box */}
          <div className="pt-2 border-t-2 border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ENTER ROOM CODE"
                maxLength={6}
                className="flex-1 bg-[#f4f7fa] border-3 border-[#0b2c4d] text-center font-mono font-black text-[#0b2c4d] placeholder-slate-400 rounded-xl py-2 uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
              />
              <button
                onClick={() => handleJoinSubmit()}
                disabled={joinCode.trim().length < 4 || isLoading}
                className="skribbl-btn-green px-4 py-2 rounded-xl text-sm font-black flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
              >
                <span>Join</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact How To Play Pill */}
        <div className="mt-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl px-4 py-2 text-white text-[11px] text-center shadow-md">
          <span className="font-black text-yellow-300 mr-1.5">💡 HOW TO PLAY:</span>
          <span className="text-slate-200">
            Take turns calling 1–25 • Tap opponent's number to stamp <span className="font-black text-rose-300">✕</span> • Complete 5 lines to WIN! 🏆
          </span>
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-white/50 mt-2">
          Bingo.io — skribbl.io style multiplayer Bingo
        </footer>
      </div>

      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="bg-white border-4 border-[#0b2c4d] rounded-3xl p-6 max-w-sm w-full text-[#0b2c4d] shadow-[0_8px_0_#08233d] space-y-4">
            <h2 className="text-2xl font-black text-center text-[#0b2c4d]">
              Create Private Room
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Turn Timer: <span className="text-[#0084ff]">{turnDuration} seconds</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setTurnDuration(sec)}
                      className={`py-2 rounded-xl text-xs font-black border-2 transition-all ${
                        turnDuration === sec
                          ? 'bg-[#0084ff] text-white border-[#005bb5] shadow-[0_3px_0_#00458a]'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Max Players: <span className="text-[#0084ff]">{maxPlayers}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  className="w-full accent-[#0084ff] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl border border-slate-300">
                <span className="font-bold text-xs">Public Room</span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 accent-[#55b338] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 skribbl-btn-green py-2.5 rounded-xl text-sm"
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
          <div className="bg-white border-4 border-[#0b2c4d] rounded-3xl p-5 max-w-sm w-full text-[#0b2c4d] shadow-[0_8px_0_#08233d] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
              <span className="font-black text-lg">Public Rooms</span>
              <button
                onClick={fetchPublicRooms}
                className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl font-bold"
              >
                Refresh
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {publicRooms.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  No public rooms waiting. Create one now!
                </div>
              ) : (
                publicRooms.map((room) => (
                  <div
                    key={room.code}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200"
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
