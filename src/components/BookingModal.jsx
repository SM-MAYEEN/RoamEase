import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Percent, 
  MessageSquare, 
  PhoneCall, 
  Send,
  Sparkles
} from 'lucide-react';

export default function BookingModal({ tour, onClose, onConfirmBooking }) {
  const [step, setStep] = useState(1); // 1: Package/Booking, 2: Traveler Info, 3: Success, 4: Custom Inquiry Form
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [guide, setGuide] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // Custom Negotiation / Inquiry State
  const [inquiryData, setInquiryData] = useState({ name: '', phone: '', customBudget: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);

  // --- Dynamic Package Discount Tier System ---
  // 1-2 Persons: Regular Fare (0% Discount)
  // 3-5 Persons: Small Squad Deal (7% Discount)
  // 6-9 Persons: Big Family / Group Deal (12% Discount)
  // 10+ Persons: Mega Corporate / Group Deal (18% Discount)
  let discountPercentage = 0;
  let packageBadge = "Solo / Duo Rate";

  if (guests >= 10) {
    discountPercentage = 0.18;
    packageBadge = "Mega Group Deal (18% OFF)";
  } else if (guests >= 6) {
    discountPercentage = 0.12;
    packageBadge = "Big Group Deal (12% OFF)";
  } else if (guests >= 3) {
    discountPercentage = 0.07;
    packageBadge = "Squad Special (7% OFF)";
  }

  const rawBaseFare = tour.pricePerPerson * guests;
  const discountAmount = Math.round(rawBaseFare * discountPercentage);
  const discountedBasePrice = rawBaseFare - discountAmount;

  const insuranceFee = insurance ? 500 * guests : 0;
  const guideFee = guide ? 1500 : 0;
  const subtotal = discountedBasePrice + insuranceFee + guideFee;
  const tax = Math.round(subtotal * 0.05); // 5% Govt Tax
  const grandTotal = subtotal + tax;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      uniqueId: Date.now(),
      tourId: tour.id,
      tourTitle: tour.title,
      tourLocation: tour.location,
      tourImage: tour.image,
      hotelName: tour.hotelName,
      date,
      guests,
      packageBadge,
      discountAmount,
      grandTotal,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone
    };

    onConfirmBooking(newBooking);
    setStep(3);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      {/* Container with forced clear dark/light mode background & text color */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200 my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {tour.country}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{tour.hotelName}</span>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg mt-1 line-clamp-1">
              {step === 4 ? 'Custom Package & Price Inquiry' : step === 3 ? 'Booking Confirmed!' : `Book: ${tour.title}`}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Main Calculator & Dynamic Package Tier */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-500" /> Select Travel Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 transition cursor-pointer"
                />
              </div>

              {/* Members Slider & Package Tier Indicator */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-500" /> Travelers: <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black">{guests} Person(s)</strong>
                  </label>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {packageBadge}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="15"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />

                {/* Quick Package Badges Grid */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center pt-1 font-semibold">
                  <div className={`p-1.5 rounded-lg border ${guests >= 3 && guests <= 5 ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-600 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                    3–5 Squad (7% Off)
                  </div>
                  <div className={`p-1.5 rounded-lg border ${guests >= 6 && guests <= 9 ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-600 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                    6–9 Group (12% Off)
                  </div>
                  <div className={`p-1.5 rounded-lg border ${guests >= 10 ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-600 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                    10+ Mega (18% Off)
                  </div>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Package Add-ons:</span>
                
                <label className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs transition">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={insurance} 
                      onChange={(e) => setInsurance(e.target.checked)}
                      className="accent-emerald-600 rounded w-4 h-4 cursor-pointer" 
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Travel & Accidental Insurance</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">+৳500 / person</span>
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs transition">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={guide} 
                      onChange={(e) => setGuide(e.target.checked)}
                      className="accent-emerald-600 rounded w-4 h-4 cursor-pointer" 
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Dedicated Guide & Trip Photographer</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">+৳1,500 total</span>
                </label>
              </div>

              {/* Dynamic Price Breakdown Box */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl space-y-2 text-xs border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Fare ({guests}x)</span>
                  <span>৳{rawBaseFare.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> Group Package Savings</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                {insurance && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Insurance ({guests}x)</span>
                    <span>৳{insuranceFee.toLocaleString()}</span>
                  </div>
                )}

                {guide && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Dedicated Guide Fee</span>
                    <span>৳{guideFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Govt. Tax & VAT (5%)</span>
                  <span>৳{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2 text-sm sm:text-base">
                  <span>Estimated Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                disabled={!date}
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-sm py-3 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-600/25"
              >
                {!date ? 'Please Select Date to Continue' : 'Proceed to Traveler Details'}
              </button>

              {/* Want to negotiate / Contact for Custom Budget? */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Need customized group pricing?</span>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Discuss / Custom Rate
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Traveler Contact & Confirm */}
          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500"
                  placeholder="e.g. Mayeen Uddin"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500"
                  placeholder="+8801..."
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-600/25"
                >
                  Confirm & Reserve ৳{grandTotal.toLocaleString()}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reservation Complete Feedback */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">Trip Reserved Successfully!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Confirmation invoice generated for <strong>{formData.name}</strong> ({formData.email}).
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-left text-xs space-y-1.5 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <p><strong>Package:</strong> {tour.title}</p>
                <p><strong>Hotel:</strong> {tour.hotelName}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Travelers:</strong> {guests} Person(s) • <span className="text-emerald-500 font-bold">{packageBadge}</span></p>
                <p><strong>Total Payable:</strong> ৳{grandTotal.toLocaleString()}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Close & Check Bookings Tab
              </button>
            </div>
          )}

          {/* STEP 4: Custom Price Negotiation / Direct Contact Form */}
          {step === 4 && (
            <div>
              {!inquirySent ? (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> Direct Rate Negotiation:
                    </p>
                    Want a customized itinerary or discount for {guests} travelers at <strong>{tour.hotelName}</strong>? Send your offer directly to our tour coordinator.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                      placeholder="e.g. Mayeen Uddin"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={inquiryData.phone}
                        onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                        placeholder="+8801..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Offered Budget (৳)</label>
                      <input
                        type="number"
                        value={inquiryData.customBudget}
                        onChange={(e) => setInquiryData({...inquiryData, customBudget: e.target.value})}
                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Custom Notes / Demands</label>
                    <textarea
                      rows="3"
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                      placeholder="Special requirements, food preferences, or custom stay dates..."
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Price Offer
                    </button>
                  </div>

                  {/* Direct Contact via WhatsApp / Call */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <a 
                      href={`https://wa.me/8801800000000?text=Hi,%20I%20want%20to%20discuss%20pricing%20for%20${tour.title}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Instant WhatsApp
                    </a>
                    <span>•</span>
                    <a href="tel:+8801800000000" className="flex items-center gap-1 hover:underline">
                      <PhoneCall className="w-3.5 h-3.5" /> Call Agent
                    </a>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">Inquiry Received!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Thanks <strong>{inquiryData.name}</strong>! Our tour manager will contact you at <strong>{inquiryData.phone}</strong> regarding your offer of ৳{inquiryData.customBudget || grandTotal}.
                  </p>
                  <button
                    onClick={() => { setInquirySent(false); setStep(1); }}
                    className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Back to Booking
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}