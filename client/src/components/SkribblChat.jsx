import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

export function SkribblChat({ calledNumbers = [] }) {
  const { roomState, sendChatMessage, sessionToken } = useGame();
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

  return (
    <div className="w-full lg:w-72 bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-3 flex flex-col h-auto lg:h-[530px]">
      {/* Called Numbers Strip */}
      <div className="bg-[#f0f4f8] rounded-2xl p-2 border-2 border-slate-300 mb-2">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 flex justify-between">
          <span>Numbers Called ({calledNumbers.length}/25)</span>
          <span>Latest First</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 scrollbar-thin">
          {recentCalled.length === 0 ? (
            <span className="text-[11px] text-slate-400 italic">No numbers called yet</span>
          ) : (
            recentCalled.map((num, idx) => (
              <span
                key={idx}
                className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border-2 ${
                  idx === 0
                    ? 'bg-yellow-300 text-yellow-950 border-[#0b2c4d] shadow-sm animate-pop'
                    : 'bg-white text-[#0b2c4d] border-slate-300'
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
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 mb-2 scrollbar-thin text-xs"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 italic font-semibold">
            Chat with players here! ✏️
          </div>
        ) : (
          messages.map((m) => {
            if (m.isSystem) {
              let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
              if (m.type === 'call') badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-black';
              if (m.type === 'mark') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
              if (m.type === 'win') badgeColor = 'bg-yellow-200 text-yellow-950 border-yellow-500 font-black';

              return (
                <div key={m.id} className={`p-1.5 rounded-xl border text-[11px] font-bold ${badgeColor}`}>
                  {m.text}
                </div>
              );
            }

            const isMe = m.sessionToken === sessionToken;
            return (
              <div key={m.id} className="leading-tight break-words py-0.5">
                <span
                  className="font-extrabold mr-1"
                  style={{ color: m.senderColor || '#0084ff' }}
                >
                  {m.senderName}:
                </span>
                <span className="text-slate-800 font-semibold">{m.text}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Emoji Bar */}
      <div className="flex items-center space-x-1 mb-1.5 px-0.5">
        {['🎉', '🎯', '✏️', '🔥', '😱'].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setChatInput((prev) => (prev ? `${prev} ${emoji}` : emoji))}
            className="text-xs p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="flex items-center space-x-1.5">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message here..."
          maxLength={150}
          className="flex-1 bg-[#f4f7fa] border-2 border-slate-300 focus:border-[#0084ff] text-[#0b2c4d] placeholder-slate-400 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none"
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || isSending}
          className="skribbl-btn-blue p-2 rounded-xl text-white disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
