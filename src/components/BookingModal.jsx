import React, { useState } from 'react';
import { X, CheckCircle, Users, Calendar } from 'lucide-react';

export default function BookingModal({ tour, onClose, onConfirmBooking }) {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [guide, setGuide] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // Price Calculation
  const basePrice = tour.pricePerPerson * guests;
  const insuranceFee = insurance ? 500 * guests : 0;
  const guideFee = guide ? 1500 : 0;
  const subtotal = basePrice + insuranceFee + guideFee;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      uniqueId: Date.now(),
      tourId: tour.id,
      tourTitle: tour.title,
      tourLocation: tour.location,
      tourImage: tour.image,
      date,
      guests,
      grandTotal,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone
    };

    onConfirmBooking(newBooking);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {step === 3 ? 'Booking Confirmed!' : `Book: ${tour.title}`}
            </h3>
            <p className="text-xs text-slate-500">{tour.location}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Select Travel Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" /> Number of Travelers: {guests}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Add-ons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">Optional Add-ons:</span>
                
                <label className="flex items-center justify-between p-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 text-xs">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={insurance} 
                      onChange={(e) => setInsurance(e.target.checked)}
                      className="accent-emerald-600 rounded" 
                    />
                    <span className="font-medium text-slate-800">Travel Insurance</span>
                  </div>
                  <span className="text-slate-500 font-semibold">+৳500 / person</span>
                </label>

                <label className="flex items-center justify-between p-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 text-xs">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={guide} 
                      onChange={(e) => setGuide(e.target.checked)}
                      className="accent-emerald-600 rounded" 
                    />
                    <span className="font-medium text-slate-800">Dedicated Tour Guide</span>
                  </div>
                  <span className="text-slate-500 font-semibold">+৳1,500 total</span>
                </label>
              </div>

              {/* Calculation Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare ({guests}x)</span>
                  <span>৳{basePrice.toLocaleString()}</span>
                </div>
                {insurance && (
                  <div className="flex justify-between text-slate-600">
                    <span>Insurance</span>
                    <span>৳{insuranceFee.toLocaleString()}</span>
                  </div>
                )}
                {guide && (
                  <div className="flex justify-between text-slate-600">
                    <span>Guide Fee</span>
                    <span>৳{guideFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Tax & VAT (5%)</span>
                  <span>৳{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                  <span>Grand Total</span>
                  <span className="text-emerald-600">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                disabled={!date}
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 disabled:bg-slate-300 hover:bg-emerald-700 text-white font-semibold text-sm py-3 rounded-xl transition"
              >
                Proceed to Traveler Details
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                  placeholder="e.g. Mayeen Uddin"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500"
                  placeholder="+8801..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2.5 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-xl transition"
                >
                  Confirm & Pay ৳{grandTotal.toLocaleString()}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-900">Tour Reserved Successfully!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Details have been saved in your <strong>Bookings</strong> tab.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                Close Window
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}