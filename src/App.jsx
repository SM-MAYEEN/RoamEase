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
import CustomCursor from './components/CustomCursor';
import StarBackground from './components/StarBackground';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTour, setSelectedTour] = useState(toursData[0]);
  const [bookingTour, setBookingTour] = useState(null);
  const [detailTour, setDetailTour] = useState(null);
  
  // নতুন ভিউ মোড: 'split' (Cards + Sticky Map) অথবা 'grid' (Full 3-Column Grid)
  const [viewMode, setViewMode] = useState('split');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('roamease_theme') === 'dark';
  });

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

  const handleFocusLocationOnMap = (tour) => {
    setSelectedTour(tour);
    if (viewMode === 'grid') setViewMode('split');
    const mapElement = document.getElementById('tour-map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchTerm('');
    setSelectedCountry('All');
    setSelectedCategory('All');
  };

  const countries = ['All', 'Bangladesh', 'Switzerland', 'Japan', 'Indonesia', 'Turkey', 'Italy'];
  const categories = ['All', 'Adventure', 'Beach', 'Nature', 'Culture', 'Relaxation'];

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
   <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative pt-20">
      
      <CustomCursor />
      <StarBackground darkMode={darkMode} />

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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full relative z-10">
        
        {/* View Controls & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedCountry === 'All' ? 'All Stays & Tours' : `${selectedCountry} Destinations`} ({filteredTours.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore hotels, tours, and real-time pinpoints</p>
          </div>

          {/* Toggle View: Full Grid vs Split with Map */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300/60 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map & Cards</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards Only (Full Width)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        {viewMode === 'split' ? (
          /* Split View: Left Scrollable Cards, Right Screen-Height Sticky Map */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left 2-Column Cards */}
            <div className="w-full lg:w-7/12">
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

            {/* Right Sticky Map (Sticks to Viewport while scrolling down) */}
            <div className="w-full lg:w-5/12 sticky top-24">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Viewport Pinpoint
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{filteredTours.length} spots on map</span>
              </div>
              
              <div className="h-[calc(100vh-140px)] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800">
                <TourMap 
                  tours={filteredTours} 
                  selectedTour={selectedTour} 
                  onSelectTour={(t) => setSelectedTour(t)}
                />
              </div>
            </div>

          </div>
        ) : (
          /* Cards Only Mode: Full Width 3 Columns (Zero Empty Space) */
          <div>
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}

      </main>

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