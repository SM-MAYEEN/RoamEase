import React from 'react';
import { Search, Sparkles, Globe } from 'lucide-react';

export default function Hero({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories,
  selectedCountry,
  setSelectedCountry,
  countries 
}) {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      {/* Background radial highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          Curated 30 Destinations & Verified Hotels
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
          Find The Best Stays in <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Bangladesh & Beyond
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
          Filter by country, inspect verified luxury hotels, and click to view the actual location in Google Maps.
        </p>

        {/* Filter Controls Stack */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          
          {/* 1. Country Selection Bar */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Country:
            </span>
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  selectedCountry === country
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-105'
                    : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white border border-white/5'
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          {/* 2. Category Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3. Search Bar */}
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-emerald-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by hotel name, spot, or location (e.g. Sayeman, Interlaken, Kyoto)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm outline-none bg-transparent placeholder-slate-400 text-white font-medium py-1"
            />
          </div>

        </div>
      </div>
    </div>
  );
}