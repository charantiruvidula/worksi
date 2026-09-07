'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Tag,
  ChevronRight,
  Plus,
  Camera,
  ArrowLeft
} from 'lucide-react';
import {
  ServiceItem,
  ServiceAddon,
  Provider,
  Address,
  Coupon,
  Booking
} from '@/lib/marketplace-data';

interface BookingFlowModalProps {
  service?: ServiceItem | null;
  provider?: Provider | null;
  initialAddons?: ServiceAddon[];
  allServices: ServiceItem[];
  allProviders: Provider[];
  savedAddresses: Address[];
  coupons: Coupon[];
  walletBalance: number;
  onClose: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export default function BookingFlowModal({
  service: propService,
  provider: propProvider,
  initialAddons = [],
  allServices,
  allProviders,
  savedAddresses,
  coupons,
  walletBalance,
  onClose,
  onBookingConfirmed
}: BookingFlowModalProps) {
  // Step tracker: 1 to 5
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<ServiceItem>(
    propService || allServices[0]
  );
  const [selectedProvider, setSelectedProvider] = useState<Provider>(
    propProvider ||
      allProviders.find((p) => p.categoryId === (propService?.categoryId || allServices[0].categoryId)) ||
      allProviders[0]
  );
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>(initialAddons);

  // Step 2: Date & Slot
  const dates = [
    { label: 'Today', date: 'Sat 5', full: 'Today, Sept 5' },
    { label: 'Tomorrow', date: 'Sun 6', full: 'Tomorrow, Sept 6' },
    { label: 'Monday', date: 'Mon 7', full: 'Mon, Sept 7' }
  ];
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const slots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
  const [selectedSlot, setSelectedSlot] = useState(slots[3]); // 4:00 PM

  // Step 3: Address
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    savedAddresses[0] || {
      id: 'addr-custom',
      label: 'Home',
      street: '#42, 12th Main Road',
      area: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      isDefault: true
    }
  );
  const [isAddingNewAddr, setIsAddingNewAddr] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');

  // Step 4: Problem description
  const [problemDescription, setProblemDescription] = useState(
    'AC is not cooling properly and making a vibrating noise.'
  );
  const [photoAttached, setPhotoAttached] = useState(false);

