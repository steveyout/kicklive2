// High-fidelity pre-seeded fallback data matching the Express backend
// Ensures 100% offline-first or Jamstack/Static host suitability (Vercel, Netlify)

export interface Sport {
  id: string;
  name: string;
}

export interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  popular: boolean;
  teams: {
    home: { name: string; badge: string };
    away: { name: string; badge: string };
  };
  sources: Array<{ source: string; id: string }>;
}

export interface APIStream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

export const MOCK_SPORTS: Sport[] = [
  { id: "football", name: "Football" },
  { id: "basketball", name: "Basketball" },
  { id: "tennis", name: "Tennis" },
  { id: "hockey", name: "Hockey" },
  { id: "baseball", name: "Baseball" },
  { id: "mma", name: "MMA" },
  { id: "boxing", name: "Boxing" }
];

export const getMockMatches = (): APIMatch[] => {
  const now = Date.now();
  return [
    {
      id: "match_f1",
      title: "Arsenal vs Chelsea",
      category: "football",
      date: now - 35 * 60 * 1000, // Started 35 minutes ago (Live!)
      popular: true,
      teams: {
        home: { name: "Arsenal", badge: "ars" },
        away: { name: "Chelsea", badge: "che" }
      },
      sources: [
        { source: "alpha", id: "ars_che_01" },
        { source: "bravo", id: "ars_che_02" }
      ]
    },
    {
      id: "match_f2",
      title: "Real Madrid vs Manchester City",
      category: "football",
      date: now + 45 * 60 * 1000, // Starts in 45 minutes
      popular: true,
      teams: {
        home: { name: "Real Madrid", badge: "rm" },
        away: { name: "Manchester City", badge: "mci" }
      },
      sources: [
        { source: "charlie", id: "rm_mc_01" }
      ]
    },
    {
      id: "match_f3",
      title: "Paris Saint-Germain vs Bayern Munich",
      category: "football",
      date: now - 20 * 60 * 1000, // Live!
      popular: false,
      teams: {
        home: { name: "Paris Saint-Germain", badge: "psg" },
        away: { name: "Bayern Munich", badge: "fcb" }
      },
      sources: [
        { source: "delta", id: "psg_bay_01" }
      ]
    },
    {
      id: "match_b1",
      title: "Boston Celtics vs Golden State Warriors",
      category: "basketball",
      date: now - 55 * 60 * 1000, // Live!
      popular: true,
      teams: {
        home: { name: "Boston Celtics", badge: "bos" },
        away: { name: "Golden State Warriors", badge: "gsw" }
      },
      sources: [
        { source: "alpha", id: "cel_war_01" },
        { source: "echo", id: "cel_war_02" }
      ]
    },
    {
      id: "match_b2",
      title: "Los Angeles Lakers vs Miami Heat",
      category: "basketball",
      date: now + 2 * 3600 * 1000, // 2 hours from now
      popular: true,
      teams: {
        home: { name: "Los Angeles Lakers", badge: "lal" },
        away: { name: "Miami Heat", badge: "mia" }
      },
      sources: [
        { source: "alpha", id: "lak_hea_01" }
      ]
    },
    {
      id: "match_t1",
      title: "Carlos Alcaraz vs Novak Djokovic",
      category: "tennis",
      date: now - 90 * 60 * 1000, // Live!
      popular: true,
      teams: {
        home: { name: "Carlos Alcaraz", badge: "alc" },
        away: { name: "Novak Djokovic", badge: "djokovic" }
      },
      sources: [
        { source: "bravo", id: "alc_djo_01" }
      ]
    },
    {
      id: "match_m1",
      title: "Jon Jones vs Stipe Miocic",
      category: "mma",
      date: now + 5 * 3600 * 1000, // Scheduled later today
      popular: true,
      teams: {
        home: { name: "Jon Jones", badge: "jones" },
        away: { name: "Stipe Miocic", badge: "miocic" }
      },
      sources: [
        { source: "foxtrot", id: "jon_stipe_01" }
      ]
    },
    {
      id: "match_bx1",
      title: "Canelo Alvarez vs Edgar Berlanga",
      category: "boxing",
      date: now - 15 * 60 * 1000, // Live!
      popular: false,
      teams: {
        home: { name: "Canelo Alvarez", badge: "canelo" },
        away: { name: "Edgar Berlanga", badge: "berlanga" }
      },
      sources: [
        { source: "golf", id: "can_ber_01" }
      ]
    },
    {
      id: "match_h1",
      title: "Edmonton Oilers vs Florida Panthers",
      category: "hockey",
      date: now - 100 * 60 * 1000, // Finished or near end
      popular: false,
      teams: {
        home: { name: "Edmonton Oilers", badge: "edm" },
        away: { name: "Florida Panthers", badge: "fla" }
      },
      sources: [
        { source: "hotel", id: "oil_pan_01" }
      ]
    },
    {
      id: "match_bs1",
      title: "New York Yankees vs Boston Red Sox",
      category: "baseball",
      date: now + 6 * 3600 * 1000, // Scheduled
      popular: true,
      teams: {
        home: { name: "New York Yankees", badge: "nyy" },
        away: { name: "Boston Red Sox", badge: "bosx" }
      },
      sources: [
        { source: "intel", id: "yan_sox_01" }
      ]
    }
  ];
};

