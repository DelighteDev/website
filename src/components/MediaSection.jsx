import React, { useState } from 'react';
import { SPOTIFY_PRESETS } from '../data/mockData';

export default function MediaSection({ onTriggerToast }) {
  const [selectedSpotify, setSelectedSpotify] = useState(SPOTIFY_PRESETS[0]);
  const [customSpotifyUrl, setCustomSpotifyUrl] = useState("");
  const [activeSpotifyEmbed, setActiveSpotifyEmbed] = useState(SPOTIFY_PRESETS[0].embedUrl);

  const [tweetLikes, setTweetLikes] = useState(248);
  const [isTweetLiked, setIsTweetLiked] = useState(false);
  const [igLikes, setIgLikes] = useState(892);
  const [isIgLiked, setIsIgLiked] = useState(false);
  const [customVideoId, setCustomVideoId] = useState("jfKfPfyJRdk");
  const [activeTab, setActiveTab] = useState("all");

  const handleSelectSpotifyPreset = (preset) => {
    setSelectedSpotify(preset);
    setActiveSpotifyEmbed(preset.embedUrl);
    onTriggerToast(`Loaded Spotify: ${preset.name}`);
  };

  const handleApplyCustomSpotify = (e) => {
    e.preventDefault();
    if (!customSpotifyUrl.trim()) return;
    let url = customSpotifyUrl.trim();
    if (url.includes("open.spotify.com/") && !url.includes("/embed/")) {
      url = url.replace("open.spotify.com/", "open.spotify.com/embed/");
    }
    setActiveSpotifyEmbed(url);
    onTriggerToast("Custom Spotify embed loaded!");
  };

  const handleToggleTweetLike = () => {
    setIsTweetLiked(!isTweetLiked);
    setTweetLikes(prev => isTweetLiked ? prev - 1 : prev + 1);
  };

  const handleToggleIgLike = () => {
    setIsIgLiked(!isIgLiked);
    setIgLikes(prev => isIgLiked ? prev - 1 : prev + 1);
  };

  return (
    <section id="media-section" className="py-12 sm:py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400 mb-1">
            <span>Embed & Media Integration</span>
            <span>•</span>
            <span>Responsive Containers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Spotify & Social Media Embedding Hub
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Test audio player embeds, video frames, and responsive social feed cards. Formatted for mobile screens and widescreen displays.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { id: "all", label: "All Embeds" },
            { id: "spotify", label: "Spotify Audio" },
            { id: "youtube", label: "YouTube Video" },
            { id: "social", label: "Twitter & Instagram" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Spotify Column */}
          {(activeTab === "all" || activeTab === "spotify") && (
            <div className={`${activeTab === "spotify" ? "lg:col-span-12 max-w-3xl mx-auto" : "lg:col-span-5"} space-y-6`}>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-[#1DB954] shadow-sm font-bold">
                      ♫
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Spotify Embed Player
                      </h3>
                      <p className="text-xs text-slate-500">Live streaming audio container</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
                    Official Iframe
                  </span>
                </div>

                {/* Preset Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {SPOTIFY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectSpotifyPreset(preset)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        selectedSpotify?.id === preset.id
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold shadow-sm"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">{preset.name}</div>
                      <div className="text-[10px] opacity-75">{preset.type}</div>
                    </button>
                  ))}
                </div>

                {/* Live Spotify Iframe */}
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                  <iframe
                    src={activeSpotifyEmbed}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl w-full"
                    title="Spotify Web Player Embed"
                  ></iframe>
                </div>

                {/* Custom URL Tester */}
                <form onSubmit={handleApplyCustomSpotify} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Test Custom Spotify Link:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSpotifyUrl}
                      onChange={(e) => setCustomSpotifyUrl(e.target.value)}
                      placeholder="Paste open.spotify.com/... link"
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 dark:bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                    >
                      Load
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* YouTube & Social Column */}
          {(activeTab === "all" || activeTab === "youtube" || activeTab === "social") && (
            <div className={`${activeTab === "youtube" || activeTab === "social" ? "lg:col-span-12 max-w-3xl mx-auto" : "lg:col-span-7"} space-y-6`}>
              
              {/* YouTube Player */}
              {(activeTab === "all" || activeTab === "youtube") && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm font-bold text-xs">
                        ▶
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          YouTube Video Player Embed
                        </h3>
                        <p className="text-xs text-slate-500">Responsive 16:9 media container</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                      HD 1080p
                    </span>
                  </div>

                  <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${customVideoId}`}
                      title="YouTube video player test"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Preset Videos:</span>
                    <button
                      onClick={() => setCustomVideoId("jfKfPfyJRdk")}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        customVideoId === "jfKfPfyJRdk" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Lo-Fi Relax
                    </button>
                    <button
                      onClick={() => setCustomVideoId("LXb3EKWsInQ")}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        customVideoId === "LXb3EKWsInQ" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      4K Nature
                    </button>
                  </div>
                </div>
              )}

              {/* Twitter & Instagram */}
              {(activeTab === "all" || activeTab === "social") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Twitter / X */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">Elena Vance</span>
                              <span className="text-blue-500 text-xs">✓</span>
                            </div>
                            <span className="text-xs text-slate-500">@elenavance • 2h ago</span>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
                          𝕏
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                        Testing the responsive React layout! The Spotify embed and photo carousel look ultra crisp on both mobile and widescreen. 🚀🎨 #webdev #reactjs
                      </p>

                      <div className="rounded-xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800">
                        <img
                          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=70"
                          alt="Workspace preview"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <button
                        onClick={handleToggleTweetLike}
                        className={`hover:text-rose-500 transition-colors ${isTweetLiked ? "text-rose-500 font-bold" : ""}`}
                      >
                        ❤️ {tweetLikes}
                      </button>
                      <button onClick={() => onTriggerToast("Retweet triggered")} className="hover:text-teal-500">
                        🔁 64
                      </button>
                      <button onClick={() => onTriggerToast("Shared tweet")} className="hover:text-blue-500">
                        🔗 Share
                      </button>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">pulse.studios</span>
                            <span className="text-[10px] text-slate-500">Original Audio • Spotify Live</span>
                          </div>
                        </div>
                        <span className="text-xs text-pink-500 font-bold">IG</span>
                      </div>

                      <div 
                        className="relative rounded-2xl overflow-hidden mb-3 group cursor-pointer"
                        onDoubleClick={handleToggleIgLike}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=70"
                          alt="Post"
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                        <span className="font-bold mr-1">pulse.studios</span>
                        Vibrant neon aesthetics and creative flows. Live test mockup for social embedding.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <button
                        onClick={handleToggleIgLike}
                        className={`hover:text-rose-500 ${isIgLiked ? "text-rose-500 font-bold" : ""}`}
                      >
                        ❤️ {igLikes} likes
                      </button>
                      <span className="text-[11px] text-slate-400">View 38 comments</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
