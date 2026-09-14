import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ExternalLink, Navigation } from 'lucide-react';

function MapUpdater({ selectedTour, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    if (selectedTour && selectedTour.coordinates) {
      // নির্দিষ্ট কোঅর্ডিনেটে স্মুথলি প্যান ও জুম করা
      map.flyTo(selectedTour.coordinates, 11, {
        duration: 1.5,
        easeLinearity: 0.25
      });

      // ওই মার্কারটির পপআপ স্বয়ংক্রিয়ভাবে ওপেন করা
      const marker = markerRefs.current[selectedTour.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 800);
      }
    }
  }, [selectedTour, map, markerRefs]);

  return null;
}

export default function TourMap({ tours, selectedTour, onSelectTour }) {
  const defaultCenter = [23.6850, 90.3563];
  const markerRefs = useRef({});

  return (
    <div id="tour-map-section" className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-200/50 relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater selectedTour={selectedTour} markerRefs={markerRefs} />

        {tours.map((tour) => (
          <Marker 
            key={tour.id} 
            position={tour.coordinates}
            ref={(ref) => {
              if (ref) markerRefs.current[tour.id] = ref;
            }}
            eventHandlers={{
              click: () => onSelectTour(tour)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 max-w-[220px]">
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-24 object-cover rounded-xl mb-2"
                />
                <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{tour.title}</h4>
                <p className="text-emerald-600 font-extrabold text-xs mb-2">৳{tour.pricePerPerson.toLocaleString()} / person</p>
                
                {/* রিয়েল লোকেশন ভিজিট করার বাটন */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${tour.coordinates[0]},${tour.coordinates[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg transition-colors shadow"
                >
                  <Navigation className="w-3 h-3 text-emerald-400" />
                  <span>Visit in Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}