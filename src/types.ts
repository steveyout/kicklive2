export interface Sport {
  id: string;
  name: string;
}

export interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number; // UNIX Millisecond timestamp
  poster?: string;
  popular: boolean;
  teams?: {
    home?: {
      name: string;
      badge: string; // WebP image ID or code
    };
    away?: {
      name: string;
      badge: string; // WebP image ID or code
    };
  };
  sources: {
    source: string;
    id: string;
  }[];
}

export interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

export interface MatchStats {
  possession: { home: number; away: number }; // Percentage e.g. 52 - 48
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface LineupPlayer {
  number: number;
  name: string;
  position: string;
}

export interface MatchLineups {
  home: LineupPlayer[];
  away: LineupPlayer[];
}

export interface MatchTimelineEvent {
  minute: number;
  type: "goal" | "card" | "substitute" | "period" | "shot";
  team: "home" | "away" | "neutral";
  player: string;
  description: string;
}
