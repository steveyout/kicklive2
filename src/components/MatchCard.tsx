import React from "react";
import { motion } from "motion/react";
import { Star, Clock, Flame, ChevronRight } from "lucide-react";
import { APIMatch } from "../types";
import { getTeamBadgeFallback, formatMatchTime, isMatchLive, getLiveMinutes } from "../utils";

interface MatchCardProps {
  match: APIMatch;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelect: (match: APIMatch) => void;
  isSelected?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

export default function MatchCard({
  match,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isSelected = false
}: MatchCardProps) {
  const live = isMatchLive(match.date);
  const homeBadge = match.teams?.home?.badge && !match.id.startsWith("match_")
    ? `/api/images/badge/${match.teams.home.badge}.webp`
    : getTeamBadgeFallback(match.teams?.home?.name || "Home Team", match.category);

  const awayBadge = match.teams?.away?.badge && !match.id.startsWith("match_")
    ? `/api/images/badge/${match.teams.away.badge}.webp`
    : getTeamBadgeFallback(match.teams?.away?.name || "Away Team", match.category);

  const [countdown, setCountdown] = React.useState<string>("");
  const [isUpcoming, setIsUpcoming] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (live) {
      setIsUpcoming(false);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diffMs = match.date - now;
      
      if (diffMs > 0) {
        setIsUpcoming(true);
        const totalSecs = Math.floor(diffMs / 1000);
        const secs = totalSecs % 60;
        const totalMins = Math.floor(totalSecs / 60);
        const mins = totalMins % 60;
        const totalHrs = Math.floor(totalMins / 60);
        const hrs = totalHrs % 24;
        const days = Math.floor(totalHrs / 24);

        if (days > 0) {
          setCountdown(`${days}d ${hrs}h`);
        } else if (hrs > 0) {
          setCountdown(`${hrs}h ${mins}m ${secs}s`);
        } else if (mins > 0) {
          setCountdown(`${mins}m ${secs}s`);
        } else {
          setCountdown(`${secs}s`);
        }
      } else {
        setIsUpcoming(false);
        setCountdown("");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [match.date, live]);

  return (
    <motion.div
      layoutId={`card-container-${match.id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        scale: 1.025,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "rgba(239, 68, 68, 0.4)",
        boxShadow: "0 10px 40px -10px rgba(239, 68, 68, 0.2)",
        transition: { duration: 0.25, ease: "easeInOut" }
      }}
      onClick={() => onSelect(match)}
      className={`glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 cursor-pointer border backdrop-blur-md ${
        isSelected 
          ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-white/10" 
          : "hover:bg-white/5 border-white/5 bg-black/10"
      }`}
    >
      {/* Background abstract ambient glow on selection */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Popular and Live badges block */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {live ? (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-red-500 bg-red-500/10 border-[1px] border-red-500/20 live-glow shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-ping" />
              <span>LIVE • {getLiveMinutes(match.date)}</span>
            </span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/40 bg-white/5 border-[1px] border-white/10 font-mono">
                <Clock size={10} />
                <span>{formatMatchTime(match.date)}</span>
              </span>
              {isUpcoming && countdown && (
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black text-orange-400 bg-orange-500/10 border-[1px] border-orange-500/20 font-mono shadow-[0_0_10px_rgba(249,115,22,0.1)] animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-orange-500 inline-block animate-ping" />
                  <span>STARTS IN {countdown}</span>
                </span>
              )}
            </div>
          )}

          {match.popular && (
            <span className="flex items-center space-x-0.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-orange-400 bg-orange-500/10 border-[1px] border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
              <Flame size={10} className="fill-orange-400" />
              <span>POPULAR</span>
            </span>
          )}
        </div>

        {/* Favorite Icon */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => onToggleFavorite(e, match.id)}
          className="p-1 rounded-full text-white/40 hover:text-orange-400 transition-colors cursor-pointer"
        >
          <Star 
            size={18} 
            className={isFavorite ? "fill-orange-400 text-orange-400" : "text-white/40"} 
          />
        </motion.button>
      </div>

      {/* Teams and Title Presentation */}
      <div className="flex flex-col space-y-4 my-2">
        {match.teams ? (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center text-center">
            {/* Home Team */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-black/40 rounded-2xl p-0.5 border-[1px] border-white/10 shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <img 
                  src={homeBadge} 
                  alt={match.teams.home?.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    // Failover if broken badge link
                    (e.target as HTMLImageElement).src = getTeamBadgeFallback(match.teams?.home?.name || "Home", match.category);
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide truncate max-w-[100px] hover:text-white/80 leading-tight">
                {match.teams.home?.name}
              </span>
            </div>

            {/* VS divider */}
            <div className="flex flex-col items-center justify-center px-2">
              <span className="text-xs font-bold tracking-widest text-white/30 font-display">VS</span>
              {live && (
                <div className="mt-1 text-xs font-black text-red-400 px-1.5 py-0.5 rounded-md bg-red-950/45 border-[1px] border-red-500/20 font-mono tracking-tighter shadow-sm animate-pulse">
                  ACTIVE
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-black/40 rounded-2xl p-0.5 border-[1px] border-white/10 shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <img 
                  src={awayBadge} 
                  alt={match.teams.away?.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    // Failover if broken badge link
                    (e.target as HTMLImageElement).src = getTeamBadgeFallback(match.teams?.away?.name || "Away", match.category);
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide truncate max-w-[100px] hover:text-white/80 leading-tight">
                {match.teams.away?.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm font-semibold text-white/95">{match.title}</p>
          </div>
        )}
      </div>

      {/* Footer Details: Sport Tag + Streams Source counts */}
      <div className="flex items-center justify-between border-t-[1px] border-white/5 pt-3 mt-4 text-[11px] font-semibold text-white/40">
        <span className="capitalize px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/10 tracking-wider">
          {match.category}
        </span>
        <div className="flex items-center space-x-1.5 text-orange-400 hover:text-orange-300 transition-colors">
          <span>{match.sources.length} stream{match.sources.length !== 1 ? "s" : ""}</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}
