# PulseCraft - Responsive React.js Testing Website

A modern, responsive dummy testing website built with **React.js** designed for UI evaluation, responsiveness testing, and media embedding verification.

---

## 🚀 Quick Start (Zero Setup Required!)

You can run and test this website **immediately without installing anything**:

1. **Direct Browser Open:**
   - Simply double-click **`index.html`** or right-click and choose **Open with > Microsoft Edge / Google Chrome / Brave / Firefox**.
   - The standalone `index.html` file includes React 18, Babel standalone JSX compiler, and Tailwind CSS via CDN. Everything works out of the box!

2. **Standard Vite + React Development (Optional when Node.js is installed):**
   ```bash
   npm install
   npm run dev
   ```

---

## 🌟 Features Implemented

### 1. Header (Bare Essentials)
- **"Contact Me" Button:** Prominently positioned gradient button that opens a comprehensive Contact Modal with validation, simulated async submission, and success state.
- **Search Bar:**
  - Real-time search query filtering across carousel slides, Spotify tracks, and site features.
  - Keyboard shortcut: Press `/` anywhere to immediately focus the search bar.
  - Expandable mobile search bar with smooth slide-down animation.
- **Theme Switcher:** Seamless Dark Mode / Light Mode toggle with persistence.
- **Responsive Mobile Menu:** Slide-out drawer menu with quick navigation links for smartphones and tablets.

### 2. Royalty-Free Photo Carousel
- **6 High-Resolution Royalty-Free Photos:** Curated from Unsplash across nature, futuristic cyberpunk, ocean sunset, architecture, developer workspace, and abstract fluid art.
- **Mobile Touch-Friendly:** Full swipe support (`touchStart`, `touchMove`, `touchEnd`) on mobile devices.
- **Interactive Controls:**
  - Next / Previous buttons with smooth fade-in animations.
  - Autoplay toggle (Start / Pause).
  - Dot pagination indicators and clickable thumbnail strip.
  - Fullscreen Lightbox mode with Escape key exit.
  - Active slide counter (e.g., `01 / 06`) and photographer attribution links.

### 3. Spotify & Social Media Embedding Hub
- **Spotify Embed Player:**
  - Official Spotify iframe embed container supporting playlists, albums, and tracks.
  - Preset switcher: *Today's Top Hits*, *Chilled Lo-Fi Beats*, and *Synthwave Drive*.
  - **Custom Spotify URL Tester:** Paste any `open.spotify.com/...` URL to immediately test live playback!
- **YouTube Embed Player:**
  - 16:9 responsive video container with preset relaxation and nature videos.
- **Social Media Cards:**
  - **Twitter / X Card:** Interactive tweet card with working Like counter increment/decrement, retweet simulator, and media preview.
  - **Instagram Post Card:** Double-tap heart animation, engagement counters, and audio credit.

### 4. Testing & QA Utilities Panel
- **Live Viewport Diagnostics:** Real-time window dimension gauge (`Width × Height` in pixels).
- **Breakpoint Indicator:** Visual tag highlighting current active CSS breakpoint (`xs / Mobile`, `sm`, `md / Tablet`, `lg / Laptop`, `xl+ / Desktop`).
- **Mock Event Triggers:** Buttons to trigger simulated API 200 responses, cache invalidation alerts, and toast notifications.

---

## 📱 Cross-Device Compatibility

- **Mobile Phones (320px - 640px):** Hamburger menu, collapsible search, touch swiping on the carousel, single-column responsive media feeds.
- **Tablets (768px - 1024px):** Adaptive 2-column layout, touch-friendly buttons, thumbnail preview row.
- **Desktops (1280px+):** Centered search bar with keyboard shortcut kbd badge, wide aspect-ratio carousel, side-by-side Spotify and social feeds.

---

## 📂 Project Structure

```
website/
├── index.html                 # Standalone zero-setup React 18 application (open directly)
├── package.json               # Modern Vite + React project configuration
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS styling configuration
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Master React component
│   ├── index.css             # Tailwind base styles
│   ├── data/
│   │   └── mockData.js       # Curated carousel slides, Spotify links & search index
│   └── components/
│       ├── Header.jsx        # Sticky header with search, contact & theme toggle
│       ├── Hero.jsx          # Welcome banner with action buttons
│       ├── PhotoCarousel.jsx # Swipeable royalty-free photo carousel
│       ├── MediaSection.jsx  # Spotify player & social media embeds
│       ├── TestFeatures.jsx  # Viewport size gauge & test triggers
│       ├── ContactModal.jsx  # Interactive contact form modal
│       └── Footer.jsx        # Footer with links and newsletter test
└── README.md
```
