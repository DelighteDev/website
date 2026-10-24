import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PhotoCarousel from './components/PhotoCarousel';
import MediaSection from './components/MediaSection';
import TestFeatures from './components/TestFeatures';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleTriggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Header with Search and Contact Me button */}
      <Header
        onOpenContact={() => setIsContactOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1">
        <Hero
          onOpenContact={() => setIsContactOpen(true)}
          onTriggerToast={handleTriggerToast}
        />

        <PhotoCarousel
          onTriggerToast={handleTriggerToast}
        />

        <MediaSection
          onTriggerToast={handleTriggerToast}
        />

        <TestFeatures
          onOpenContact={() => setIsContactOpen(true)}
          onTriggerToast={handleTriggerToast}
        />
      </main>

      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onTriggerToast={handleTriggerToast}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onTriggerToast={handleTriggerToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/50">
          <span className="text-teal-400 font-bold">✓</span>
          <p className="text-sm font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
}
