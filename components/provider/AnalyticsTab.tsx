'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Percent,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsTab() {
  const metrics = [
    { label: 'Total Bookings', value: '124', change: '+12% vs last month', positive: true },
    { label: 'Completed Jobs', value: '116', change: '93.5% fulfillment rate', positive: true },
    { label: 'Cancellations', value: '8', change: '6.5% cancellation rate', positive: false },
    { label: 'Acceptance Rate', value: '94%', change: 'Top 5% in Indiranagar', positive: true },
    { label: 'Overall Revenue', value: '₹42,580', change: '+18.4% month-on-month', positive: true },
    { label: 'Avg. Job Value', value: '₹626', change: '+₹45 vs avg pro', positive: true },
    { label: 'Repeat Clients', value: '38%', change: '47 repeat customers', positive: true },
    { label: 'Response Time', value: '8 mins', change: 'Under 10 mins target', positive: true }
  ];

  const categoryBreakdown = [
    { category: 'AC Deep Clean & Jet Wash', count: 48, percentage: 41, revenue: '₹23,952' },
    { category: 'Switchboard & Fan Installation', count: 38, percentage: 33, revenue: '₹11,400' },
    { category: 'AC Gas Charge & Leak Repair', count: 18, percentage: 16, revenue: '₹18,000' },
    { category: 'Main DB & MCB Tripping Fix', count: 12, percentage: 10, revenue: '₹4,788' }
  ];

  return (
    <div className="space-y-8 pb-24 w-full max-w-[1840px] 2xl:max-w-[1920px] mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-stone-500">
          Business Intelligence
        </p>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tightest text-stone-900 leading-tight">
          Performance <span className="italic font-normal">Analytics</span>
        </h2>
        <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
          Comprehensive operational metrics, booking conversion ratios, and category revenue share.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between"
          >
            <div className="text-xs uppercase font-bold text-stone-400 tracking-wider">
              {m.label}
            </div>
            <div className="my-2 font-display text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
              {m.value}
            </div>
            <div
              className={`text-xs font-semibold ${
                m.positive ? 'text-emerald-700' : 'text-stone-500'
              }`}
            >
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-stone-900">
            Revenue by <span className="italic font-normal">Service Category</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Top-performing electrical and HVAC service lines</p>
        </div>

        <div className="space-y-4">
          {categoryBreakdown.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-stone-900">{item.category}</span>
                <span className="text-emerald-800 font-mono">{item.revenue} ({item.count} jobs)</span>
              </div>
              <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className="h-full bg-stone-900 rounded-full transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
