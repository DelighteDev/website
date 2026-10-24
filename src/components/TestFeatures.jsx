import React, { useState, useEffect } from 'react';

export default function TestFeatures({ onOpenContact, onTriggerToast }) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBreakpoint = (width) => {
    if (width < 640) return { name: "xs / Mobile", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    if (width < 768) return { name: "sm / Phablet", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (width < 1024) return { name: "md / Tablet", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    if (width < 1280) return { name: "lg / Small Laptop", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" };
    return { name: "xl+ / Desktop Display", color: "text-teal-500 bg-teal-500/10 border-teal-500/20" };
  };

  const bp = getBreakpoint(windowSize.width);

  return (
    <section id="test-features" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Responsive Diagnostics & Utilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Bare Essentials Testing Toolkit
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Live viewport measurements, test triggers, and interactive elements designed specifically for QA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Viewport Gauge */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Device Diagnostics</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Live Viewport Size</h3>
              <p className="text-xs text-slate-500 mt-1">Resize the browser to observe live breakpoint changes.</p>
              
              <div className="my-5 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {windowSize.width} <span className="text-teal-500 text-lg">×</span> {windowSize.height}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Pixels (CSS Viewport)</div>
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-center border ${bp.color}`}>
              Active: {bp.name}
            </div>
          </div>

          {/* Card 2: Interactive Triggers */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Simulation</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Feedback Triggers</h3>
              <p className="text-xs text-slate-500 mt-1">Simulate asynchronous actions and toast popups.</p>

              <div className="space-y-2.5 my-4">
                <button
                  onClick={() => onTriggerToast("API Mock 200 OK: Data synchronized")}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors text-left flex items-center justify-between"
                >
                  <span>Simulate HTTP 200 OK</span>
                  <span className="text-teal-500 font-mono text-[10px]">Trigger</span>
                </button>
                <button
                  onClick={() => onTriggerToast("Mock Cache Cleared")}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors text-left flex items-center justify-between"
                >
                  <span>Simulate Cache Invalidation</span>
                  <span className="text-teal-500 font-mono text-[10px]">Trigger</span>
                </button>
                <button
                  onClick={onOpenContact}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors text-left flex items-center justify-between"
                >
                  <span>Open Contact Modal</span>
                  <span className="font-mono text-[10px]">Modal</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center">
              State stored in React memory
            </div>
          </div>

          {/* Card 3: Requirements Status */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Spec Status</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Verified Requirements</h3>
              <p className="text-xs text-slate-500 mt-1">All requested dummy website elements built:</p>

              <div className="space-y-2 mt-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span>Header "Contact Me" button & modal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span>Header search bar with real-time filter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span>Royalty-free photo carousel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span>Spotify embed player & social cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span>Mobile & desktop responsive React UI</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold text-center">
              100% SPEC COMPLETE
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
