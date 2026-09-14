import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TourCard from './components/TourCard';
import TourMap from './components/TourMap';
import BookingModal from './components/BookingModal';
import TourDetailModal from './components/TourDetailModal';
import ListDrawer from './components/ListDrawer';
import { toursData } from './data/toursData';
import Footer from './components/Footer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTour, setSelectedTour] = useState(toursData[0]);
  const [bookingTour, setBookingTour] = useState(null);
  const [detailTour, setDetailTour] = useState(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('roamease_theme') === 'dark';
  });

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('roamease_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('roamease_theme', 'light');
    }
  }, [darkMode]);

  // Persistent States
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('roamease_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('roamease_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('wishlist');

  useEffect(() => {
    localStorage.setItem('roamease_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('roamease_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handlers
  const handleToggleWishlist = (tour) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === tour.id);
      return exists ? prev.filter((item) => item.id !== tour.id) : [...prev, tour];
    });
  };

  const handleConfirmBooking = (bookingRecord) => {
    setBookings((prev) => [bookingRecord, ...prev]);
  };

  const handleRemoveFromDrawer = (id) => {
    if (drawerType === 'wishlist') {
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } else {
      setBookings((prev) => prev.filter((item) => item.uniqueId !== id));
    }
  };
// লোগোতে ক্লিক করলে হোম / টপে স্ক্রোল এবং ফিল্টার রিসেট
  const handleGoHome = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setSearchTerm('');
    setSelectedCountry('All');
    setSelectedCategory('All');
  };
  const handleFocusLocationOnMap = (tour) => {
    setSelectedTour(tour);
    const mapElement = document.getElementById('tour-map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const countries = ['All', 'Bangladesh', 'Switzerland', 'Japan', 'Indonesia', 'Turkey', 'Italy'];
  const categories = ['All', 'Adventure', 'Beach', 'Nature', 'Culture', 'Relaxation'];

  // Multi-Attribute Filter Query
  const filteredTours = useMemo(() => {
    return toursData.filter((tour) => {
      const matchesCountry = selectedCountry === 'All' || tour.country === selectedCountry;
      const matchesCategory = selectedCategory === 'All' || tour.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        tour.title.toLowerCase().includes(term) ||
        tour.location.toLowerCase().includes(term) ||
        tour.hotelName.toLowerCase().includes(term) ||
        tour.country.toLowerCase().includes(term);

      return matchesCountry && matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCountry, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
    <Navbar 
        onOpenWishlist={() => { setDrawerType('wishlist'); setDrawerOpen(true); }}
        onOpenBookings={() => { setDrawerType('bookings'); setDrawerOpen(true); }}
        wishlistCount={wishlist.length}
        bookingsCount={bookings.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onGoHome={handleGoHome}
      />

      <Hero 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
      />

      {/* Main Grid & Map View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Tours Cards Grid */}
          <div className="w-full lg:w-3/5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {selectedCountry === 'All' ? 'All Stays' : `${selectedCountry} Destinations`} ({filteredTours.length})
                </h2>
                <p className="text-xs text-slate-400">Click card for multiple photos & hotel links</p>
              </div>
            </div>

            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    isSelected={selectedTour?.id === tour.id}
                    isSaved={wishlist.some((item) => item.id === tour.id)}
                    onToggleSave={handleToggleWishlist}
                    onOpenDetails={(t) => setDetailTour(t)}
                    onSelectTour={handleFocusLocationOnMap}
                    onBookNow={(t) => setBookingTour(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 text-sm font-medium">No destinations found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Right: Sticky Map View */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-24">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Interactive Destination Map</h3>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  30 Global Pinpoints
                </span>
              </div>
              <TourMap 
                tours={filteredTours} 
                selectedTour={selectedTour} 
                onSelectTour={(t) => setSelectedTour(t)}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Footer Signature */}
      <Footer />

      {/* Modals & Drawers */}
      {detailTour && (
        <TourDetailModal
          tour={detailTour}
          onClose={() => setDetailTour(null)}
          onBookNow={(t) => setBookingTour(t)}
          onFocusMap={handleFocusLocationOnMap}
        />
      )}

      {bookingTour && (
        <BookingModal 
          tour={bookingTour} 
          onClose={() => setBookingTour(null)} 
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      <ListDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type={drawerType}
        items={drawerType === 'wishlist' ? wishlist : bookings}
        onRemoveItem={handleRemoveFromDrawer}
      />
    </div>
  );
}

export default App;