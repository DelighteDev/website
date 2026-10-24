import React from 'react';

export default function Hero({ onOpenContact, onTriggerToast }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pb-20 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-teal-500/10 via-emerald-500/10 to-blue-500/10 blur-3xl rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-100/80 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-6">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          React.js Responsive Prototype • Ready for Testing
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Interactive Testing Sandbox for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500">Modern Web Apps</span>
        </h1>

        {/* Subhead */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Equipped with essential features: header search filtering, contact drawer modal, swipe-enabled royalty-free carousel, and rich embeds for Spotify and social media.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#carousel"
            className="px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Explore Carousel
          </a>
          <a
            href="#media-section"
            className="px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 transition-all shadow-sm"
          >
            Spotify & Social Embeds
          </a>
          <button
            onClick={onOpenContact}
            className="px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-all"
          >
            Test Contact Form
          </button>
        </div>

      </div>
    </section>
  );
}
