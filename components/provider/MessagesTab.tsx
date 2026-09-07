'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Send,
  CheckCheck,
  Paperclip,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'provider' | 'system';
  text: string;
  timestamp: string;
}

interface Thread {
  id: string;
  customerName: string;
  customerAvatar: string;
  serviceTitle: string;
  jobId: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  online: boolean;
  phone: string;
  address: string;
  messages: ChatMessage[];
}

const initialThreads: Thread[] = [
  {
    id: 'thread-1',
    customerName: 'Rahul Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    serviceTitle: 'AC Comprehensive Deep Cleaning',
    jobId: 'WK-28491',
    lastMessage: 'Can you please come 15 minutes earlier? I have a zoom call at 11 AM.',
    lastTimestamp: '10 mins ago',
    unread: true,
    online: true,
    phone: '+91 98451 22334',
    address: 'Indiranagar 12th Main Road, Bengaluru',
    messages: [
      { id: 'm-1', sender: 'system', text: 'Booking #WK-28491 confirmed for Today at 10:00 AM.', timestamp: '08:30 AM' },
      { id: 'm-2', sender: 'customer', text: 'Hi Ravi, look forward to the AC cleaning.', timestamp: '08:45 AM' },
      { id: 'm-3', sender: 'provider', text: 'Good morning Rahul! I have packed all specialized indoor foam cleaner & jet kit. Will be heading your way soon.', timestamp: '09:00 AM' },
      { id: 'm-4', sender: 'customer', text: 'Can you please come 15 minutes earlier? I have a zoom call at 11 AM.', timestamp: '09:20 AM' }
    ]
  },
  {
    id: 'thread-2',
    customerName: 'Priya Sundaram',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    serviceTitle: 'Switchboard & Fan Installation',
    jobId: 'WK-28492',
    lastMessage: 'Thank you for confirming the Anchor switchboard model!',
    lastTimestamp: '1 hour ago',
    unread: false,
    online: false,
    phone: '+91 98452 33445',
    address: 'Defence Colony, Indiranagar, Bengaluru',
    messages: [
      { id: 'p-1', sender: 'customer', text: 'Hi, does the quote include the new Anchor modular switch?', timestamp: '07:30 AM' },
      { id: 'p-2', sender: 'provider', text: 'Yes Priya, genuine 16A Anchor Roma switch is included in the parts package.', timestamp: '08:10 AM' },
      { id: 'p-3', sender: 'customer', text: 'Thank you for confirming the Anchor switchboard model!', timestamp: '08:15 AM' }
    ]
  },
  {
    id: 'thread-3',
    customerName: 'Arjun Menon',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    serviceTitle: 'Main Distribution MCB Tripping Fix',
    jobId: 'WK-28493',
    lastMessage: 'Is UPI payment available once you finish?',
    lastTimestamp: '2 hours ago',
    unread: false,
    online: true,
    phone: '+91 98453 44556',
    address: 'Palm Grove, Domlur, Bengaluru',
    messages: [
      { id: 'a-1', sender: 'customer', text: 'Is UPI payment available once you finish?', timestamp: '07:00 AM' },
      { id: 'a-2', sender: 'provider', text: 'Yes Arjun, you can pay directly via Google Pay, PhonePe, or Paytm once service is complete.', timestamp: '07:15 AM' }
    ]
  },
  {
    id: 'thread-4',
    customerName: 'Worksy Partner Support',
    customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    serviceTitle: 'Partner Desk Help & Dispatch',
    jobId: 'SUPPORT-PRO',
    lastMessage: 'Your Gold Tier Partner status has been renewed with 0% platform penalty.',
    lastTimestamp: 'Yesterday',
    unread: false,
    online: true,
    phone: '1800-WORKSY-PRO',
    address: 'Worksy Partner Operations Desk',
    messages: [
      { id: 's-1', sender: 'system', text: 'Welcome to Worksy Partner Operations Desk. We are here 24/7 for emergency dispatch or customer escalations.', timestamp: 'Sep 1' },
      { id: 's-2', sender: 'system', text: 'Your Gold Tier Partner status has been renewed with 0% platform penalty.', timestamp: 'Yesterday' }
    ]
  }
];

