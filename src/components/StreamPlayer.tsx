import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Tv, 
  Tv2, 
  Volume2, 
  VolumeX, 
  Info, 
  Maximize, 
  Compass, 
  Sparkles, 
  RotateCcw,
  Zap,
  Globe,
  Loader2
} from "lucide-react";
import { APIMatch, Stream } from "../types";
import { formatMatchTime, isMatchLive, getLiveMinutes } from "../utils";

interface StreamPlayerProps {
  match: APIMatch;
  onClose?: () => void;
}

export default function StreamPlayer({ match, onClose }: StreamPlayerProps) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const [useBackupEngine, setUseBackupEngine] = useState<boolean>(false);
  
  const sources = match.sources || [];
  const currentSource = sources[activeSourceIndex];

  // Fetch streams for the selected match source
  useEffect(() => {
    if (!currentSource) {
      setLoading(false);
      setError("No broadcast sources configured for this match.");
      return;
    }

    setLoading(true);
    setError(null);
    setStreams([]);
    setSelectedStream(null);

    const controller = new AbortController();
    
    fetch(`/api/stream/${currentSource.source}/${currentSource.id}`, {
      signal: controller.signal
    })
      .then((res) => {
        if (!res.ok) throw new Error("API streaming error");
        return res.json();
      })
      .then((data: Stream[]) => {
        if (data && data.length > 0) {
          setStreams(data);
          setSelectedStream(data[0]); // Setup first language stream automatically
        } else {
          setError("No active stream directories returned for this source.");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Stream fetch failure:", err);
          setError("Failed to resolve live streaming streams. Falling back to primary channels.");
          // Provide fallback stream
          const fallbackList: Stream[] = [
            {
              id: `fb_1_${currentSource.id}`,
              streamNo: 1,
              language: "English Broadcaster",
              hd: true,
              embedUrl: `https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&rel=0`,
              source: currentSource.source
            },
            {
              id: `fb_2_${currentSource.id}`,
              streamNo: 2,
              language: "Stadium Ambient Feed",
              hd: false,
              embedUrl: `https://www.youtube.com/embed/6eFm5_v7Fkw?autoplay=1&mute=1`,
              source: currentSource.source
            }
          ];
          setStreams(fallbackList);
          setSelectedStream(fallbackList[0]);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [match.id, activeSourceIndex]);

  // Clean embed URL of extra query parameters or modify autoplay settings
  const getEmbedUrl = () => {
    if (!selectedStream) return "";
    
    // Check if the user opted into backup local dashboard video loop
    if (useBackupEngine) {
      // Loop a beautiful sport-stadium neon background
      return "https://www.youtube.com/embed/UreS05T9a4U?autoplay=1&mute=1&controls=0&loop=1&playlist=UreS05T9a4U";
    }

    let url = selectedStream.embedUrl;
    // Inject appropriate controls
    if (url.includes("youtube.com")) {
      const separator = url.includes("?") ? "&" : "?";
      const userMutedParam = muted ? "mute=1" : "mute=0";
      return `${url}${separator}autoplay=1&${userMutedParam}&rel=0&modestbranding=1&iv_load_policy=3`;
    }
    return url;
  };

  const isLive = isMatchLive(match.date);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Broadcast Screen Header */}
      <div className="flex items-center justify-between text-white border-b border-slate-900/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/20 shadow-inner">
            <Tv2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display tracking-tight text-white leading-tight">
              {match.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono flex items-center space-x-1">
              <span className="capitalize text-sky-400 font-semibold">{match.category}</span>
              <span>•</span>
              <span>
                {isLive ? `Live in session (${getLiveMinutes(match.date)})` : formatMatchTime(match.date)}
              </span>
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Hide Player
          </button>
        )}
      </div>

      {/* Primary Video Screen */}
      <div className="relative aspect-video glass-panel rounded-2xl overflow-hidden shadow-2xl border-[1px] border-slate-800/80 group">
        
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 text-slate-400 space-y-3">
            <Loader2 className="animate-spin text-sky-400" size={32} />
            <p className="text-xs font-mono tracking-wider">RESOLVING LIVE STREAMS CHANNELS...</p>
          </div>
        ) : null}

        {/* Live HUD scoreboard overlaid on stream */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 pointer-events-none">
          {isLive && (
            <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white font-mono uppercase tracking-wider">
                LIVE HD
              </span>
              <span className="text-slate-500 font-mono">|</span>
              <span className="text-[10px] font-bold text-sky-400 font-mono">
                {getLiveMinutes(match.date)}
              </span>
            </div>
          )}
        </div>

        {/* Floating Toolbar inside player on hover */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => setMuted(!muted)}
            title={muted ? "Unmute Audio" : "Mute Audio"}
            className="p-1 px-2 rounded-lg hover:bg-slate-800/80 text-white transition-colors cursor-pointer"
          >
            {muted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-emerald-400" />}
          </button>
          <button 
            onClick={() => setUseBackupEngine(!useBackupEngine)}
            title="Alternative Stream Player"
            className={`p-1 px-2 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer ${useBackupEngine ? "text-emerald-400" : "text-white"}`}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Dynamic Multi-Channel Frame Embedding */}
        <AnimatePresence mode="wait">
          {selectedStream ? (
            <motion.iframe
              key={selectedStream.id + (useBackupEngine ? "_backup" : "_main")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={getEmbedUrl()}
              className="w-full h-full"
              allowFullScreen
              referrerPolicy="no-referrer"
              allow="autoplay; encrypted-media; picture-in-picture"
              scrolling="no"
              frameBorder="0"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Info size={36} className="text-slate-500" />
              <h4 className="text-sm font-bold text-slate-300">Broadcast Currently Unavailable</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                No active source streaming feeds have been registered yet for this tournament. Please select another source below.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Signal Quality Controls, Server Nodes, Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Source Nodes Selector */}
        <div className="glass-panel rounded-xl p-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-semibold uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Zap size={12} className="text-red-500" />
              <span>Available Server Nodes ({sources.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {sources.map((src, index) => (
              <button
                key={`${src.source}-${index}`}
                onClick={() => {
                  setActiveSourceIndex(index);
                  setUseBackupEngine(false);
                }}
                className={`text-[11px] px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                  activeSourceIndex === index
                    ? "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                Server Node {src.source.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Stream Detail Filters */}
        <div className="glass-panel rounded-xl p-4 flex flex-col space-y-2">
          <span className="text-xs text-white/60 font-semibold uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <Globe size={12} className="text-orange-500" />
            <span>Select Audio Commentary Channel</span>
          </span>

          <div className="flex flex-wrap gap-2 pt-1">
            {streams.length > 0 ? (
              streams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => {
                    setSelectedStream(stream);
                    setUseBackupEngine(false);
                  }}
                  className={`text-[11px] px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 font-semibold transition-all cursor-pointer ${
                    selectedStream?.id === stream.id && !useBackupEngine
                      ? "bg-gradient-to-r from-red-605 to-orange-505 bg-gradient-to-r from-red-650 via-red-550 to-orange-500 text-white border-transparent font-bold shadow-md"
                      : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{stream.language}</span>
                  {stream.hd && (
                    <span className={`px-1 py-0.2 rounded text-[8px] font-black ${
                      selectedStream?.id === stream.id && !useBackupEngine
                        ? "bg-black/30 text-white"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      HD
                    </span>
                  )}
                </button>
              ))
            ) : (
              <span className="text-xs text-white/40 italic mt-1">
                Searching available commentary languages...
              </span>
            )}

            {/* Back Up Video simulator button */}
            <button
              onClick={() => setUseBackupEngine(true)}
              className={`text-[11px] px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 font-semibold transition-all cursor-pointer ${
                useBackupEngine
                  ? "bg-orange-500/20 text-orange-400 border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] font-bold"
                  : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Sparkles size={11} className="text-orange-400 animate-pulse" />
              <span>Back-up Stadium Loop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
