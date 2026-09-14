import React from 'react';
import { MapPin, Clock, Star, ArrowUpRight, Heart, Hotel, ExternalLink } from 'lucide-react';

export default function TourCard({ 
  tour, 
  onSelectTour, 
  onOpenDetails, 
  onBookNow, 
  isSelected, 
  isSaved, 
  onToggleSave 
}) {
  return (
    <div 
      onClick={() => onOpenDetails(tour)}
      className={`group relative bg-white dark:bg-slate-900 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between border ${
        isSelected 
          ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-xl -translate-y-1' 
          : 'border-slate-100 dark:border-slate-800 hover:border-slate-300/80 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Top Image & Overlays */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={tour.image} 
          alt={tour.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        {/* Country & Category Tags */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
            {tour.country}
          </span>
          <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
            {tour.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(tour);
          }}
          className={`absolute top-3.5 right-3.5 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
            isSaved 
              ? 'bg-rose-500 text-white shadow' 
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
          title="Save trip"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Focus on Leaflet Map Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectTour(tour);
          }}
          className="absolute bottom-3 left-3.5 flex items-center gap-1 text-white bg-slate-950/70 hover:bg-emerald-600 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border border-white/10"
          title="Zoom on map"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="drop-shadow truncate max-w-[150px]">{tour.location}</span>
        </button>

        {/* Rating */}
        <div className="absolute bottom-3 right-3.5 bg-white/95 dark:bg-slate-800/90 text-slate-800 dark:text-white text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{tour.rating}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-500 transition-colors line-clamp-1">
            {tour.title}
          </h3>

          {/* Hotel Info Box */}
          <div className="mt-2.5 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              <Hotel className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{tour.hotelName}</span>
            </div>
            <a
              href={tour.mapUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-0.5 shrink-0 text-[11px]"
            >
              Maps <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium mb-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{tour.duration}</span>
            </div>
            <div className="text-slate-950 dark:text-white font-black text-lg">
              ৳{tour.pricePerPerson.toLocaleString()} 
              <span className="text-slate-400 font-normal text-xs"> / person</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(tour);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <span>Book</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}