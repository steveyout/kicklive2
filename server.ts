import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const EXTERNAL_BASE_URL = "https://streamed.pk";

// Dynamic pre-seeded fallback data for live matches and streaming info
const MOCK_SPORTS = [
  { id: "football", name: "Football" },
  { id: "basketball", name: "Basketball" },
  { id: "tennis", name: "Tennis" },
  { id: "hockey", name: "Hockey" },
  { id: "baseball", name: "Baseball" },
  { id: "mma", name: "MMA" },
  { id: "boxing", name: "Boxing" }
];

const getMockMatches = () => {
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

const MOCK_STREAMS: Record<string, any[]> = {
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

// JSON proxy logic with graceful fallback
async function fetchFromExternal(endpoint: string) {
  const url = `${EXTERNAL_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(4000) // 4 second timeout
    });
    if (!response.ok) {
      console.warn(`External API returned status: ${response.status} for ${endpoint}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error fetching from external API (${endpoint}):`, err);
    return null;
  }
}

// REST endpoints mapped cleanly

// Get sports categories
app.get("/api/sports", async (req, res) => {
  const data = await fetchFromExternal("/api/sports");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  // Fallback
  return res.json(MOCK_SPORTS);
});

// Helper filters for mock matches
function filterMockMatches(type: string, param?: string) {
  const list = getMockMatches();
  const now = Date.now();
  switch (type) {
    case "all":
      return list;
    case "all-popular":
      return list.filter(m => m.popular);
    case "today":
      // All matches are configured for today in mock data
      return list;
    case "today-popular":
      return list.filter(m => m.popular);
    case "live":
      // A match is live if its start date is in the past and not finished yet (within 2 hours)
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

// Matches All
app.get("/api/matches/all", async (req, res) => {
  const data = await fetchFromExternal("/api/matches/all");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("all"));
});

app.get("/api/matches/all/popular", async (req, res) => {
  const data = await fetchFromExternal("/api/matches/all/popular");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("all-popular"));
});

// Matches Today
app.get("/api/matches/all-today", async (req, res) => {
  const data = await fetchFromExternal("/api/matches/all-today");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("today"));
});

app.get("/api/matches/all-today/popular", async (req, res) => {
  const data = await fetchFromExternal("/api/matches/all-today/popular");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("today-popular"));
});

// Matches Live
app.get("/api/matches/live", async (req, res) => {
  const data = await fetchFromExternal("/api/matches/live");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("live"));
});

app.get("/api/matches/live/popular", async (req, res) => {
  const data = await fetchFromExternal("/api/matches/live/popular");
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("live-popular"));
});

// Matches Sport specific
app.get("/api/matches/:sport", async (req, res) => {
  const sport = req.params.sport;
  const data = await fetchFromExternal(`/api/matches/${sport}`);
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("sport", sport));
});

app.get("/api/matches/:sport/popular", async (req, res) => {
  const sport = req.params.sport;
  const data = await fetchFromExternal(`/api/matches/${sport}/popular`);
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  return res.json(filterMockMatches("sport-popular", sport));
});

// Streams Endpoint
app.get("/api/stream/:source/:id", async (req, res) => {
  const { source, id } = req.params;
  const data = await fetchFromExternal(`/api/stream/${source}/${id}`);
  if (data && Array.isArray(data) && data.length > 0) {
    return res.json(data);
  }
  
  // Return mock stream source if fallback matches are active
  const streams = MOCK_STREAMS[id] || [
    {
      id: `fallback_${source}_${id}`,
      streamNo: 1,
      language: "English",
      hd: true,
      embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1",
      source: source
    }
  ];
  return res.json(streams);
});

// Images WebP Redirect or Local Static Badge Rendering
app.get("/api/images/badge/:id.webp", (req, res) => {
  const id = req.params.id;
  // Let the browser directly fetch from streamed.pk or redirect it.
  // Redirecting prevents CORS, saves proxy bandwidth, and is instantly cached
  res.redirect(`${EXTERNAL_BASE_URL}/api/images/badge/${id}.webp`);
});

app.get("/api/images/poster/:home/:away.webp", (req, res) => {
  const { home, away } = req.params;
  res.redirect(`${EXTERNAL_BASE_URL}/api/images/poster/${home}/${away}.webp`);
});

app.get("/api/images/proxy/:poster.webp", (req, res) => {
  const poster = req.params.poster;
  res.redirect(`${EXTERNAL_BASE_URL}/api/images/proxy/${poster}.webp`);
});

// Vite middleware for direct index.html rendering & server side rendering pipeline
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Status] Sports Proxy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
