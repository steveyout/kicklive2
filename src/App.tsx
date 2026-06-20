import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Loader2, 
  Radio, 
  Flame, 
  Calendar, 
  RefreshCw, 
  Trophy, 
  AlertTriangle, 
  Heart,
  Gamepad2,
  Tv,
  HelpCircle,
  Clock
} from "lucide-react";
import { APIMatch, Sport } from "./types";
import SportsFilter from "./components/SportsFilter";
import MatchCard from "./components/MatchCard";
import StreamPlayer from "./components/StreamPlayer";
import StatsPanel from "./components/StatsPanel";
import LiveChat from "./components/LiveChat";
import { isMatchLive } from "./utils";

type FilterType = "live" | "today" | "popular" | "all" | "favorites";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export default function App() {
  // State
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("live");
  const [matches, setMatches] = useState<APIMatch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<APIMatch | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Loading & Error states
  const [sportsLoading, setSportsLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize and load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sports_hub_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Local storage access failed:", e);
    }
  }, []);

  // Fetch sports categories on mount
  useEffect(() => {
    setSportsLoading(true);
    fetch("/api/sports")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load sports list");
        return res.json();
      })
      .then((data: Sport[]) => {
        setSports(data);
        setSportsLoading(false);
      })
      .catch((err) => {
        console.error("Sports list fetch failed:", err);
        setApiError("Unable to reach the broadcast center. Using fallbacks.");
        setSportsLoading(false);
      });
  }, []);

  // Fetch matches based on chosen sport filters + tab categories
  const fetchMatches = () => {
    setMatchesLoading(true);
    let endpoint = "/api/matches/all";

    if (selectedSportId === null) {
      // General filters
      if (activeFilter === "live") {
        endpoint = "/api/matches/live";
      } else if (activeFilter === "popular") {
        endpoint = "/api/matches/all/popular";
      } else if (activeFilter === "today") {
        endpoint = "/api/matches/all-today";
      } else {
        endpoint = "/api/matches/all";
      }
    } else {
      // Sport specific filters
      if (activeFilter === "popular") {
        endpoint = `/api/matches/${selectedSportId}/popular`;
      } else {
        endpoint = `/api/matches/${selectedSportId}`;
      }
    }

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load matches list");
        return res.json();
      })
      .then((data: APIMatch[]) => {
        // Post filter adjustments for local tabs that cannot be done on the server
        let nextMatches = data || [];
        
        if (selectedSportId !== null) {
          if (activeFilter === "live") {
            nextMatches = nextMatches.filter(m => isMatchLive(m.date));
          } else if (activeFilter === "today") {
            // All mock matches fall within 24 hours of now by default
            nextMatches = nextMatches.filter(m => Math.abs(Date.now() - m.date) < 24 * 3600 * 1000);
          }
        }

        setMatches(nextMatches);
        setMatchesLoading(false);
        setIsRefreshing(false);
      })
      .catch((err) => {
        console.error("Matches fetch error:", err);
        setMatchesLoading(false);
        setIsRefreshing(false);
      });
  };

  // Run fetch whenever filters, tab active changes
  useEffect(() => {
    // Favorites tab doesn't fetch, it just displays localStorage stars from local inventory
    if (activeFilter === "favorites") {
      setMatchesLoading(true);
      // Fetch everything to slice from favorited list
      fetch("/api/matches/all")
        .then(res => res.json())
        .then((data: APIMatch[]) => {
          setMatches(data.filter(m => favorites.includes(m.id)));
          setMatchesLoading(false);
        })
        .catch(() => {
          setMatchesLoading(false);
        });
    } else {
      fetchMatches();
    }
  }, [selectedSportId, activeFilter]);

  // Handle manually pressing refresh
  const triggerRefresh = () => {
    setIsRefreshing(true);
    fetchMatches();
  };

  // Toggle favorite match bookmark
  const toggleFavorite = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation(); // Avoid selecting card
    let next: string[];
    if (favorites.includes(matchId)) {
      next = favorites.filter(id => id !== matchId);
    } else {
      next = [...favorites, matchId];
    }
    setFavorites(next);
    localStorage.setItem("sports_hub_favorites", JSON.stringify(next));
  };

  // Filter matches matching the search query
  const searchedMatches = matches.filter((match) => {
    const titleMatch = match.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = match.category.toLowerCase().includes(searchQuery.toLowerCase());
    const homeTeamMatch = match.teams?.home?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const awayTeamMatch = match.teams?.away?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    return titleMatch || categoryMatch || homeTeamMatch || awayTeamMatch;
  });

  // Calculate stats count for side displays
  const liveCount = matches.filter(m => isMatchLive(m.date)).length;

  return (
    <div className="min-h-screen bg-[#050507] font-sans text-white flex flex-col antialiased selection:bg-red-500/30 selection:text-red-300">
      
      {/* Dynamic Background Mesh Grids matching Atmospheric / Immersive Media design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#1a365d] rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#450a0a] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#1e1b4b] rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col space-y-6 relative z-10">
        
        {/* Sleek Top Header Navigation Bar styled according to Atmospheric / Immersive Media */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 bg-black/10 backdrop-blur-md p-4 rounded-2xl border-[1px]">
          <div className="flex items-center space-x-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 overflow-hidden flex items-center justify-center shadow-[0_4px_15px_rgba(220,38,38,0.3)] border border-white/10">
                <img 
                  src="/kicklive_logo.jpg" 
                  alt="KickLive Logo Icon" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#050507] animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tighter flex items-center leading-none">
                <span className="text-white brightness-110">Kick</span>
                <span className="text-red-500 font-extrabold ml-0.5">Live</span>
                <span className="text-red-500 font-black">.</span>
              </div>
              <p className="text-[10px] text-white/40 font-mono tracking-wider mt-1.5 flex items-center space-x-1 uppercase">
                <span>PREMIUM SPORTS LIVE STREAM STATIONS</span>
              </p>
            </div>
          </div>

          {/* Search Box + Refresh */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams, championships, sports..."
                className="w-full md:w-72 bg-white/5 hover:bg-white/10 border border-white/10 focus:border-white/20 focus:ring-0 text-white text-xs rounded-full pl-10 pr-4 py-2.5 outline-none transition-all placeholder-white/30"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerRefresh}
              title="Refresh Event Feeds"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 hover:text-white text-white/60 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-orange-500" : ""} />
            </motion.button>
          </div>
        </header>

        {/* Categories filters menu */}
        {!sportsLoading && (
          <SportsFilter 
            sports={sports} 
            selectedSportId={selectedSportId} 
            onSelectSport={(id) => {
              setSelectedSportId(id);
              // Reset to "all" if sport category changes and filter is not compliant
              if (activeFilter === "favorites") return;
              setActiveFilter("all");
            }} 
          />
        )}

        {/* Hero Banner display if no match is streaming currently */}
        {!selectedMatch && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-1/4 w-44 h-44 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-red-400 bg-red-500/10 border border-red-500/20">
                <Trophy size={10} className="text-orange-500" />
                <span>Premium Quality Client</span>
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight text-white">
                KickLive Broadcasts & Real-Time Stats Studio
              </h2>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-medium">
                Stream free live soccer tournaments, basketball playoffs, grand slam tennis matches, and intense fight cards. Toggle server nodes for the best bandwidth, track team tactics, and chat with fellow fans!
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] font-medium text-white/50">
                <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Interactive Live Scoreboards</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-550 bg-orange-500" />
                  <span>Express Node API Proxy</span>
                </span>
              </div>
            </div>

            <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center shrink-0">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-red-500/30 scale-110" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-orange-500/20 scale-125" 
              />
              <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-center p-3 shadow-lg">
                <Tv className="text-red-500 mb-1" size={24} />
                <span className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">HQ PLAY</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Media Player + Stats Layout columns */}
        <AnimatePresence mode="wait">
          {selectedMatch && (
            <motion.div
              layoutId={`player-deck-${selectedMatch.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* Left Column: Player and stats (spans 2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Embedded Stream Window */}
                <StreamPlayer 
                  match={selectedMatch} 
                  onClose={() => setSelectedMatch(null)} 
                />

                {/* Tactical Stats dashboard */}
                <StatsPanel match={selectedMatch} />
              </div>

              {/* Right Column: Live chat room */}
              <div className="space-y-6">
                <LiveChat matchId={selectedMatch.id} category={selectedMatch.category} />
                
                {/* Broadcaster announcement sticky card */}
                <div className="glass-panel rounded-2xl p-4 space-y-3 relative overflow-hidden bg-slate-950/40">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Heart className="fill-emerald-400/20" size={14} />
                    <span className="text-xs font-bold font-display">Broadcast Center Tips</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                    Experiencing delays or buffers? Tap any of the alternative <b>Server Nodes</b> below the player screen. We support high definition relays mapped to diverse languages.
                  </p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Matches Feed Header tabs */}
        <div className="flex flex-col space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            
            {/* Nav tabs block */}
            <div className="flex flex-wrap items-center gap-1.5">
              
              {[
                { id: "live", label: "Live Now", icon: Radio, count: liveCount },
                { id: "today", label: "Today's Games", icon: Clock, count: null },
                { id: "popular", label: "Popular", icon: Flame, count: null },
                { id: "all", label: "All Schedules", icon: Calendar, count: null },
                { id: "favorites", label: "Watchlist", icon: Heart, count: favorites.length }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFilter === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFilter(tab.id as FilterType)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white border-transparent shadow-[0_4px_15px_rgba(220,38,38,0.25)] font-bold"
                        : "text-white/60 hover:text-white border-white/5 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={12} className={isActive ? "text-white animate-pulse" : "text-white/40"} />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-black/35 text-white" : "bg-white/10 text-white/40"}`}>
                        {tab.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-white/40">
              Showing {searchedMatches.length} available events
            </span>
          </div>

          {/* Matches Grid display with loader or blank screens */}
          {matchesLoading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center space-y-3 text-white/40">
              <Loader2 className="animate-spin text-red-500" size={32} />
              <p className="text-xs font-mono tracking-wider">HARVESTING TOURNAMENTS FEEDS...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {searchedMatches.length > 0 ? (
                <motion.div 
                  layout
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {searchedMatches.map((match) => (
                    <motion.div key={match.id} className="contents">
                      <MatchCard
                        match={match}
                        isFavorite={favorites.includes(match.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelect={(m) => {
                          setSelectedMatch(m);
                          // Instant scroll down or up to active streaming portal
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        isSelected={selectedMatch?.id === match.id}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4"
                >
                  <AlertTriangle className="text-red-500/80" size={36} />
                  <div>
                    <h3 className="text-sm font-bold text-white/90">No matching events discovered</h3>
                    <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
                      {activeFilter === "favorites" 
                        ? "Your watchlist is currently empty. Star live events to create a customized sporting schedule!"
                        : "We couldn't locate any events matching your selected sports category. Try editing filters or keywords!"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>

      </div>

      {/* Atmospheric & Immersive Media Status Footer */}
      <footer className="relative z-10 px-8 py-4 bg-black/40 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-auto font-mono">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            STREAM CLUSTER: STABLE
          </div>
          <div>LATENCY: 42MS</div>
          <div>API SOURCE: ONLINE</div>
        </div>
        <div className="flex gap-6">
          <span className="text-white/60">© 2026 KICKLIVE PLATFORM</span>
        </div>
      </footer>
      
    </div>
  );
}
