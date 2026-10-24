import React, { useState } from 'react';

export default function Footer({ onOpenContact, onTriggerToast }) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onTriggerToast(`Subscribed ${email} to test newsletter!`);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center text-sm">
                P
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pulse<span className="text-teal-600 dark:text-teal-400">Craft</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Dummy website built with React.js for testing purposes, responsive layout verification, carousel interaction, and embedded media evaluation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#carousel" className="hover:text-teal-500">Royalty-Free Carousel</a></li>
              <li><a href="#media-section" className="hover:text-teal-500">Spotify Embed Player</a></li>
              <li><a href="#media-section" className="hover:text-teal-500">YouTube Video Frame</a></li>
              <li><a href="#test-features" className="hover:text-teal-500">Screen Diagnostics</a></li>
              <li><button onClick={onOpenContact} className="hover:text-teal-500">Contact Modal</button></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Test Newsletter
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Receive simulated updates and mock payloads.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter dummy email..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 dark:bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PulseCraft Testing Environment. Built for cross-device evaluation.</p>
          <button
            onClick={scrollToTop}
            className="hover:text-teal-500 transition-colors font-medium flex items-center gap-1"
          >
            <span>Back to top ↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
