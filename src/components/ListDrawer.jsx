import React from 'react';
import { X, Trash2, Calendar, Users, MapPin, Hotel, Tag } from 'lucide-react';

export default function ListDrawer({ isOpen, onClose, type, items, onRemoveItem }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {type === 'wishlist' ? 'Saved Expeditions' : 'Confirmed Reservations'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {items.length} {items.length === 1 ? 'trip recorded' : 'trips recorded'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                <p className="text-sm font-semibold">No {type === 'wishlist' ? 'saved trips' : 'confirmed bookings'} yet.</p>
                <p className="text-xs mt-1">Explore destinations and add packages!</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.uniqueId || item.id}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-3.5 flex gap-3.5 relative group"
                >
                  <img
                    src={item.tourImage || item.image}
                    alt={item.tourTitle || item.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {item.tourTitle || item.title}
                    </h4>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.tourLocation || item.location}</span>
                    </div>

                    {item.hotelName && (
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                        <Hotel className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{item.hotelName}</span>
                      </div>
                    )}

                    {/* Bookings Details */}
                    {type === 'bookings' ? (
                      <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Date: {item.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Users className="w-3 h-3 text-slate-400" />
                            {item.guests} Guest(s)
                          </span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">
                            ৳{item.grandTotal?.toLocaleString()}
                          </span>
                        </div>
                        {item.packageBadge && (
                          <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {item.packageBadge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-black text-slate-900 dark:text-white text-xs">
                          ৳{item.pricePerPerson?.toLocaleString()} / person
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.uniqueId || item.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-lg transition cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}