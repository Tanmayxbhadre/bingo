import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

const REACTION_LIST = ['🔥', '🎉', '🎯', '😎', '😂', '😱', '👏', '⭐', '💥', '🥳'];

export function SkribblChat({ calledNumbers = [] }) {
  const { roomState, sendChatMessage, sendReaction, sessionToken } = useGame();
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  const messages = roomState?.chatMessages || [];
  const recentCalled = [...calledNumbers].reverse().slice(0, 10);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isSending) return;

    try {
      setIsSending(true);
      sounds.playPop();
      await sendChatMessage(chatInput.trim());
      setChatInput('');
    } catch (err) {
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReaction = (emoji) => {
    sounds.playReaction();
    sendReaction(emoji);
  };

  return (
    <div className="w-full lg:w-80 bg-gradient-to-b from-white via-white to-sky-50/50 rounded-[32px] border-4 border-[#0b2c4d] shadow-[0_10px_0_#072847] p-4 flex flex-col min-h-[460px]">
      {/* Called Numbers Strip */}
      <div className="bg-white rounded-2xl p-2.5 border-2 border-slate-200 mb-3 shadow-inner">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 flex justify-between items-center">
          <span className="flex items-center space-x-1">
            <span>🎯 Numbers Called</span>
            <span className="bg-sky-100 text-[#0284c7] font-black px-1.5 py-0.2 rounded">
              {calledNumbers.length}/25
            </span>
          </span>
          <span className="text-[9px] text-slate-400">Latest First</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-thin">
          {recentCalled.length === 0 ? (
            <span className="text-[11px] text-slate-400 italic py-1">No numbers called yet</span>
          ) : (
            recentCalled.map((num, idx) => (
              <span
                key={idx}
                className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border-2 transition-transform ${
                  idx === 0
                    ? 'bg-gradient-to-b from-yellow-300 to-amber-400 text-yellow-950 border-[#0b2c4d] shadow-sm scale-110 ring-2 ring-yellow-400 -translate-y-0.5'
                    : 'bg-slate-50 text-[#072847] border-slate-300'
                }`}
              >
                {num}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 mb-2.5 scrollbar-thin text-xs max-h-56 lg:max-h-64"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 italic font-semibold">
            Chat with players & celebrate! 💬
          </div>
        ) : (
          messages.map((m) => {
            if (m.isSystem) {
              if (m.type === 'call') {
                return (
                  <div key={m.id} className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-600 py-0.5 px-2 bg-slate-50 rounded-lg border border-slate-200/60 my-0.5">
                    <span>📢</span>
                    <span>{m.text}</span>
                  </div>
                );
              }

              let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
              if (m.type === 'mark') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
              if (m.type === 'win') badgeColor = 'bg-gradient-to-r from-amber-100 to-yellow-200 text-yellow-950 border-yellow-400 font-black shadow-sm';

              return (
                <div key={m.id} className={`p-1.5 rounded-xl border text-[11px] font-bold ${badgeColor}`}>
                  {m.text}
                </div>
              );
            }

            return (
              <div key={m.id} className="leading-tight break-words py-1 px-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <span
                  className="font-black mr-1"
                  style={{ color: m.senderColor || '#0284c7' }}
                >
                  {m.senderName}:
                </span>
                <span className="text-slate-800 font-semibold">{m.text}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Emoji Reaction Dock */}
      <div className="border-t-2 border-slate-200 pt-2 mb-2.5">
        <div className="flex items-center justify-between space-x-1 overflow-x-auto py-0.5 scrollbar-none">
          {REACTION_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleQuickReaction(emoji)}
              className="w-7 h-7 flex-shrink-0 rounded-lg bg-slate-50 hover:bg-yellow-100 active:scale-90 border border-slate-200 hover:border-yellow-400 flex items-center justify-center text-sm transition-transform cursor-pointer"
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="flex items-center space-x-1.5">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={150}
          className="flex-1 bg-white border-2 border-slate-300 focus:border-[#0284c7] text-[#072847] placeholder-slate-400 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none shadow-inner"
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || isSending}
          className="skribbl-btn-blue p-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