export default function MessagesTab() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(initialThreads[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const quickReplies = [
    'On my way now! ETA is about 15 minutes.',
    'I have arrived at your gate / entrance.',
    'Please share the 4-digit start OTP with me.',
    'Service is completed, generated the digital invoice.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text && !attachedFile) return;

    const fullMessageText = attachedFile
      ? `${text ? text + ' ' : ''}[Attachment: ${attachedFile}]`
      : text;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'provider',
      text: fullMessageText,
      timestamp: 'Just now'
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: fullMessageText,
              lastTimestamp: 'Just now',
              unread: false
            }
          : t
      )
    );

    setInputText('');
    setAttachedFile(null);

    // Mock response after 1.5s
    if (activeThread.id !== 'thread-4') {
      setTimeout(() => {
        setThreads((prev) =>
          prev.map((t) => {
            if (t.id === activeThread.id) {
              const replyMsg: ChatMessage = {
                id: `reply-${Date.now()}`,
                sender: 'customer',
                text: 'Got it, thank you Ravi!',
                timestamp: 'Just now'
              };
              return {
                ...t,
                messages: [...t.messages, replyMsg],
                lastMessage: replyMsg.text,
                lastTimestamp: 'Just now'
              };
            }
            return t;
          })
        );
      }, 1500);
    }
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.jobId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[820px] max-h-[88vh] flex flex-col md:flex-row w-full max-w-[1840px] 2xl:max-w-[1920px] mx-auto mb-20 lg:mb-10">
      {/* LEFT PANEL: THREADS LIST (Exact dimensions & layout matching Customer page) */}
      <div
        className={`w-full md:w-96 lg:w-[420px] border-r border-stone-200 flex flex-col shrink-0 bg-stone-50/50 ${
          activeThread && 'hidden md:flex'
        }`}
      >
        <div className="p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-stone-900">
              Direct <span className="italic font-normal">Messages</span>
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200/80">
              Provider Ops
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Communicate directly with your assigned customers
          </p>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-stone-200 bg-white">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
          {filteredThreads.map((thread) => {
            const isSelected = thread.id === activeThread?.id;
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full p-4 sm:p-5 flex items-start gap-3.5 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-amber-50/60 border-l-4 border-l-black' : 'hover:bg-white'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.customerAvatar}
                    alt={thread.customerName}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-stone-200"
                  />
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-display font-medium text-stone-900 text-base tracking-tight truncate">
                      {thread.customerName}
                    </h3>
                    <span className="text-[11px] text-stone-400 shrink-0">
                      {thread.lastTimestamp}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-amber-800 truncate mt-0.5">
                    {thread.serviceTitle}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 truncate mt-1 leading-relaxed">
                    {thread.lastMessage}
                  </p>
                </div>

                {thread.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 self-center" />
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
                aria-label="Back to conversations"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeThread.customerAvatar}
                  alt={activeThread.customerName}
                  className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                />
                {activeThread.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-medium text-stone-900 text-base tracking-tight truncate">
                    {activeThread.customerName}
                  </h3>
                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-semibold">
                    #{activeThread.jobId}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {activeThread.serviceTitle} • {activeThread.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${activeThread.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
              >
                <Phone size={14} />
                <span className="hidden sm:inline">Call Customer</span>
              </a>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40">
            {activeThread.messages.map((msg) => {
              const isProvider = msg.sender === 'provider';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-stone-200/80 text-[11px] font-semibold text-stone-600 border border-stone-300/40">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isProvider ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md sm:max-w-lg p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isProvider
                        ? 'bg-black text-white rounded-br-xs'
                        : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isProvider && <CheckCheck size={12} className="text-emerald-500" />}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Chips */}
          <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">
              Quick:
            </span>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(reply)}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs hover:border-black whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input Box (Flawless design matching Customer page, beautifully styled, never cut off) */}
          <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
            {attachedFile && (
              <div className="absolute -top-9 left-4 right-4 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                <span>📎 Ready to send: {attachedFile}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="font-bold hover:text-black ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setAttachedFile(attachedFile ? null : 'Service_Inspection_Photo.jpg')}
              className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                attachedFile
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'hover:bg-stone-100 text-stone-500'
              }`}
              title="Attach photo or report"
            >
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={`Message ${activeThread.customerName}...`}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-stone-100 border border-transparent focus:border-stone-400 focus:bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim() && !attachedFile}
              className="p-2.5 rounded-xl bg-black text-white hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0 cursor-pointer"
              title="Send Message"
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
