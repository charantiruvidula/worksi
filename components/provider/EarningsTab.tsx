'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  CreditCard,
  Download,
  Filter,
  Sparkles
} from 'lucide-react';
import { EarningsSubTab } from './ProviderSidebar';
import { ProviderTransaction, initialTransactions } from '@/lib/provider-data';

interface EarningsTabProps {
  activeSubTab: EarningsSubTab;
  setActiveSubTab: (subTab: EarningsSubTab) => void;
  onOpenWithdrawModal: () => void;
  availableBalance: number;
}

export default function EarningsTab({
  activeSubTab,
  setActiveSubTab,
  onOpenWithdrawModal,
  availableBalance
}: EarningsTabProps) {
  const [transactions, setTransactions] = useState<ProviderTransaction[]>(initialTransactions);

  const weeklyData = [
    { day: 'Mon 1', amount: 3200, height: '45%' },
    { day: 'Tue 2', amount: 4800, height: '65%' },
    { day: 'Wed 3', amount: 5600, height: '75%' },
    { day: 'Thu 4', amount: 7200, height: '95%' },
    { day: 'Fri 5', amount: 6400, height: '85%' },
    { day: 'Sat 6', amount: 8900, height: '100%' },
    { day: 'Sun 7', amount: 6480, height: '80%' }
  ];

  return (
    <div className="space-y-8 pb-24 w-full max-w-[1840px] 2xl:max-w-[1920px] mx-auto">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-stone-500">
            Financial Health
          </p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tightest text-stone-900 leading-tight">
            Earnings <span className="italic font-normal">&amp; Payouts</span>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
            Track gross billings, platform commissions, transactions ledger, and withdraw available balances.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 border border-stone-200 self-start sm:self-auto">
          {(['overview', 'transactions', 'withdrawals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all ${
                activeSubTab === tab ? 'bg-black text-white shadow-sm' : 'text-stone-600 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-400">Total Month Revenue</div>
              <div className="mt-2 text-3xl sm:text-4xl font-display font-medium tracking-tight text-stone-900">
                ₹42,580
              </div>
              <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <TrendingUp size={13} />
                <span>+18.4% from last month</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-400">Completed Jobs</div>
              <div className="mt-2 text-3xl sm:text-4xl font-display font-medium tracking-tight text-stone-900">
                68
              </div>
              <div className="mt-2 text-xs font-semibold text-stone-500">
                Across AC Care &amp; Electricals
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-400">Average Job Value</div>
              <div className="mt-2 text-3xl sm:text-4xl font-display font-medium tracking-tight text-stone-900">
                ₹626
              </div>
              <div className="mt-2 text-xs font-semibold text-stone-500">
                +₹45 vs neighborhood average
              </div>
            </div>

            {/* Available Balance & Payout CTA */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-md flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-amber-300">Available to Withdraw</div>
                <div className="mt-1 text-3xl sm:text-4xl font-display font-medium tracking-tight text-white">
                  ₹{availableBalance}
                </div>
              </div>
              <button
                onClick={onOpenWithdrawModal}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all text-center shadow"
              >
                Withdraw Money →
              </button>
            </div>
          </div>

          {/* Weekly Earnings Chart Representation */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-stone-900">
                  Daily Earnings <span className="italic font-normal">Pulse</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Week of September 1 — 7, 2026</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
                Peak: ₹8,900 on Saturday
              </span>
            </div>

            {/* Bar chart visualization */}
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-4 border-b border-stone-100">
              {weeklyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.amount}
                  </span>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[48px] rounded-t-xl bg-stone-900 group-hover:bg-amber-400 transition-colors shadow-xs"
                  />
                  <span className="text-xs font-bold text-stone-600 mt-1 whitespace-nowrap">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Worksy platform deductions are processed net at 10%.</span>
              <span>All payouts credited to verified UPI / Bank.</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TRANSACTIONS */}
      {activeSubTab === 'transactions' && (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-stone-900">
                Transaction <span className="italic font-normal">Ledger</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Detailed breakdown of customer payments and platform fees</p>
            </div>
            <button
              onClick={() => alert('Downloading September 2026 GST compliant transaction statement...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
            >
              <Download size={13} />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-stone-400 font-bold uppercase text-[10px] tracking-wider border-b border-stone-100">
                  <th className="pb-3">Reference / Date</th>
                  <th className="pb-3">Service &amp; Customer</th>
                  <th className="pb-3 text-right">Gross Total</th>
                  <th className="pb-3 text-right">Platform Fee (10%)</th>
                  <th className="pb-3 text-right">Net Credited</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4">
                      <div className="font-mono font-bold text-stone-900">{tx.id}</div>
                      <div className="text-[11px] text-stone-400">{tx.date}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-stone-900">{tx.serviceTitle}</div>
                      <div className="text-[11px] text-stone-500">{tx.customerName}</div>
                    </td>
                    <td className="py-4 text-right font-mono font-semibold text-stone-900">
                      ₹{tx.grossAmount}
                    </td>
                    <td className="py-4 text-right font-mono text-stone-500">
                      {tx.platformFee > 0 ? `-₹${tx.platformFee}` : '₹0'}
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-emerald-800">
                      +{tx.type === 'payout' ? `-₹${tx.netAmount}` : `₹${tx.netAmount}`}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        <CheckCircle2 size={11} />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: WITHDRAWALS */}
      {activeSubTab === 'withdrawals' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">Available Balance</span>
              <div className="mt-1 text-4xl sm:text-5xl font-display font-medium tracking-tight text-emerald-900">
                ₹{availableBalance}
              </div>
              <p className="text-xs text-stone-500 mt-1">Ready for zero-fee instant transfer to your bank or UPI.</p>
            </div>

            <button
              onClick={onOpenWithdrawModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-black text-white text-xs sm:text-sm font-bold hover:bg-stone-800 transition-colors shadow-md"
            >
              <ArrowUpRight size={16} />
              <span>Withdraw Money Now</span>
            </button>
          </div>

          {/* Linked Bank / Payout Method */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-display text-xl font-medium text-stone-900">Verified Payout Accounts</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                  UPI
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">Primary Instant UPI</div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5 font-mono">ravi.sharma@okaxis</div>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active • Instant Settlements
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">Bank Account (NEFT/IMPS)</div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">HDFC Bank • ****4920</div>
                  <span className="inline-block mt-1 text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    Indiranagar Branch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
