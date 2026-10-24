import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CAROUSEL_SLIDES } from '../data/mockData';

export default function PhotoCarousel({ onTriggerToast }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalSlides = CAROUSEL_SLIDES.length;

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, isFullscreen]);

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const current = CAROUSEL_SLIDES[currentIndex];

  return (
    <section id="carousel" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400 mb-1">
              <span>Visual Showcase</span>
              <span>•</span>
              <span>Royalty-Free Photography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              High-Resolution Responsive Carousel
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Swipeable on mobile devices, keyboard-accessible with arrow keys, autoplay controls, and photographer attribution.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isPlaying 
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30" 
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>{isPlaying ? "⏸ Autoplay ON" : "▶ Paused"}</span>
            </button>
          </div>
        </div>

        {/* Carousel Frame */}
        <div 
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group select-none transition-all"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-[340px] sm:h-[460px] md:h-[540px] w-full overflow-hidden">
            {CAROUSEL_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              </div>
            ))}

            {/* Slide Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500 text-slate-950 uppercase tracking-wide">
                    {current.badge}
                  </span>
                  <span className="text-xs font-medium text-teal-300">
                    {current.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {current.title}
                </h3>
                
                <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 drop-shadow">
                  {current.description}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span>Photo by</span>
                  <a
                    href={current.photographerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-teal-400 underline font-medium"
                  >
                    {current.photographer}
                  </a>
                  <span>on Unsplash (Royalty-free)</span>
                </div>
              </div>

              {/* Fullscreen button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all shadow-md self-end"
                title="Fullscreen Lightbox"
              >
                ⤢ Fullscreen
              </button>
            </div>

            {/* Left / Right Nav Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition-all shadow-xl"
              aria-label="Previous Slide"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition-all shadow-xl"
              aria-label="Next Slide"
            >
              ❯
            </button>

            {/* Mobile swipe hint */}
            <div className="sm:hidden absolute top-3 right-3 z-30 px-2 py-1 rounded bg-black/50 text-[10px] text-white/80 font-mono backdrop-blur-sm pointer-events-none">
              Swipe ↔
            </div>
          </div>

          {/* Dots Indicator & Thumbnail Strip */}
          <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "w-8 bg-teal-400" 
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex ? "border-teal-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={slide.thumb} alt={slide.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8">
            <div className="flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-lg">{current.title}</h4>
                <p className="text-xs text-slate-400">Photo by {current.photographer}</p>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-2">
              <img
                src={current.url}
                alt={current.title}
                className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
            <div className="flex items-center justify-center gap-4 text-white">
              <button onClick={prevSlide} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                Previous
              </button>
              <span className="text-xs font-mono text-slate-400">
                {currentIndex + 1} of {totalSlides}
              </span>
              <button onClick={nextSlide} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
