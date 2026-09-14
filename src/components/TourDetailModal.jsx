import React, { useState } from 'react';
import { X, MapPin, Clock, Star, ArrowRight, ShieldCheck, Check, Hotel, ExternalLink } from 'lucide-react';

export default function TourDetailModal({ tour, onClose, onBookNow, onFocusMap }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {tour.category}
            </span>
            <span className="text-xs text-slate-500 font-bold">📍 {tour.country}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* Photo Gallery Slider */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                src={images[activeImgIndex]} 
                alt={tour.title} 
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{tour.rating}</span>
                <span className="text-slate-400 font-normal">({tour.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative h-16 w-24 sm:h-20 sm:w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImgIndex === idx 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {tour.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {tour.location}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-400 font-medium">All-inclusive from</div>
              <div className="text-2xl font-black text-slate-950">
                ৳{tour.pricePerPerson.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> / person</span>
              </div>
            </div>
          </div>

          {/* Verified Stay & Hotel Link Box */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Included Accommodation</span>
                <h4 className="text-sm font-bold text-slate-900">{tour.hotelName}</h4>
              </div>
            </div>

            <a
              href={tour.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition shadow cursor-pointer"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Experience Details</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Hotel</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Free Cancellation</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              onFocusMap(tour);
              onClose();
            }}
            className="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
            Pin on Map View
          </button>

          <button
            onClick={() => {
              onBookNow(tour);
              onClose();
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}