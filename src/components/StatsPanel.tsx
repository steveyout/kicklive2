import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { APIMatch, MatchStats, MatchTimelineEvent, MatchLineups } from "../types";
import { 
  generateMockStats, 
  generateMockLineups, 
  generateMockTimeline 
} from "../utils";
import { 
  BarChart4, 
  Users2, 
  History, 
  Target, 
  Activity, 
  ShieldAlert, 
  AlertTriangle 
} from "lucide-react";

interface StatsPanelProps {
  match: APIMatch;
}

type TabType = "stats" | "lineups" | "timeline";

export default function StatsPanel({ match }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [lineups, setLineups] = useState<MatchLineups | null>(null);
  const [timeline, setTimeline] = useState<MatchTimelineEvent[]>([]);

  const homeName = match.teams?.home?.name || "Home Team";
  const awayName = match.teams?.away?.name || "Away Team";

  useEffect(() => {
    // Dynamically retrieve generated statistics
    setStats(generateMockStats(match.id));
    setLineups(generateMockLineups(homeName, awayName, match.category));
    setTimeline(generateMockTimeline(match.id, homeName, awayName, match.category));
  }, [match.id, homeName, awayName, match.category]);

  const tabs = [
    { id: "stats", label: "Live Stats", icon: BarChart4 },
    { id: "lineups", label: "Line-ups", icon: Users2 },
    { id: "timeline", label: "Match Timeline", icon: History }
  ] as const;

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col space-y-4">
      
      {/* Tab Navigation header */}
      <div className="flex border-b border-white/5 pb-0.5 space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold relative transition-all duration-300 rounded-t-xl cursor-pointer ${
                isActive ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-stats-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel contents */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          {activeTab === "stats" && stats && (
            <motion.div
              key="stats-panel"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4 py-1"
            >
              {/* Possession metrics */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold font-mono text-white/40">
                  <span>{stats.possession.home}% Ball Possession</span>
                  <span>{stats.possession.away}% Ball Possession</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full flex overflow-hidden border border-white/5">
                  <div 
                    style={{ width: `${stats.possession.home}%` }} 
                    className="bg-red-500 h-full transition-all duration-1000" 
                  />
                  <div 
                    style={{ width: `${stats.possession.away}%` }} 
                    className="bg-orange-500 h-full transition-all duration-1000" 
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-0.5">
                  <span className="text-red-400 font-display truncate max-w-[150px]">{homeName}</span>
                  <span className="text-orange-400 font-display truncate max-w-[150px]">{awayName}</span>
                </div>
              </div>

              {/* General Stat Meters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                
                {/* Shots Row */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
                    <span className="text-red-405 text-red-400">{stats.shots.home}</span>
                    <span className="text-white/40 flex items-center space-x-1 uppercase text-[10px] tracking-wider font-sans">
                      <Target size={11} />
                      <span>Total Shots</span>
                    </span>
                    <span className="text-orange-405 text-orange-400">{stats.shots.away}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div 
                      style={{ width: `${(stats.shots.home / (stats.shots.home + stats.shots.away)) * 105}%` }} 
                      className="bg-red-500 h-full" 
                    />
                    <div 
                      style={{ width: `${(stats.shots.away / (stats.shots.home + stats.shots.away)) * 105}%` }} 
                      className="bg-orange-500 h-full" 
                    />
                  </div>
                </div>

                {/* Shots On Target */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
                    <span className="text-red-400">{stats.shotsOnTarget.home}</span>
                    <span className="text-white/40 flex items-center space-x-1 uppercase text-[10px] tracking-wider font-sans">
                      <Activity size={11} />
                      <span>Shots On Target</span>
                    </span>
                    <span className="text-orange-400">{stats.shotsOnTarget.away}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div 
                      style={{ width: `${(stats.shotsOnTarget.home / Math.max(1, stats.shotsOnTarget.home + stats.shotsOnTarget.away)) * 100}%` }} 
                      className="bg-red-500 h-full" 
                    />
                    <div 
                      style={{ width: `${(stats.shotsOnTarget.away / Math.max(1, stats.shotsOnTarget.home + stats.shotsOnTarget.away)) * 100}%` }} 
                      className="bg-orange-500 h-full" 
                    />
                  </div>
                </div>

                {/* Fouls */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
                    <span className="text-red-400">{stats.fouls.home}</span>
                    <span className="text-white/40 flex items-center space-x-1 uppercase text-[10px] tracking-wider font-sans">
                      <ShieldAlert size={11} />
                      <span>Discipline Fouls</span>
                    </span>
                    <span className="text-orange-400">{stats.fouls.away}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div 
                      style={{ width: `${(stats.fouls.home / Math.max(1, stats.fouls.home + stats.fouls.away)) * 100}%` }} 
                      className="bg-red-500 h-full" 
                    />
                    <div 
                      style={{ width: `${(stats.fouls.away / Math.max(1, stats.fouls.home + stats.fouls.away)) * 100}%` }} 
                      className="bg-orange-500 h-full" 
                    />
                  </div>
                </div>

                {/* Yellow cards */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
                    <span className="text-red-400">{stats.yellowCards.home}</span>
                    <span className="text-white/40 flex items-center space-x-1 uppercase text-[10px] tracking-wider font-sans">
                      <AlertTriangle size={11} />
                      <span>Yellow Cards</span>
                    </span>
                    <span className="text-orange-400">{stats.yellowCards.away}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div 
                      style={{ width: `${(stats.yellowCards.home / Math.max(1, stats.yellowCards.home + stats.yellowCards.away)) * 100}%` }} 
                      className="bg-red-500 h-full" 
                    />
                    <div 
                      style={{ width: `${(stats.yellowCards.away / Math.max(1, stats.yellowCards.home + stats.yellowCards.away)) * 100}%` }} 
                      className="bg-orange-500 h-full" 
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "lineups" && lineups && (
            <motion.div
              key="lineups-panel"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2"
            >
              {/* Home Lineup */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider font-mono bg-red-500/5 border border-red-500/10 px-2 py-1 rounded inline-block truncate max-w-[200px]">
                  {homeName} Starting Sells
                </span>
                <div className="space-y-1.5">
                  {lineups.home.map((player) => (
                    <div 
                      key={`${player.number}-${player.name}`}
                      className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded bg-red-500/10 text-red-405 text-red-400 flex items-center justify-center font-bold text-[10px] font-mono border border-red-500/20">
                          {player.number}
                        </span>
                        <span className="text-slate-200 font-medium">{player.name}</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono uppercase">{player.position}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Lineup */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider font-mono bg-orange-500/5 border border-orange-500/10 px-2 py-1 rounded inline-block truncate max-w-[200px]">
                  {awayName} Starting Sells
                </span>
                <div className="space-y-1.5">
                  {lineups.away.map((player) => (
                    <div 
                      key={`${player.number}-${player.name}`}
                      className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded bg-orange-500/10 text-orange-405 text-orange-400 flex items-center justify-center font-bold text-[10px] font-mono border border-orange-500/20">
                          {player.number}
                        </span>
                        <span className="text-slate-200 font-medium">{player.name}</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono uppercase">{player.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "timeline" && timeline && (
            <motion.div
              key="timeline-panel"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="relative border-l-[1px] border-white/5 pl-4 space-y-5 py-3 ml-2"
            >
              {timeline.map((evt, index) => {
                const isHome = evt.team === "home";
                const isAway = evt.team === "away";
                
                return (
                  <div key={index} className="relative group">
                    {/* Ring Indicator */}
                    <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-[#050507] transition-all ${
                      evt.type === "goal" 
                        ? "bg-emerald-500 ring-4 ring-emerald-500/20 scale-125" 
                        : evt.type === "card"
                        ? "bg-red-500 ring-4 ring-red-500/20"
                        : "bg-white/40"
                    }`} />
                    
                    <div className="flex flex-col space-y-1 leading-relaxed">
                      <div className="flex items-center space-x-2 font-mono text-[10px] font-bold text-white/40">
                        <span className="text-white px-1.5 py-0.2 rounded bg-white/10">{evt.minute}'</span>
                        <span>•</span>
                        <span className="uppercase tracking-wider">
                          {evt.type}
                        </span>
                        {evt.player && (
                          <>
                            <span>•</span>
                            <span className={isHome ? "text-red-400" : isAway ? "text-orange-400" : "text-white/60"}>
                              {evt.player}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-white/80 font-sans tracking-wide">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
