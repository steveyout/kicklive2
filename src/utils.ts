import { MatchStats, MatchLineups, MatchTimelineEvent } from "./types";

// Generates sleek vector crests with dynamic initials if actual source badges are unavailable
export function getTeamBadgeFallback(teamName: string, category: string): string {
  const initials = teamName.substring(0, 3).toUpperCase();
  let baseColor = "#3b82f6"; // Blue default
  
  if (category === "football") {
    if (teamName.toLowerCase().includes("arsenal")) baseColor = "#ef4444"; // Red
    else if (teamName.toLowerCase().includes("chelsea")) baseColor = "#2563eb"; // Royal Blue
    else if (teamName.toLowerCase().includes("real")) baseColor = "#f59e0b"; // Gold/White
    else if (teamName.toLowerCase().includes("manchester city")) baseColor = "#0ea5e9"; // Sky Blue
    else if (teamName.toLowerCase().includes("bayern")) baseColor = "#dc2626"; // Crimson Red
    else if (teamName.toLowerCase().includes("paris")) baseColor = "#1e3a8a"; // Navy Blue
  } else if (category === "basketball") {
    if (teamName.toLowerCase().includes("celtics")) baseColor = "#10b981"; // Celtic Green
    else if (teamName.toLowerCase().includes("warriors")) baseColor = "#eab308"; // Warrior Yellow
    else if (teamName.toLowerCase().includes("lakers")) baseColor = "#8b5cf6"; // Purple Lakers
    else if (teamName.toLowerCase().includes("heat")) baseColor = "#f97316"; // Orange Heat
  } else if (category === "tennis") {
    baseColor = "#84cc16"; // Lime Tennis Green
  } else if (category === "mma") {
    baseColor = "#6b7280"; // Gray Steel
  } else if (category === "boxing") {
    baseColor = "#b91c1c"; // Dark Crimson Fight
  } else if (category === "hockey") {
    baseColor = "#06b6d4"; // Cyan Blue Eco Ice
  }

  // Return a stylish inline SVG data URL using high-end display elements
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="grad-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${baseColor}" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="30" fill="url(#grad-${initials})" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
    <text x="50" y="58" font-family="'Space Grotesk', system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">${initials}</text>
  </svg>`.replace(/"/g, "'").replace(/\n/g, "").trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate premium mock Match Statistics for active boards
export function generateMockStats(matchId: string): MatchStats {
  // Let stats stay pseudo-random but stable based on matchId hash
  let sum = 0;
  for (let i = 0; i < matchId.length; i++) {
    sum += matchId.charCodeAt(i);
  }
  const posHome = 40 + (sum % 21); // 40% to 60%
  const shotsHome = 8 + (sum % 11); // 8 to 18
  const shotsAway = 7 + ((sum * 3) % 11);
  const targetHome = Math.floor(shotsHome * (0.3 + (sum % 4) * 0.1));
  const targetAway = Math.floor(shotsAway * (0.28 + (sum % 4) * 0.1));

  return {
    possession: { home: posHome, away: 100 - posHome },
    shots: { home: shotsHome, away: shotsAway },
    shotsOnTarget: { home: targetHome, away: targetAway },
    fouls: { home: 6 + (sum % 10), away: 7 + ((sum * 2) % 10) },
    yellowCards: { home: sum % 4, away: (sum * 2) % 5 },
    redCards: { home: sum % 13 === 0 ? 1 : 0, away: sum % 17 === 0 ? 1 : 0 }
  };
}

// Dynamic Team Line-ups compiler
export function generateMockLineups(homeTeam: string, awayTeam: string, category: string): MatchLineups {
  const isBball = category === "basketball";
  
  const footballHomePlayers = [
    { number: 1, name: "Henderson (GK)", position: "Goalkeeper" },
    { number: 2, name: "Gabriel", position: "Defender" },
    { number: 4, name: "Saliba", position: "Defender" },
    { number: 6, name: "White", position: "Defender" },
    { number: 8, name: "Rice", position: "Midfielder" },
    { number: 10, name: "Odegaard", position: "Midfielder" },
    { number: 11, name: "Martinelli", position: "Midfielder" },
    { number: 12, name: "Saka", position: "Forward" },
    { number: 19, name: "Havertz", position: "Forward" },
    { number: 20, name: "Jesus", position: "Forward" },
    { number: 22, name: "Raya", position: "Sub" }
  ];

  const footballAwayPlayers = [
    { number: 1, name: "Courtois (GK)", position: "Goalkeeper" },
    { number: 3, name: "Militao", position: "Defender" },
    { number: 5, name: "Rudiger", position: "Defender" },
    { number: 17, name: "Valverde", position: "Midfielder" },
    { number: 8, name: "Kroos", position: "Midfielder" },
    { number: 10, name: "Modric", position: "Midfielder" },
    { number: 11, name: "Rodrygo", position: "Forward" },
    { number: 7, name: "Vinicius Jr", position: "Forward" },
    { number: 9, name: "Mbappe", position: "Forward" },
    { number: 14, name: "Tchouameni", position: "Midfielder" },
    { number: 13, name: "Lunin", position: "Sub" }
  ];

  const basketHomePlayers = [
    { number: 0, name: "Tatum", position: "Forward" },
    { number: 7, name: "Brown", position: "Forward" },
    { number: 8, name: "Porzingis", position: "Center" },
    { number: 4, name: "White", position: "Guard" },
    { number: 9, name: "Holiday", position: "Guard" }
  ];

  const basketAwayPlayers = [
    { number: 30, name: "Curry", position: "Guard" },
    { number: 11, name: "Thompson", position: "Guard" },
    { number: 23, name: "Green", position: "Forward" },
    { number: 22, name: "Wiggins", position: "Forward" },
    { number: 32, name: "Jackson-Davis", position: "Center" }
  ];

  const singleHome = [
    { number: 1, name: homeTeam, position: "Player" },
    { number: 10, name: "Coach / Team Leader", position: "Support" }
  ];

  const singleAway = [
    { number: 1, name: awayTeam, position: "Player" },
    { number: 10, name: "Coach / Team Leader", position: "Support" }
  ];

  if (category === "football" || category === "hockey") {
    return { 
      home: footballHomePlayers.map(p => ({ ...p, name: p.name.replace("Gabriel", homeTeam.substring(0, 5)) })), 
      away: footballAwayPlayers.map(p => ({ ...p, name: p.name.replace("Vinicius", awayTeam.substring(0, 5)) })) 
    };
  } else if (isBball) {
    return { home: basketHomePlayers, away: basketAwayPlayers };
  } else {
    return { home: singleHome, away: singleAway };
  }
}

// Simulated real-time action events timeline
export function generateMockTimeline(matchId: string, homeTeam: string, awayTeam: string, category: string): MatchTimelineEvent[] {
  const isBball = category === "basketball";
  
  if (isBball) {
    return [
      { minute: 1, type: "shot", team: "home", player: "Home Star", description: "Incredible 3-pointer directly from the corner flag area! Home fans chanting." },
      { minute: 4, type: "shot", team: "away", player: "Away Key", description: "Smooth jump shot after a tactical isolation play." },
      { minute: 12, type: "period", team: "neutral", player: "Referee", description: "End of the First Quarter. High energy transition gameplay." },
      { minute: 15, type: "card", team: "away", player: "Away Center", description: "Technical Foul - aggressive blocking outline call." },
      { minute: 24, type: "period", team: "neutral", player: "Referee", description: "Half-time. Creative choreography executing on court." }
    ];
  }

  return [
    { minute: 3, type: "period", team: "neutral", player: "Referee", description: "Kickoff! The referee blows his horn. Fans are screaming in anticipation." },
    { minute: 14, type: "shot", team: "home", player: "Home Midfielder", description: "Screamer from outside the box hitting the left post!" },
    { minute: 28, type: "goal", team: "home", player: homeTeam.split(" ")[0] + " Striker", description: "GOAAAAAL!! A superb curling free-kick flying over the wall into the top right corner! Gorgeous curve." },
    { minute: 41, type: "card", team: "away", player: "Defensive Midfielder", description: "Yellow Card. Harsh tactical challenge holding back the swift counterattack." },
    { minute: 45, type: "period", team: "neutral", player: "Referee", description: "Half-time interval. Strategy discussions active." }
  ];
}

// Convert Millisecond Times to user-friendly local formats
export function formatMatchTime(timestamp: number): string {
  const date = new Date(timestamp);
  
  // Format to e.g. "Today 20:45" or "14 Jul, 19:30"
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
                  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  if (isToday) {
    return `Today at ${timeStr}`;
  } else {
    const month = date.toLocaleDateString([], { month: 'short' });
    const day = date.getDate();
    return `${day} ${month}, ${timeStr}`;
  }
}

// Checks if a match is currently live (started and not completed - 2 hour window)
export function isMatchLive(timestamp: number): boolean {
  const now = Date.now();
  const twoHours = 2 * 3600 * 1000;
  return now >= timestamp && now - timestamp < twoHours;
}

// Calculates how far into a live match we are in minutes (clamped between 1 and 120)
export function getLiveMinutes(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins <= 0) return "1'";
  if (diffMins > 90) return "90+'";
  return `${diffMins}'`;
}
