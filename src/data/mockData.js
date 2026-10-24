// Mock data for royalty-free photography carousel, search, and Spotify presets

export const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "Alpine Mist & Emerald Valleys",
    category: "Nature & Wilderness",
    description: "Capturing the serene morning sunrise sweeping across jagged alpine peaks and pristine pine forests.",
    photographer: "Luca Bravo",
    photographerUrl: "https://unsplash.com/@lucabravo",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=70",
    badge: "Featured • 4K",
    accent: "from-emerald-600/70 to-slate-950/90"
  },
  {
    id: 2,
    title: "Futuristic Cyber Neon Metropolis",
    category: "Technology & Urban",
    description: "Glowing neon reflections on rainy asphalt through high-density urban transit hubs and cyber architecture.",
    photographer: "Aleksandar Pasaric",
    photographerUrl: "https://unsplash.com/@aleksandar",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=70",
    badge: "Trending • Tech",
    accent: "from-blue-600/70 to-indigo-950/90"
  },
  {
    id: 3,
    title: "Golden Hour Ocean Horizon",
    category: "Coast & Atmosphere",
    description: "Rhythmic rolling tide crashing gently over golden sands under a vibrant twilight sky.",
    photographer: "Sean Oulashin",
    photographerUrl: "https://unsplash.com/@oulashin",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=70",
    badge: "Relaxation • Nature",
    accent: "from-amber-600/70 to-slate-950/90"
  },
  {
    id: 4,
    title: "Minimalist Geometry & Glass Façade",
    category: "Architecture & Design",
    description: "Striking structural symmetry and clean shadows of contemporary glass skyscrapers.",
    photographer: "Joel Filipe",
    photographerUrl: "https://unsplash.com/@joelfilip",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=70",
    badge: "Minimalism • Design",
    accent: "from-sky-700/70 to-slate-950/90"
  },
  {
    id: 5,
    title: "Modern Developer Workspace",
    category: "Productivity & Code",
    description: "Clean desk setup with ambient warm lighting, mechanical keyboard, and crisp high-res code editor displays.",
    photographer: "Christopher Gower",
    photographerUrl: "https://unsplash.com/@cgower",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=70",
    badge: "Workspace • Dev",
    accent: "from-violet-700/70 to-slate-950/90"
  },
  {
    id: 6,
    title: "Abstract Fluid Energy Flow",
    category: "Creative & Abstract",
    description: "Dynamic marbling of vibrant acrylic pigments flowing in harmonious cosmic waves.",
    photographer: "Milad Fakurian",
    photographerUrl: "https://unsplash.com/@fakurian",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=200&q=70",
    badge: "Abstract • Art",
    accent: "from-rose-600/70 to-slate-950/90"
  }
];

export const SPOTIFY_PRESETS = [
  {
    id: "top-hits",
    name: "Today's Top Hits",
    type: "Playlist",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator",
    duration: "50+ Tracks"
  },
  {
    id: "lofi-beats",
    name: "Chilled Lo-Fi Beats",
    type: "Playlist",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator",
    duration: "Deep Focus"
  },
  {
    id: "synthwave",
    name: "Synthwave / Cyberpunk Drive",
    type: "Playlist",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator",
    duration: "Retro Vibes"
  }
];

export const SEARCHABLE_CONTENT = [
  { type: "Carousel", title: "Alpine Mist & Emerald Valleys", category: "Nature", targetId: "carousel" },
  { type: "Carousel", title: "Futuristic Cyber Neon Metropolis", category: "Technology", targetId: "carousel" },
  { type: "Carousel", title: "Golden Hour Ocean Horizon", category: "Travel", targetId: "carousel" },
  { type: "Carousel", title: "Minimalist Geometry & Glass Façade", category: "Architecture", targetId: "carousel" },
  { type: "Media", title: "Spotify Embed: Today's Top Hits & Lo-Fi", category: "Music", targetId: "media-section" },
  { type: "Media", title: "YouTube 4K Ultra HD Video Player Embed", category: "Video", targetId: "media-section" },
  { type: "Media", title: "Twitter / X Social Interactive Card", category: "Social", targetId: "media-section" },
  { type: "Media", title: "Instagram Modern Post Carousel Card", category: "Social", targetId: "media-section" },
  { type: "Utility", title: "Contact Me Modal & Feedback Form", category: "Essentials", action: "openContact" },
  { type: "Feature", title: "Viewport Responsive Breakpoint Tester", category: "Testing Tools", targetId: "test-features" }
];
