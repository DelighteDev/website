import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SEARCHABLE_CONTENT } from '../data/mockData';

export default function Header({ onOpenContact, searchQuery, setSearchQuery, isDark, toggleTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  // Keyboard shortcut "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchRef.current && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setShowMobileSearch(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEARCHABLE_CONTENT.filter(item => 
      item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectResult = (item) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    if (item.action === "openContact") {
      onOpenContact();
    } else if (item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <span className="text-white font-black text-xl tracking-tighter">P</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                  Pulse<span className="text-teal-600 dark:text-teal-400">Craft</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                  Test Sandbox
                </span>
              </div>
            </a>
          </div>

          {/* Central Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-4 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search carousel, Spotify, media... (Press '/')"
                className="w-full pl-10 pr-12 py-2 text-sm bg-slate-100/80 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-full border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              ) : (
                <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                  /
                </kbd>
              )}
            </div>

            {/* Dropdown Results */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Matching Test Elements ({searchResults.length})</span>
                  <button onClick={() => setIsSearchFocused(false)} className="hover:text-slate-600 dark:hover:text-white">Esc</button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        onMouseDown={() => handleSelectResult(item)}
                        className="p-3 hover:bg-teal-50/70 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                            {item.title}
                          </span>
                          <span className="text-xs text-slate-500">Category: {item.category}</span>
                        </div>
                        <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                          {item.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-400">
                      No matching elements found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#carousel" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Carousel</a>
            <a href="#media-section" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Spotify & Media</a>
            <a href="#test-features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Test Utilities</a>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* "Contact Me" CTA in Header */}
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md shadow-teal-600/20 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Me</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 pt-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search website..."
              className="w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-5 shadow-2xl">
          <nav className="flex flex-col gap-3 font-medium text-slate-700 dark:text-slate-200">
            <a href="#carousel" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Photo Carousel</a>
            <a href="#media-section" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Spotify & Social Media</a>
            <a href="#test-features" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Testing Utilities</a>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenContact(); }}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-500 text-center"
            >
              Open Contact Modal
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
