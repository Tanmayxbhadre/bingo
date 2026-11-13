import React, { useState, useEffect, useRef } from 'react';
import { Users, Crown, Send, MessageSquare, Smile } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { CharacterAvatar } from './CharacterAvatar.jsx';
import { sounds } from '../services/soundEffects.js';

export function PlayerSidebar() {
  const { roomState, sendChatMessage, sessionToken } = useGame();
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef(null);

  const players = roomState?.players || [];
  const messages = roomState?.chatMessages || [];

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isSending) return;

    try {
      setIsSending(true);
      sounds.playPop();
      await sendChatMessage(chatInput.trim());
      setChatInput('');
    } catch (err) {
      // rate limit or error
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickEmoji = (emoji) => {
    setChatInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col space-y-4">
      {/* 1. Players List Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/15 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-yellow-300" />
            <span className="font-extrabold text-sm tracking-wide">Players</span>
          </div>
          <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {players.length} {players.length === 1 ? 'Player' : 'Players'}
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {players.map((p) => {
            const isMe = p.sessionToken === sessionToken;
            return (
              <div
                key={p.sessionToken}
                className={`flex items-center justify-between p-2 rounded-2xl transition-colors ${
                  isMe ? 'bg-white/25 border border-white/30' : 'bg-white/10'
                } ${!p.isOnline ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="flex-shrink-0">
                    <CharacterAvatar id={p.avatar} color={p.color || '#55b338'} size={32} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-sm leading-tight text-white">
                        {p.name}
                      </span>
                      {p.isBot && <span className="text-[10px] bg-purple-500 text-white font-black px-1.5 py-0.2 rounded-md">BOT</span>}
                      {isMe && <span className="text-[10px] bg-yellow-400 text-yellow-950 font-black px-1.5 py-0.2 rounded-md">YOU</span>}
                      {p.isHost && (
                        <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" title="Host" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {p.isOnline ? 'Online' : 'Disconnected...'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="bg-pink-500/80 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow-sm">
                    {p.completedCount || 0}/5 Lines
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Live Room Chat */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/15 text-white shadow-xl flex-1 flex flex-col h-72 lg:h-80">
        <div className="flex items-center space-x-2 mb-2.5 border-b border-white/10 pb-2">
          <MessageSquare className="w-4 h-4 text-pink-400" />
          <span className="font-extrabold text-sm tracking-wide">Live Chat</span>
        </div>

        {/* Message Log */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2 scrollbar-thin text-xs"
        >
          {messages.length === 0 ? (
            <div className="text-slate-400 text-center py-8 italic">
              Say hello to everyone in the room! 👋
            </div>
          ) : (
            messages.map((m) => {
              if (m.isSystem) {
                return (
                  <div key={m.id} className="text-center py-1">
                    <span className="inline-block bg-yellow-400/20 text-yellow-200 border border-yellow-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                      {m.text}
                    </span>
                  </div>
                );
              }

              const isMe = m.sessionToken === sessionToken;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1 text-[10px] text-slate-300 mb-0.5">
                    <span>{m.senderAvatar}</span>
                    <span className="font-bold">{m.senderName}</span>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-2xl max-w-[85%] break-words font-medium shadow-sm ${
                      isMe
                        ? 'bg-pink-500 text-white rounded-tr-none'
                        : 'bg-white/20 text-white rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="flex items-center space-x-1 mb-2 px-1">
          {['🎉', '👏', '🎯', '🔥', '😱', '🍀'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleQuickEmoji(emoji)}
              className="text-sm p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            maxLength={150}
            className="flex-1 bg-white/15 border border-white/20 text-white placeholder-slate-400 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isSending}
            className="bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white p-2 rounded-2xl shadow-bouncy active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}

