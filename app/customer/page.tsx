'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  serviceCategories,
  initialServices,
  initialProviders,
  initialBookings,
  initialChatThreads,
  initialAddresses,
  activeCoupons,
  initialNotifications,
  ServiceItem,
  ServiceAddon,
  Provider,
  Booking,
  ChatThread,
  Address,
  Coupon,
  NotificationItem
} from '@/lib/marketplace-data';

// Navigation & Layout Components
import CustomerHeader from '@/components/customer/CustomerHeader';
import { CustomerTab } from '@/components/customer/CustomerSidebar';
import CustomerBottomNav from '@/components/customer/CustomerBottomNav';

// Tab Views
import HomeTab from '@/components/customer/HomeTab';
import ExploreTab from '@/components/customer/ExploreTab';
import BookingsTab from '@/components/customer/BookingsTab';
import MessagesTab from '@/components/customer/MessagesTab';
import FavoritesTab from '@/components/customer/FavoritesTab';
import OffersTab from '@/components/customer/OffersTab';
import ProfileTab from '@/components/customer/ProfileTab';
import SettingsTab from '@/components/customer/SettingsTab';
import HelpSupportTab from '@/components/customer/HelpSupportTab';

// Modals & Drawers
import ServiceDetailModal from '@/components/customer/ServiceDetailModal';
import ProviderProfileModal from '@/components/customer/ProviderProfileModal';
import BookingFlowModal from '@/components/customer/BookingFlowModal';
import LiveTrackingModal from '@/components/customer/LiveTrackingModal';
import ReviewModal from '@/components/customer/ReviewModal';
import BookingDetailModal from '@/components/customer/BookingDetailModal';
import NotificationsDrawer from '@/components/customer/NotificationsDrawer';
import PaymentsModal from '@/components/customer/PaymentsModal';
import LocationModal from '@/components/customer/LocationModal';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Active Tab state
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bangalore');

  // Core Data State
  const [services] = useState<ServiceItem[]>(initialServices);
  const [providers] = useState<Provider[]>(initialProviders);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(initialChatThreads);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [offers] = useState<Coupon[]>(activeCoupons);
  const [favorites, setFavorites] = useState<string[]>(['pro-ravi', 'pro-cleanpro']);
  const [walletBalance, setWalletBalance] = useState<number>(850);

  // Explore search & filter transfer
  const [exploreCategory, setExploreCategory] = useState<string>('all');
  const [exploreQuery, setExploreQuery] = useState<string>('');

  // Modals state
  const [serviceModalItem, setServiceModalItem] = useState<ServiceItem | null>(null);
  const [providerModalItem, setProviderModalItem] = useState<Provider | null>(null);
  const [bookingFlowActive, setBookingFlowActive] = useState(false);
  const [bookingFlowService, setBookingFlowService] = useState<ServiceItem | null>(null);
  const [bookingFlowProvider, setBookingFlowProvider] = useState<Provider | null>(null);
  const [bookingFlowAddons, setBookingFlowAddons] = useState<ServiceAddon[]>([]);

  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(null);
  const [activeReviewBooking, setActiveReviewBooking] = useState<Booking | null>(null);
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Active bookings count
  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'Upcoming'
  ).length;

  const unreadMessagesCount = chatThreads.reduce(
    (sum, t) => sum + (t.unreadCount || 0),
    0
  );

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Find upcoming booking for Home display
  const upcomingBooking = bookings.find((b) => b.status === 'Upcoming');
  const recentBooking = bookings.find((b) => b.status === 'Completed');

  // HANDLERS
  const handleToggleFavorite = (providerId: string) => {
    setFavorites((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSelectCategory = (categoryId: string) => {
    setExploreCategory(categoryId);
    setActiveTab('explore');
  };

  const handleSearchSubmit = (query: string) => {
    setExploreQuery(query);
    setActiveTab('explore');
  };

  const handleStartBookingFlow = (service?: ServiceItem, provider?: Provider) => {
    setBookingFlowService(service || services[0]);
    setBookingFlowProvider(provider || null);
    setBookingFlowAddons([]);
    setBookingFlowActive(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Booking Confirmed #${newBooking.id} ✓`,
      message: `${newBooking.serviceTitle} with ${newBooking.providerName} scheduled for ${newBooking.date}.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false
    };
    setNotifications([newNotif, ...notifications]);

    // Add message thread if doesn't exist
    const threadExists = chatThreads.some((t) => t.providerId === newBooking.providerId);
    if (!threadExists) {
      const newThread: ChatThread = {
        id: `chat-${newBooking.providerId}-${Date.now()}`,
        providerId: newBooking.providerId,
        providerName: newBooking.providerName,
        providerAvatar: newBooking.providerAvatar,
        serviceTitle: newBooking.serviceTitle,
        bookingId: newBooking.id,
        lastMessage: `Booking #${newBooking.id} confirmed for ${newBooking.date}.`,
        lastTimestamp: 'Just now',
        unreadCount: 0,
        online: true,
        messages: [
          {
            id: `m-init-${Date.now()}`,
            sender: 'system',
            senderName: 'Worksy System',
            text: `Booking #${newBooking.id} confirmed for ${newBooking.date} at ${newBooking.timeSlot}.`,
            timestamp: 'Just now'
          }
        ]
      };
      setChatThreads([newThread, ...chatThreads]);
    }
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer' as const,
      senderName: user?.name || 'Charan',
      text,
      timestamp: 'Just now',
      status: 'sent' as const
    };

    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...t.messages, newMessage]
          };
        }
        return t;
      })
    );
  };

  const handleCallProvider = (phone: string, name: string) => {
    alert(`Connecting secure masked call to ${name} (${phone}). Please pick up your phone.`);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStep: 1 | 2 | 3 | 4 | 5) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            trackingStep: newStep,
            status: newStep === 5 ? 'Completed' : 'Upcoming'
          };
        }
        return b;
      })
    );
  };

  const handleSubmitReview = (bookingId: string, rating: number, review: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            reviewed: true,
            ratingGiven: rating,
            reviewGiven: review
          };
        }
        return b;
      })
    );
  };

  const handleAddWalletCredit = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    const creditNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `₹${amount} Added to Worksy Wallet 👛`,
      message: `Your updated wallet balance is ₹${walletBalance + amount}.`,
      type: 'payment',
      timestamp: 'Just now',
      read: false
    };
    setNotifications([creditNotif, ...notifications]);
  };

  const handleAddAddress = (newAddr: Omit<Address, 'id'>) => {
    const addr: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setAddresses([...addresses, addr]);
  };

  const handleDeleteAddress = (addrId: string) => {
    setAddresses(addresses.filter((a) => a.id !== addrId));
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking? Any upfront payment will be refunded immediately.')) {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === bookingId) {
            return {
              ...b,
              status: 'Cancelled',
              paymentStatus: 'Refunded'
            };
          }
          return b;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEAE1] text-stone-900 flex flex-col selection:bg-stone-300 selection:text-stone-900 font-body">
      {/* Top Customer Header with Navigation & Search */}
      <CustomerHeader
        selectedLocation={selectedLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
        walletBalance={walletBalance}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchSubmit={handleSearchSubmit}
        activeBookingsCount={activeBookingsCount}
        unreadMessagesCount={unreadMessagesCount}
        favoritesCount={favorites.length}
        onLogout={handleLogout}
      />

      {/* Main Container: Expansive Full-Width Experience without Sidebar */}
      <div className="flex-1 w-full max-w-[1840px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Main Workspace Content */}
        <main className="w-full py-6 min-w-0 overflow-x-hidden">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <HomeTab
              userName={user?.name || 'Charan'}
              selectedLocation={selectedLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              categories={serviceCategories}
              services={services}
              providers={providers}
              upcomingBooking={upcomingBooking}
              recentBooking={recentBooking}
              offers={offers}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectCategory={handleSelectCategory}
              onSelectService={(srv) => setServiceModalItem(srv)}
              onSelectProvider={(pro) => setProviderModalItem(pro)}
              onTrackBooking={(b) => setActiveTrackingBooking(b)}
              onViewBookingDetails={(b) => setActiveInvoiceBooking(b)}
              onBookNow={handleStartBookingFlow}
              onRateService={(b) => setActiveReviewBooking(b)}
              onOpenOffers={() => setActiveTab('offers')}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 2: EXPLORE SERVICES */}
          {activeTab === 'explore' && (
            <ExploreTab
              categories={serviceCategories}
              services={services}
              providers={providers}
              selectedLocation={selectedLocation}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectService={(srv) => setServiceModalItem(srv)}
              onSelectProvider={(pro) => setProviderModalItem(pro)}
              onBookNow={handleStartBookingFlow}
              initialCategory={exploreCategory}
              initialQuery={exploreQuery}
            />
          )}

          {/* TAB 3: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              onTrackBooking={(b) => setActiveTrackingBooking(b)}
              onViewBookingDetails={(b) => setActiveInvoiceBooking(b)}
              onMessageProvider={(b) => {
                const thread = chatThreads.find((t) => t.providerId === b.providerId);
                setActiveTab('messages');
              }}
              onRateService={(b) => setActiveReviewBooking(b)}
              onBookAgain={(b) => {
                const srv = services.find((s) => s.id === b.serviceId);
                const pro = providers.find((p) => p.id === b.providerId);
                handleStartBookingFlow(srv, pro);
              }}
              onCancelBooking={handleCancelBooking}
              onViewInvoice={(b) => setActiveInvoiceBooking(b)}
            />
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === 'messages' && (
            <MessagesTab
              threads={chatThreads}
              onSendMessage={handleSendMessage}
              onCallProvider={handleCallProvider}
              onViewBookingById={(bookingId) => {
                const match = bookings.find((b) => b.id === bookingId);
                if (match) setActiveInvoiceBooking(match);
              }}
            />
          )}

          {/* TAB 5: FAVORITES */}
          {activeTab === 'favorites' && (
            <FavoritesTab
              favoriteProviderIds={favorites}
              providers={providers}
              services={services}
              onToggleFavorite={handleToggleFavorite}
              onSelectProvider={(pro) => setProviderModalItem(pro)}
              onBookNow={handleStartBookingFlow}
            />
          )}

          {/* TAB 6: OFFERS */}
          {activeTab === 'offers' && (
            <OffersTab
              offers={offers}
              onAddWalletCredit={handleAddWalletCredit}
            />
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && (
            <ProfileTab
              addresses={addresses}
              walletBalance={walletBalance}
              onAddAddress={handleAddAddress}
              onDeleteAddress={handleDeleteAddress}
              onOpenWalletModal={() => setIsWalletModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && <SettingsTab />}

          {/* TAB 9: HELP & SUPPORT */}
          {activeTab === 'help' && (
            <HelpSupportTab
              onStartSupportChat={() => setActiveTab('messages')}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <CustomerBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBookingsCount={activeBookingsCount}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* MODALS & DRAWERS */}
      {/* 1. Service Detail Modal */}
      <ServiceDetailModal
        service={serviceModalItem}
        onClose={() => setServiceModalItem(null)}
        onBookNow={(srv, addons) => {
          setServiceModalItem(null);
          setBookingFlowService(srv);
          setBookingFlowAddons(addons);
          setBookingFlowActive(true);
        }}
        providers={providers}
        onSelectProvider={(pro) => {
          setServiceModalItem(null);
          setProviderModalItem(pro);
        }}
      />

      {/* 2. Provider Profile Modal */}
      <ProviderProfileModal
        provider={providerModalItem}
        onClose={() => setProviderModalItem(null)}
        onBookNow={(pro) => {
          setProviderModalItem(null);
          handleStartBookingFlow(undefined, pro);
        }}
        onMessage={(pro) => {
          setProviderModalItem(null);
          setActiveTab('messages');
        }}
        isFavorite={providerModalItem ? favorites.includes(providerModalItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 3. Interactive 5-Step Booking Flow */}
      {bookingFlowActive && (
        <BookingFlowModal
          service={bookingFlowService}
          provider={bookingFlowProvider}
          initialAddons={bookingFlowAddons}
          allServices={services}
          allProviders={providers}
          savedAddresses={addresses}
          coupons={offers}
          walletBalance={walletBalance}
          onClose={() => setBookingFlowActive(false)}
          onBookingConfirmed={(newB) => {
            handleBookingConfirmed(newB);
          }}
        />
      )}

      {/* 4. Live GPS Tracking Modal */}
      <LiveTrackingModal
        booking={activeTrackingBooking}
        onClose={() => setActiveTrackingBooking(null)}
        onMessageProvider={(b) => {
          setActiveTrackingBooking(null);
          setActiveTab('messages');
        }}
        onCallProvider={handleCallProvider}
        onUpdateBookingStatus={handleUpdateBookingStatus}
      />

      {/* 5. Rating & Review Modal */}
      <ReviewModal
        booking={activeReviewBooking}
        onClose={() => setActiveReviewBooking(null)}
        onSubmitReview={handleSubmitReview}
      />

      {/* 6. Invoice & Booking Detail Modal */}
      <BookingDetailModal
        booking={activeInvoiceBooking}
        onClose={() => setActiveInvoiceBooking(null)}
        onTrack={(b) => {
          setActiveInvoiceBooking(null);
          setActiveTrackingBooking(b);
        }}
      />

      {/* 7. Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onNotificationClick={(notif) => {
          if (notif.type === 'booking') setActiveTab('bookings');
          if (notif.type === 'offer') setActiveTab('offers');
          if (notif.type === 'payment') setIsWalletModalOpen(true);
          setIsNotificationsOpen(false);
        }}
      />

      {/* 8. Wallet & Payment Methods Modal */}
      <PaymentsModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletBalance={walletBalance}
        onAddMoney={handleAddWalletCredit}
        bookings={bookings}
        onViewInvoice={(b) => setActiveInvoiceBooking(b)}
      />

      {/* 9. Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      {/* WORKSY Bottom Footer matching screenshot */}
      <footer className="w-full border-t border-[#D6D0C2] bg-[#E2DCCF] py-8 px-6 sm:px-12 text-stone-600 text-xs mt-auto">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Tagline */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-stone-800/40 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-t border-stone-900 rotate-45" />
              </div>
              <span className="font-display text-2xl italic tracking-tightest text-stone-900">
                Worksy
              </span>
            </div>
            <span className="text-stone-500 text-xs hidden sm:inline">
              Local Services. Real People.
            </span>
          </div>

          {/* Center: Policy & Company Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-stone-600">
            <button onClick={() => setActiveTab('help')} className="hover:text-stone-900 transition-colors">
              About Us
            </button>
            <button onClick={() => setActiveTab('help')} className="hover:text-stone-900 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setActiveTab('help')} className="hover:text-stone-900 transition-colors">
              Terms & Conditions
            </button>
            <button onClick={() => setActiveTab('help')} className="hover:text-stone-900 transition-colors">
              Help Center
            </button>
          </div>

          {/* Right: Social Media Icons */}
          <div className="flex items-center gap-4 text-stone-600">
            {/* Instagram */}
            <a href="#instagram" className="hover:text-stone-900 transition-colors" title="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#x" className="hover:text-stone-900 transition-colors" title="X">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#facebook" className="hover:text-stone-900 transition-colors" title="Facebook">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#linkedin" className="hover:text-stone-900 transition-colors" title="LinkedIn">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#youtube" className="hover:text-stone-900 transition-colors" title="YouTube">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