  // Step 5: Review & Payment
  const [couponCode, setCouponCode] = useState('CLEAN20');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(coupons[0]);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet' | 'Cash on Service'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');

  // Confirmation state
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Tally totals
  const basePrice = selectedService.price;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const tax = Math.round((basePrice + addonsTotal) * 0.1); // 10% tax/GST

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.min(Math.round((basePrice + addonsTotal) * (appliedCoupon.discountValue / 100)), 200);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(basePrice + addonsTotal + tax - discount, 99);

  const handleApplyCoupon = () => {
    const match = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (match) {
      setAppliedCoupon(match);
      setCouponMsg(`Coupon applied! Saved ₹${match.discountValue}${match.discountType === 'percentage' ? '%' : ''}`);
    } else {
      setCouponMsg('Invalid coupon code. Try CLEAN20 or FIRST100.');
    }
  };

  const handleFinalConfirm = () => {
    const newBooking: Booking = {
      id: `WRK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      category: selectedService.category,
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      providerAvatar: selectedProvider.avatar,
      providerPhone: selectedProvider.phone,
      date: selectedDate.full,
      timeSlot: `${selectedSlot} - ${selectedSlot.replace('00', '45')}`,
      address: selectedAddress,
      problemDescription: problemDescription || 'Standard service request',
      addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      basePrice,
      addonsTotal,
      tax,
      discount,
      totalAmount: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Service' ? 'Pending' : 'Paid',
      status: 'Upcoming',
      trackingStep: 2, // Provider Assigned
      etaMinutes: 25,
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now'
    };

    setCreatedBooking(newBooking);
    setIsCompleted(true);
    onBookingConfirmed(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Top Nav & Stepper */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            {currentStep > 1 && !isCompleted && (
              <button
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="font-display text-lg sm:text-xl font-medium tracking-tight text-stone-900">
                {isCompleted ? 'Booking Confirmed!' : `Book Service — Step ${currentStep} of 5`}
              </h2>
              {!isCompleted && (
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  {currentStep === 1 && 'Select service & custom add-on options'}
                  {currentStep === 2 && 'Choose date & preferred arrival time slot'}
                  {currentStep === 3 && 'Select verified doorstep service address'}
                  {currentStep === 4 && 'Describe the issue or requirements'}
                  {currentStep === 5 && 'Review order details & select payment mode'}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-stone-100 h-1.5 flex">
            <div
              className="bg-black h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* SUCCESS SCREEN */}
          {isCompleted && createdBooking ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-md">
                ✓
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Booking Confirmed
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">
                  #{createdBooking.id}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Your appointment for <strong>{createdBooking.serviceTitle}</strong> is locked in with {createdBooking.providerName}.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2.5 max-w-md mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Date & Slot:</span>
                  <span className="font-bold text-stone-900">{createdBooking.date} • {createdBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Service Address:</span>
                  <span className="font-semibold text-stone-900 truncate max-w-[200px]">
                    {createdBooking.address.label} — {createdBooking.address.area}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span className="font-bold text-emerald-700">₹{createdBooking.totalAmount} ({createdBooking.paymentMethod})</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center bg-amber-50 p-2.5 rounded-xl border-amber-200">
                  <span className="text-amber-900 font-bold">Start Security OTP:</span>
                  <span className="font-mono text-base font-extrabold text-amber-950 tracking-widest">{createdBooking.otp}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 max-w-md mx-auto">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 shadow-md"
                >
                  Track in My Bookings
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SELECT SERVICE & ADDONS */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-stone-400">Step 1 — Service Selection</h3>
                    <div className="mt-2 p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-stone-900">{selectedService.title}</div>
                        <div className="text-xs text-stone-500 mt-0.5">Standard Comprehensive Service</div>
                      </div>
                      <div className="text-base font-bold text-stone-900">₹{selectedService.price}</div>
                    </div>
                  </div>

                  {/* Add-ons Checklist */}
                  {selectedService.addons.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-stone-800">Add Recommended Protection</div>
                      {selectedService.addons.map((addon) => {
                        const isChecked = selectedAddons.some((a) => a.id === addon.id);
                        return (
                          <label
                            key={addon.id}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              isChecked ? 'border-black bg-stone-50' : 'border-stone-200 hover:bg-stone-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
                                  } else {
                                    setSelectedAddons([...selectedAddons, addon]);
                                  }
                                }}
                                className="w-4 h-4 accent-black rounded"
                              />
                              <div>
                                <div className="text-xs font-bold text-stone-900">{addon.name}</div>
                                <div className="text-[10px] text-stone-500">{addon.description}</div>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-stone-900">+₹{addon.price}</div>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Assigned Pro preview */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-stone-800 mb-1.5">Assigned Specialist</div>
                    <div className="p-3 rounded-2xl border border-stone-200 flex items-center gap-3">
                      <img
                        src={selectedProvider.avatar}
                        alt={selectedProvider.name}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">{selectedProvider.name}</div>
                        <div className="text-[10px] text-stone-500">
                          ⭐ {selectedProvider.rating} • {selectedProvider.distanceKm} km away • {selectedProvider.completedJobs}+ jobs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT DATE & TIME */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-stone-400 mb-2">Choose Date</h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      {dates.map((d) => {
                        const isSelected = selectedDate.date === d.date;
                        return (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDate(d)}
                            className={`p-3.5 rounded-2xl border text-center transition-all ${
                              isSelected
                                ? 'border-black bg-black text-white shadow-md'
                                : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                            }`}
                          >
                            <div className={`text-[10px] uppercase font-bold ${isSelected ? 'text-amber-300' : 'text-stone-400'}`}>
                              {d.label}
                            </div>
                            <div className="text-sm font-extrabold mt-0.5">{d.date}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase text-stone-400 mb-2">Choose Time Slot</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'border-black bg-stone-900 text-white shadow'
                                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                            }`}
                          >
                            <Clock size={13} className={isSelected ? 'text-amber-300' : 'text-stone-400'} />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-600 shrink-0" />
                    <span>Free reschedule allowed anytime up to 2 hours before the slot.</span>
                  </div>
                </div>
              )}

              {/* STEP 3: ADDRESS */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase text-stone-400">Service Address</h3>
                    <button
                      onClick={() => setIsAddingNewAddr(!isAddingNewAddr)}
                      className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>{isAddingNewAddr ? 'View Saved' : '+ Add New Address'}</span>
                    </button>
                  </div>

                  {isAddingNewAddr ? (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="text-xs font-bold text-stone-900">Add Service Location</div>
                      <input
                        type="text"
                        placeholder="House / Flat No., Apartment Name"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        placeholder="Area / Locality (e.g. Indiranagar)"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newStreet && newArea) {
                            setSelectedAddress({
                              id: `addr-${Date.now()}`,
                              label: 'Other',
                              street: newStreet,
                              area: newArea,
                              city: 'Bangalore',
                              pincode: '560038',
                              isDefault: false
                            });
                            setIsAddingNewAddr(false);
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-stone-800"
                      >
                        Use This Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddress.id === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-black bg-stone-50 shadow-sm'
                                : 'border-stone-200 hover:bg-stone-50/50'
                            }`}
                          >
                            <div className="text-xl">
                              {addr.label === 'Home' ? '🏠' : addr.label === 'Office' ? '🏢' : '📍'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-stone-900">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-600 mt-0.5">
                                {addr.street}, {addr.area}, {addr.city} — {addr.pincode}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs">
                                <Check size={12} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: PROBLEM DESCRIPTION */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-stone-400 mb-1">
                      Describe your problem (Optional)
                    </h3>
                    <p className="text-xs text-stone-500 mb-3">
                      Give the technician context beforehand so they bring matching spare parts.
                    </p>
                    <textarea
                      rows={4}
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="e.g. My AC is making rattling noise and water leaking from indoor coil..."
                      className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-black focus:bg-white resize-none"
                    />
                  </div>

                  {/* Photo attachment simulator */}
                  <div>
                    <div className="text-xs font-bold text-stone-800 mb-1.5">Attach Photos</div>
                    <button
                      onClick={() => setPhotoAttached(!photoAttached)}
                      className={`w-full py-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors ${
                        photoAttached
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                          : 'border-stone-300 hover:border-black bg-stone-50 text-stone-600'
                      }`}
                    >
                      <Camera size={20} />
                      <span className="text-xs font-semibold">
                        {photoAttached ? '✓ 1 Photo Attached (ac_leak.jpg)' : 'Click to add photos of unit / leak'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW BOOKING & PAYMENT */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                      <span className="font-bold text-stone-900 text-sm">{selectedService.title}</span>
                      <span className="text-stone-600 font-semibold">{selectedProvider.name}</span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>Date & Time:</span>
                      <span className="font-bold text-stone-900">{selectedDate.date} at {selectedSlot}</span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>Address:</span>
                      <span className="font-medium text-stone-900">{selectedAddress.label} ({selectedAddress.area})</span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-2 border-t border-stone-200 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Standard Service:</span>
                        <span className="font-semibold text-stone-800">₹{basePrice}</span>
                      </div>
                      {addonsTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Add-ons ({selectedAddons.length}):</span>
                          <span className="font-semibold text-stone-800">+₹{addonsTotal}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-stone-500">Taxes & Safe Visit Fee:</span>
                        <span className="font-semibold text-stone-800">+₹{tax}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Promo Discount:</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                        <span>Total Payable:</span>
                        <span>₹{finalTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Promo Code (e.g. CLEAN20)"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold uppercase focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-stone-800"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <div className="text-[11px] font-semibold text-emerald-700 px-1">
                      {couponMsg}
                    </div>
                  )}

                  {/* Payment Mode Selector */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-stone-800">Choose Payment Method</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'UPI', label: 'UPI (GPay, PhonePe)', icon: '⚡' },
                        { id: 'Card', label: 'Credit / Debit Card', icon: '💳' },
                        { id: 'Wallet', label: `Wallet (₹${walletBalance})`, icon: '👛' },
                        { id: 'Cash on Service', label: 'Pay After Service', icon: '💵' }
                      ].map((mode) => {
                        const isSelected = paymentMethod === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setPaymentMethod(mode.id as any)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${
                              isSelected
                                ? 'border-black bg-black text-white font-bold'
                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <div className="text-base mb-0.5">{mode.icon}</div>
                            <div>{mode.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom CTA Bar */}
        {!isCompleted && (
          <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">Total Price</div>
              <div className="text-lg font-bold text-stone-900">₹{finalTotal}</div>
            </div>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="px-6 py-3 rounded-2xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinalConfirm}
                className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
              >
                <Check size={15} />
                <span>Confirm Booking (₹{finalTotal})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
