'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  JobStatus,
  ProviderJob,
  ProviderOffer,
  ProviderNotification,
  initialProviderJobs,
  initialOffers,
  initialNotifications,
  DEFAULT_PROVIDER_SKILLS,
  matchesProviderSkills
} from '@/lib/provider-data';

import { ProviderMainTab, EarningsSubTab } from '@/components/provider/ProviderSidebar';
import ProviderHeader from '@/components/provider/ProviderHeader';
import DashboardTab from '@/components/provider/DashboardTab';
import JobsTab from '@/components/provider/JobsTab';
import CalendarTab from '@/components/provider/CalendarTab';
import MessagesTab from '@/components/provider/MessagesTab';
import CustomersTab from '@/components/provider/CustomersTab';
import EarningsTab from '@/components/provider/EarningsTab';
import ReviewsTab from '@/components/provider/ReviewsTab';
import AnalyticsTab from '@/components/provider/AnalyticsTab';
import OffersTab from '@/components/provider/OffersTab';
import ProfileTab from '@/components/provider/ProfileTab';
import SettingsTab from '@/components/provider/SettingsTab';
import HelpTab from '@/components/provider/HelpTab';

import JobDetailsModal from '@/components/provider/JobDetailsModal';
import OngoingJobModal from '@/components/provider/OngoingJobModal';
import CompleteJobModal, { AdditionalPart } from '@/components/provider/CompleteJobModal';
import WithdrawModal from '@/components/provider/WithdrawModal';
import CreateOfferModal from '@/components/provider/CreateOfferModal';
import NotificationsDrawer from '@/components/provider/NotificationsDrawer';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { switchRole, logout } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<ProviderMainTab>('dashboard');
  const [activeJobSubTab, setActiveJobSubTab] = useState<JobStatus>('New Requests');
  const [activeEarningsSubTab, setActiveEarningsSubTab] = useState<EarningsSubTab>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Operational State
  const [isOnline, setIsOnline] = useState(true);
  const [providerSkills, setProviderSkills] = useState<string[]>(DEFAULT_PROVIDER_SKILLS);
  const [allJobs, setAllJobs] = useState<ProviderJob[]>(initialProviderJobs);
  const [availableBalance, setAvailableBalance] = useState(28450);
  const [offers, setOffers] = useState<ProviderOffer[]>(initialOffers);
  const [notifications, setNotifications] = useState<ProviderNotification[]>(initialNotifications);

  // A provider only gets the jobs related to the skill(s) he had provided
  const jobs = allJobs.filter((job) => matchesProviderSkills(job.category, providerSkills));

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<ProviderJob | null>(null);
  const [selectedJobForOngoing, setSelectedJobForOngoing] = useState<ProviderJob | null>(null);
  const [selectedJobForComplete, setSelectedJobForComplete] = useState<ProviderJob | null>(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [createOfferModalOpen, setCreateOfferModalOpen] = useState(false);

  // Badge Counts
  const newRequestsCount = jobs.filter((j) => j.status === 'New Requests').length;
  const ongoingCount = jobs.filter((j) => j.status === 'Ongoing').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Actions
  const handleAcceptLead = (jobId: string) => {
    setAllJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: 'Upcoming' as JobStatus } : job))
    );

    const target = jobs.find((j) => j.id === jobId);
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'booking',
          title: 'Booking Accepted',
          message: `You accepted ${target.serviceTitle} for ${target.customerName}.`,
          timestamp: 'Just now',
          read: false,
          jobId
        },
        ...prev
      ]);
    }
  };

  const handleDeclineLead = (jobId: string) => {
    setAllJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleJobCompleted = (
    jobId: string,
    finalPrice: number,
    parts: AdditionalPart[],
    notes: string
  ) => {
    setAllJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'Completed' as JobStatus,
              finalAmount: finalPrice,
              partsUsed: parts.map((p) => ({ name: p.name, price: p.cost })),
              completedAt: 'Just now'
            }
          : j
      )
    );

    const commission = Math.round(finalPrice * 0.1);
    const netCredit = finalPrice - commission;

    setAvailableBalance((prev) => prev + netCredit);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'payment',
        title: `₹${netCredit.toLocaleString('en-IN')} Credited`,
        message: `Job ${jobId} finalized. Payment credited to your available balance.`,
        timestamp: 'Just now',
        read: false,
        jobId
      },
      ...prev
    ]);
  };

  const handleWithdrawSuccess = (amount: number) => {
    setAvailableBalance((prev) => Math.max(0, prev - amount));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'payment',
        title: `Withdrawal of ₹${amount.toLocaleString('en-IN')} Initiated`,
        message: `IMPS transfer submitted. Funds will reflect in your account within 15 minutes.`,
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const handleSwitchToCustomer = () => {
    switchRole('customer');
    router.push('/dashboard');
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            jobs={jobs}
            onAcceptLead={handleAcceptLead}
            onDeclineLead={handleDeclineLead}
            onSelectJob={(job) => setSelectedJobForDetails(job)}
            onStartNavigation={(job) => setSelectedJobForOngoing(job)}
            setActiveTab={setActiveTab}
          />
        );

      case 'jobs':
        return (
          <JobsTab
            jobs={jobs}
            activeSubTab={activeJobSubTab}
            setActiveSubTab={setActiveJobSubTab}
            onAcceptLead={handleAcceptLead}
            onDeclineLead={handleDeclineLead}
            onSelectJob={(job) => setSelectedJobForDetails(job)}
            onStartNavigation={(job) => setSelectedJobForOngoing(job)}
            onOpenCompleteModal={(job) => setSelectedJobForComplete(job)}
            providerSkills={providerSkills}
            onGoToProfile={() => setActiveTab('profile')}
          />
        );

      case 'calendar':
        return (
          <CalendarTab
            jobs={jobs}
            onSelectJob={(job) => setSelectedJobForDetails(job)}
          />
        );

      case 'messages':
        return <MessagesTab />;

      case 'customers':
        return (
          <CustomersTab
            onOpenCustomerChat={() => setActiveTab('messages')}
          />
        );

      case 'earnings':
        return (
          <EarningsTab
            activeSubTab={activeEarningsSubTab}
            setActiveSubTab={setActiveEarningsSubTab}
            onOpenWithdrawModal={() => setWithdrawModalOpen(true)}
            availableBalance={availableBalance}
          />
        );

      case 'reviews':
        return <ReviewsTab />;

      case 'analytics':
        return <AnalyticsTab />;

      case 'offers':
        return (
          <OffersTab
            offers={offers}
            onOpenCreateOfferModal={() => setCreateOfferModalOpen(true)}
          />
        );

      case 'profile':
        return (
          <ProfileTab
            providerSkills={providerSkills}
            onUpdateSkills={setProviderSkills}
          />
        );

      case 'settings':
        return <SettingsTab onSwitchToCustomer={handleSwitchToCustomer} />;

      case 'help':
        return <HelpTab onOpenLiveChat={() => setActiveTab('messages')} />;

      default:
        return (
          <DashboardTab
            jobs={jobs}
            onAcceptLead={handleAcceptLead}
            onDeclineLead={handleDeclineLead}
            onSelectJob={(job) => setSelectedJobForDetails(job)}
            onStartNavigation={(job) => setSelectedJobForOngoing(job)}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEAE1] text-stone-900 flex flex-col font-body antialiased selection:bg-amber-200 selection:text-stone-900">
      {/* Top Operations Header with Navbar Tabs & Profile Picture Dropdown */}
      <ProviderHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
        newRequestsCount={newRequestsCount}
        unreadMessagesCount={2}
        onSwitchToCustomer={handleSwitchToCustomer}
        onLogout={() => {
          logout();
          router.push('/');
        }}
      />

      {/* Main Container: Expansive Full-Width Experience matching Customer page */}
      <div className="flex-1 w-full max-w-[1840px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <main className="w-full py-6 min-w-0 overflow-x-hidden animate-in fade-in duration-150">
          {renderTabContent()}
        </main>
      </div>

      {/* Modals & Drawers */}
      <JobDetailsModal
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onAccept={handleAcceptLead}
        onDecline={handleDeclineLead}
        onStartJob={(job) => {
          setSelectedJobForDetails(null);
          setSelectedJobForOngoing(job);
        }}
        onCompleteJob={(job) => {
          setSelectedJobForDetails(null);
          setSelectedJobForComplete(job);
        }}
        onOpenChat={() => {
          setSelectedJobForDetails(null);
          setActiveTab('messages');
        }}
      />

      <OngoingJobModal
        job={selectedJobForOngoing}
        onClose={() => setSelectedJobForOngoing(null)}
        onVerifyOtp={(jobId) => {
          setAllJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, status: 'Ongoing' as JobStatus } : j))
          );
        }}
        onProceedToComplete={(job) => {
          setSelectedJobForOngoing(null);
          setSelectedJobForComplete(job);
        }}
        onOpenChat={() => {
          setSelectedJobForOngoing(null);
          setActiveTab('messages');
        }}
      />

      <CompleteJobModal
        job={selectedJobForComplete}
        onClose={() => setSelectedJobForComplete(null)}
        onJobCompleted={handleJobCompleted}
      />

      {withdrawModalOpen && (
        <WithdrawModal
          isOpen={withdrawModalOpen}
          availableBalance={availableBalance}
          onClose={() => setWithdrawModalOpen(false)}
          onWithdrawSuccess={handleWithdrawSuccess}
        />
      )}

      {createOfferModalOpen && (
        <CreateOfferModal
          isOpen={createOfferModalOpen}
          onClose={() => setCreateOfferModalOpen(false)}
          onOfferCreated={(offer) => setOffers((prev) => [offer, ...prev])}
        />
      )}

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(notif) => {
          setNotificationsOpen(false);
          if (notif.type === 'lead') {
            setActiveTab('jobs');
            setActiveJobSubTab('New Requests');
          } else if (notif.type === 'booking') {
            setActiveTab('jobs');
            setActiveJobSubTab('Upcoming');
          } else if (notif.type === 'payment') {
            setActiveTab('earnings');
            setActiveEarningsSubTab('overview');
          } else if (notif.type === 'review') {
            setActiveTab('reviews');
          }
        }}
      />
    </div>
  );
}
