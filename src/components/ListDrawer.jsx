import { Calendar, MapPin, Trash2, Users, X } from 'lucide-react';

export default function ListDrawer({ isOpen, onClose, type, items, onRemoveItem }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {type === 'wishlist' ? 'Saved Trips' : 'My Confirmed Bookings'}
              </h2>
              <p className="text-xs text-slate-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} found
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-sm font-medium">No {type === 'wishlist' ? 'saved trips' : 'bookings'} yet.</p>
                <p className="text-xs mt-1">Start exploring and add some trips!</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.uniqueId || item.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex gap-3 relative group"
                >
                  <img
                    src={item.tourImage || item.image}
                    alt={item.tourTitle || item.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">
                      {item.tourTitle || item.title}
                    </h4>

                    <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span className="truncate">{item.tourLocation || item.location}</span>
                    </div>

                    {/* Conditional details for bookings */}
                    {type === 'bookings' ? (
                      <div className="mt-2 text-xs space-y-0.5 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Date: {item.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            {item.guests} Guest(s)
                          </span>
                          <span className="font-bold text-emerald-600">৳{item.grandTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          ৳{item.pricePerPerson.toLocaleString()} / person
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.uniqueId || item.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
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