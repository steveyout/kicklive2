import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Users, Shield, Zap, Sparkles, Smile } from "lucide-react";

interface LiveChatProps {
  matchId: string;
  category: string;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  badge?: "MOD" | "VIP" | "FAN" | "TEAM";
  badgeColor?: string;
  teamSupport?: string;
}

const MOCK_CHAT_USERS = [
  { name: "SakaSZN_7", badge: "VIP", color: "from-amber-400 to-orange-500" },
  { name: "CelticsDyna1", badge: "VIP", color: "from-emerald-400 to-teal-500" },
  { name: "NoleFanatic", badge: "FAN", color: "from-blue-400 to-indigo-500" },
  { name: "GunnersCore", badge: "VIP", color: "from-rose-500 to-red-600" },
  { name: "BronBron23", badge: "VIP", color: "from-purple-500 to-pink-500" },
  { name: "NadalClayMaster", badge: "FAN", color: "from-yellow-400 to-amber-500" },
  { name: "SportsCaster_Joe", badge: "MOD", color: "from-sky-500 to-blue-600" },
  { name: "Alex_Blues98", badge: "FAN", color: "from-cyan-400 to-blue-500" }
];

const MOCK_REACTION_PHRASES: Record<string, string[]> = {
  general: [
    "Unbelievable game!!! 🔥",
    "Let's go guys, we need a win!",
    "Referee is total blind 🤦‍♂️",
    "WHAT A TEAM ACCÈS!",
    "This stream quality is crisp, appreciate the HD feed 🤝",
    "Can anyone confirm if he was offside?",
    "Absolute tactical masterclass today",
    "LEEEEEET'S GOOOOOO!!! 🚀🔥",
    "Wow what a play!"
  ],
  football: [
    "WHAT A GOALLLLLLL!!!!! ⚽🔥🔥",
    "That keeper had zero chances",
    "Stunning yellow card call, holding back counter",
    "Substitution looks good, we need fresh legs",
    "Arsenal passing is sublime today honestly"
  ],
  basketball: [
    "WHAT A DUNK!!! Absolute posterized! 🏀💥",
    "Curry from logoooooo! Unreal!",
    "That transition defense is non-existent lol",
    "Lakers turning the heat on! 3pointer streak",
    "These referee calls are ridiculous in this quarter."
  ],
  tennis: [
    "Unreal rally! Djokovic depth is insane!",
    "That ace was 210 km/h! Alcaraz has wheels",
    "Break point opportunity right now, pressure on",
    "Gorgeous drop shot! absolute clay beauty"
  ]
};

export default function LiveChat({ matchId, category }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load initial pre-seeded messages
  useEffect(() => {
    const seed: ChatMessage[] = [
      {
        id: "m_init_1",
        user: "SportsCaster_Joe",
        text: "Welcome to the Live Stream room! Keep chats respectful. Multi-node connections are operating in ultra-HD. Let us know who you are backing! 🎙️",
        timestamp: new Date(Date.now() - 3 * 60000),
        badge: "MOD",
        badgeColor: "bg-red-600"
      },
      {
        id: "m_init_2",
        user: "SakaSZN_7",
        text: "Reporting live from London! The stream looks top class guys.",
        timestamp: new Date(Date.now() - 2 * 60000),
        badge: "VIP",
        badgeColor: "bg-orange-500"
      },
      {
        id: "m_init_3",
        user: "BronBron23",
        text: "Locking in for this high-octane duel, let's see some magic!",
        timestamp: new Date(Date.now() - 1 * 60000),
        badge: "FAN",
        badgeColor: "bg-white/10 text-white/40 border border-white/10"
      }
    ];
    setMessages(seed);
  }, [matchId]);

  // Simulating active chat message streams
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random user
      const rUser = MOCK_CHAT_USERS[Math.floor(Math.random() * MOCK_CHAT_USERS.length)];
      
      // Pick dynamic reactions
      const categoryPhrases = MOCK_REACTION_PHRASES[category] || [];
      const generalPhrases = MOCK_REACTION_PHRASES.general;
      const mergedList = [...categoryPhrases, ...generalPhrases];
      const rText = mergedList[Math.floor(Math.random() * mergedList.length)];

      const newMessage: ChatMessage = {
        id: `m_sim_${Date.now()}_${Math.random()}`,
        user: rUser.name,
        text: rText,
        timestamp: new Date(),
        badge: rUser.badge as any,
        badgeColor: rUser.badge === "MOD" ? "bg-red-600" : rUser.badge === "VIP" ? "bg-orange-500" : "bg-white/10 text-white/40 border border-white/10"
      };

      setMessages((prev) => {
        // Keep logs down to last 40 items to conserve layout memory
        const next = [...prev, newMessage];
        if (next.length > 40) return next.slice(next.length - 40);
        return next;
      });
    }, 4500); // Add a msg every 4.5 seconds

    return () => clearInterval(interval);
  }, [matchId, category]);

  // Handle instant scrolling without focus stealing or shifting body layout
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const myMessage: ChatMessage = {
      id: `m_user_${Date.now()}`,
      user: "GlobalViewer_You",
      text: inputValue.trim(),
      timestamp: new Date(),
      badge: "VIP",
      badgeColor: "bg-gradient-to-r from-red-600 to-orange-500"
    };

    setMessages((prev) => [...prev, myMessage]);
    setInputValue("");
  };

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col h-[380px] shrink-0 overflow-hidden relative border border-white/5">
      
      {/* Live Chat header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Users size={16} className="text-red-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-wide font-display">Fans Live Chatroom</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40 font-mono">
          <Zap size={10} className="text-orange-500 animate-pulse" />
          <span>4.2k active</span>
        </div>
      </div>

      {/* Messages Feed View */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-4 scrollbar-none" 
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.user === "GlobalViewer_You";
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-baseline space-x-2">
                  {/* Badge */}
                  {msg.badge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded font-mono text-white ${msg.badgeColor}`}>
                      {msg.badge}
                    </span>
                  )}
                  {/* Name */}
                  <span className={`text-[11px] font-bold ${
                    isMe 
                      ? "text-red-400" 
                      : msg.badge === "MOD" 
                      ? "text-red-500" 
                      : msg.badge === "VIP"
                      ? "text-orange-400"
                      : "text-white/60"
                  }`}>
                    {msg.user}
                  </span>
                  {/* Time */}
                  <span className="text-[9px] text-white/20 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Message body */}
                <div className={`text-xs p-2.5 rounded-xl text-slate-200 max-w-[92%] leading-normal font-sans tracking-wide ${
                  isMe 
                    ? "bg-red-500/15 border-[1px] border-red-500/20 rounded-tr-none self-start ml-2" 
                    : msg.badge === "MOD"
                    ? "bg-red-550/15 border-[1px] border-red-550/10 rounded-tl-none ml-2"
                    : "bg-white/5 border-[1px] border-white/5 rounded-tl-none ml-2"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Chat Submission Toolbar */}
      <form onSubmit={handleSend} className="relative mt-auto pt-2 border-t border-white/5 flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type message to chat room..."
          maxLength={100}
          className="flex-1 bg-black/55 hover:bg-black/75 border border-white/5 focus:border-red-500/40 focus:ring-0 text-white text-xs rounded-xl py-2.5 pl-4 pr-10 outline-none transition-all placeholder-white/20"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`p-2.5 rounded-xl text-white transition-all cursor-pointer flex items-center justify-center ${
            inputValue.trim()
              ? "bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_4px_12px_rgba(220,38,38,0.3)]"
              : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
          }`}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
