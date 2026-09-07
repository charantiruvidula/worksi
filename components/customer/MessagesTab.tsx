'use client';

import React, { useState } from 'react';
import {
  Send,
  Phone,
  Paperclip,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronLeft,
  CalendarCheck,
  Info
} from 'lucide-react';
import { ChatThread, ChatMessage } from '@/lib/marketplace-data';

interface MessagesTabProps {
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onCallProvider: (phone: string, name: string) => void;
  onViewBookingById?: (bookingId: string) => void;
}

export default function MessagesTab({
  threads,
  onSendMessage,
  onCallProvider,
  onViewBookingById
}: MessagesTabProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSend = () => {
    if (!messageInput.trim() || !activeThread) return;
    const text = messageInput.trim();
    setMessageInput('');
    onSendMessage(activeThread.id, text);

    // Simulate realistic technician or support typing & response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Thanks for the message! I noted your request.';
      if (activeThread.id === 'chat-ravi') {
        replyText = 'Got it, Charan! I have reached your cross road, parking my bike now.';
      } else if (activeThread.id === 'chat-support') {
        replyText = 'Thanks for reaching out! Our team is reviewing your account. We are here to help!';
      }
      onSendMessage(activeThread.id, replyText);
    }, 2000);
  };

  const quickReplies = [
    'I am at home, please come in.',
    'Please ring the doorbell twice.',
    'What is your updated ETA?',
    'Please call when you reach the gate.'
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[820px] max-h-[88vh] flex flex-col md:flex-row w-full max-w-[1760px] 2xl:max-w-[1840px] mx-auto mb-20 lg:mb-10">
      {/* LEFT PANEL: THREADS LIST */}
      <div
        className={`w-full md:w-96 lg:w-[420px] border-r border-stone-200 flex flex-col shrink-0 bg-stone-50/50 ${
          activeThread && 'hidden md:flex'
        }`}
      >
        <div className="p-5 border-b border-stone-200 bg-white">
          <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-stone-900">Direct <span className="italic font-normal">Messages</span></h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">Communicate directly with your assigned technicians</p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
          {threads.map((thread) => {
            const isSelected = thread.id === activeThread?.id;
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full p-4 sm:p-5 flex items-start gap-3.5 text-left transition-colors ${
                  isSelected ? 'bg-amber-50/60 border-l-4 border-l-black' : 'hover:bg-white'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.providerAvatar}
                    alt={thread.providerName}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-stone-200"
                  />
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-display font-medium text-stone-900 text-base tracking-tight truncate">
                      {thread.providerName}
                    </h3>
                    <span className="text-[11px] text-stone-400 shrink-0">
                      {thread.lastTimestamp}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-stone-500 truncate mt-0.5">
                    {thread.serviceTitle}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 truncate mt-1 leading-relaxed">
                    {thread.lastMessage}
                  </p>
                </div>

                {thread.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT WINDOW */}
      {activeThread ? (
        <div className="flex-1 flex flex-col h-full bg-white min-w-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSelectedThreadId('')}
                className="md:hidden p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeThread.providerAvatar}
                  alt={activeThread.providerName}
                  className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                />
                {activeThread.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-medium text-stone-900 text-base tracking-tight truncate">
                    {activeThread.providerName}
                  </h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold hidden sm:inline">
                    Verified
                  </span>
                </div>
                <div className="text-xs text-stone-500 truncate">
                  {activeThread.serviceTitle}
                  {activeThread.bookingId && ` • #${activeThread.bookingId}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeThread.bookingId && onViewBookingById && (
                <button
                  onClick={() => onViewBookingById(activeThread.bookingId!)}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  <CalendarCheck size={13} />
                  <span>Booking</span>
                </button>
              )}

              <button
                onClick={() => onCallProvider('+91 98450 12345', activeThread.providerName)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Phone size={13} />
                <span>Call</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40">
            {/* Security Notice */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] text-stone-500">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>End-to-end encrypted chat for your safety</span>
              </div>
            </div>

            {activeThread.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="px-3.5 py-1.5 rounded-xl bg-amber-100/70 border border-amber-200 text-[11px] font-medium text-amber-950 max-w-md text-center">
                      ⚡ {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isCustomer
                        ? 'bg-black text-white rounded-tr-none'
                        : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-400 px-1">
                    <span>{msg.timestamp}</span>
                    {isCustomer && <CheckCheck size={12} className="text-sky-500" />}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-stone-500 italic">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>{activeThread.providerName} is typing...</span>
              </div>
            )}
          </div>

          {/* Quick Replies Chips */}
          <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Quick:</span>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSendMessage(activeThread.id, reply);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs hover:border-black whitespace-nowrap transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2">
            <button
              onClick={() => alert('Photo attachment: You can share photos of the issue with your technician.')}
              className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors shrink-0"
              title="Attach photo of appliance or problem"
            >
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={`Message ${activeThread.providerName}...`}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-stone-100 border border-transparent focus:border-stone-400 focus:bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />

            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-2.5 rounded-xl bg-black text-white hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-stone-400">
          Select a conversation from the left to start messaging.
        </div>
      )}
    </div>
  );
}
