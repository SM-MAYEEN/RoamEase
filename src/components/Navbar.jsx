import React from 'react';
import { Compass, Heart, Luggage, Sparkles, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  onOpenWishlist, 
  onOpenBookings, 
  wishlistCount, 
  bookingsCount,
  darkMode,
  setDarkMode,
  onGoHome // <-- নতুন প্রপ
}) {
  return (
    <nav className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-b border-white/40 dark:border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* HD Premium Brand Logo with Scroll-to-Top trigger */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3.5 cursor-pointer group select-none active:scale-95 transition-transform"
          title="Go to Home"
        >
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 group-hover:scale-105"></div>
            
            <div className="relative bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white p-2.5 rounded-2xl shadow-lg border border-white/30 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-ping"></div>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              RoamEase
            </span>
            <span className="flex items-center gap-1 text-[9px] font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase leading-none mt-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Explorer Hub
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 shadow-inner transition-all duration-300 cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0 duration-300" />
            )}
          </button>

          <button 
            onClick={onOpenWishlist}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer shadow-sm"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Saved Trips</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={onOpenBookings}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer border border-white/20"
          >
            <Luggage className="w-4 h-4" />
            <span>Bookings</span>
            {bookingsCount > 0 && (
              <span className="bg-white text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}