export const MOCK_STREAMS: Record<string, APIStream[]> = {
  "ars_che_01": [
    { id: "str_1", streamNo: 1, language: "English", hd: true, embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&rel=0", source: "alpha" },
    { id: "str_2", streamNo: 2, language: "Spanish", hd: false, embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1", source: "alpha" }
  ],
  "ars_che_02": [
    { id: "str_3", streamNo: 1, language: "English Commentary", hd: true, embedUrl: "https://www.youtube.com/embed/UreS05T9a4U?autoplay=1&mute=1", source: "bravo" }
  ],
  "rm_mc_01": [
    { id: "str_4", streamNo: 1, language: "English", hd: true, embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1", source: "charlie" },
    { id: "str_5", streamNo: 2, language: "Spanish", hd: true, embedUrl: "https://www.youtube.com/embed/UreS05T9a4U?autoplay=1&mute=1", source: "charlie" }
  ],
  "psg_bay_01": [
    { id: "str_6", streamNo: 1, language: "French", hd: true, embedUrl: "https://www.youtube.com/embed/UreS05T9a4U?autoplay=1&mute=1", source: "delta" }
  ],
  "cel_war_01": [
    { id: "str_7", streamNo: 1, language: "English (US)", hd: true, embedUrl: "https://www.youtube.com/embed/6eFm5_v7Fkw?autoplay=1&mute=1", source: "alpha" }
  ],
  "cel_war_02": [
    { id: "str_8", streamNo: 1, language: "English Main", hd: true, embedUrl: "https://www.youtube.com/embed/6eFm5_v7Fkw?autoplay=1&mute=1", source: "echo" }
  ],
  "lak_hea_01": [
    { id: "str_9", streamNo: 1, language: "Spanish ESPN", hd: true, embedUrl: "https://www.youtube.com/embed/6eFm5_v7Fkw?autoplay=1&mute=1", source: "alpha" }
  ],
  "alc_djo_01": [
    { id: "str_10", streamNo: 1, language: "English Tennis TV", hd: true, embedUrl: "https://www.youtube.com/embed/WUNf2L7eS28?autoplay=1&mute=1", source: "bravo" }
  ],
  "jon_stipe_01": [
    { id: "str_11", streamNo: 1, language: "English PPV", hd: true, embedUrl: "https://www.youtube.com/embed/UreS05T9a4U?autoplay=1&mute=1", source: "foxtrot" }
  ],
  "can_ber_01": [
    { id: "str_12", streamNo: 1, language: "English DAZN", hd: true, embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1", source: "golf" }
  ],
  "oil_pan_01": [
    { id: "str_13", streamNo: 1, language: "English Sportsnet", hd: true, embedUrl: "https://www.youtube.com/embed/WUNf2L7eS28?autoplay=1&mute=1", source: "hotel" }
  ],
  "yan_sox_01": [
    { id: "str_14", streamNo: 1, language: "English MLB TV", hd: true, embedUrl: "https://www.youtube.com/embed/6eFm5_v7Fkw?autoplay=1&mute=1", source: "intel" }
  ]
};

// Client-side Match filtering helper mimicking Express' filterMockMatches
export function filterClientMatches(type: string, param?: string | null): APIMatch[] {
  const list = getMockMatches();
  const now = Date.now();
  switch (type) {
    case "all":
      return list;
    case "all-popular":
      return list.filter(m => m.popular);
    case "today":
      return list;
    case "today-popular":
      return list.filter(m => m.popular);
    case "live":
      return list.filter(m => now >= m.date && now - m.date < 2 * 3600 * 1000);
    case "live-popular":
      return list.filter(m => m.popular && now >= m.date && now - m.date < 2 * 3600 * 1000);
    case "sport":
      return list.filter(m => m.category === param);
    case "sport-popular":
      return list.filter(m => m.category === param && m.popular);
    default:
      return list;
  }
}
