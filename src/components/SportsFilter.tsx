import React from "react";
import { motion } from "motion/react";
import { 
  Trophy, 
  Dribbble, 
  Target, 
  Swords, 
  Flame, 
  Zap, 
  Tv, 
  Compass,
  Cpu
} from "lucide-react";
import { Sport } from "../types";

interface SportsFilterProps {
  sports: Sport[];
  selectedSportId: string | null;
  onSelectSport: (sportId: string | null) => void;
}

// Icon mapper for sport categories to Lucide React icons
const SPORT_ICONS: Record<string, React.ComponentType<any>> = {
  football: Trophy,
  basketball: Dribbble,
  tennis: Target,
  mma: Swords,
  boxing: Flame,
  baseball: Zap,
  hockey: Cpu // Technical vibe
};

export default function SportsFilter({ 
  sports, 
  selectedSportId, 
  onSelectSport 
}: SportsFilterProps) {
  
  return (
    <div className="w-full overflow-hidden py-3">
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        
        {/* All Sports button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectSport(null)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 snap-start shrink-0 cursor-pointer border ${
            selectedSportId === null
              ? "bg-gradient-to-r from-red-600 to-orange-500 text-white border-transparent shadow-[0_4px_15px_rgba(220,38,38,0.25)]"
              : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Compass size={16} className={selectedSportId === null ? "text-white animate-pulse" : "text-white/40"} />
          <span>All Events</span>
        </motion.button>

        {/* Dynamic Sports buttons */}
        {sports.map((sport) => {
          const IconComponent = SPORT_ICONS[sport.id] || Tv;
          const isSelected = selectedSportId === sport.id;
          
          return (
            <motion.button
              key={sport.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectSport(sport.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 snap-start shrink-0 cursor-pointer border ${
                isSelected
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white border-transparent shadow-[0_4px_15px_rgba(220,38,38,0.25)]"
                  : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
              }`}
            >
              <IconComponent 
                size={16} 
                className={isSelected ? "text-white animate-pulse" : "text-white/40"} 
              />
              <span>{sport.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
