import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const AnalyticsScreen = () => {
  const { totalProtectedAmount, monthlySavings, blockedCount, historyTransactions } = useContext(AppContext);

  // Simulated Weekly Spending columns heights
  const weeklyData = [
    { day: 'Mon', value: 12 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 18 },
    { day: 'Thu', value: 92 },
    { day: 'Fri', value: 120 },
    { day: 'Sat', value: 165 },
    { day: 'Sun', value: 99 }
  ];

  const maxVal = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto space-y-8">
      
      {/* Title */}
      <div className="mt-4">
        <h2 className="font-headline-lg text-[22px] md:text-[28px] font-bold text-white tracking-tight">
          Analytics & Insights
        </h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Review historical expenditure trends, category distributions, and neural rules.
        </p>
      </div>

      {/* Grid: Totals Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Value Protected', value: `$${totalProtectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: 'shield', color: 'text-secondary-container' },
          { label: 'Monthly Revert Savings', value: `$${monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: 'savings', color: 'text-primary-fixed-dim' },
          { label: 'Blocked Fraud Requests', value: blockedCount, icon: 'block', color: 'text-error' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 flex items-center gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 flex-shrink-0">
              <span className={`material-symbols-outlined text-[26px] ${item.color}`}>
                {item.icon}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider leading-none mb-1.5">{item.label}</p>
              <h3 className="font-headline-md text-[20px] font-extrabold text-white leading-none">{item.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Spending Column Graph (span-7) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-[16px] font-bold text-white tracking-tight">
              Weekly Expenditures
            </h3>
            <span className="text-xs text-on-surface-variant font-medium">Last 7 Days</span>
          </div>

          {/* Bar Graph container */}
          <div className="h-56 flex items-end justify-between gap-2.5 pt-6 px-2">
            {weeklyData.map((d, idx) => {
              const percentage = Math.round((d.value / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex justify-center">
                    {/* Hover tooltip */}
                    <span className="absolute -top-8 bg-surface-container-high border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                      ${d.value}
                    </span>
                    {/* Bar filled element */}
                    <div 
                      className="w-5 md:w-8 bg-gradient-to-t from-secondary-container to-primary-fixed-dim rounded-t-lg transition-all duration-1000 shadow-[0_0_15px_rgba(0,238,252,0.1)] group-hover:brightness-110"
                      style={{ height: `${percentage * 1.5}px` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category distribution (span-5) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <h3 className="font-headline-md text-[16px] font-bold text-white tracking-tight">
            Blocked Categories
          </h3>

          <div className="space-y-4 pt-2">
            {[
              { category: 'In-App Upgrades (Gems, Coins)', percentage: 65, color: 'bg-secondary-container', text: 'text-secondary-container' },
              { category: 'Unrated Subscriptions', percentage: 20, color: 'bg-primary-fixed-dim', text: 'text-primary-fixed-dim' },
              { category: 'Restricted Age Content', percentage: 15, color: 'bg-error', text: 'text-error' }
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">{cat.category}</span>
                  <span className={cat.text}>{cat.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* AI Recommendation Panel */}
      <section className="glass-card premium-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-1.5 text-primary-fixed-dim text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          AI Smart Recommendations
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1.5 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              Subscription warning
            </h4>
            <p className="text-on-surface-variant text-[12px] leading-relaxed">
              Maya spends 45% of budget on auto-renewing gaming passes. Consider locking custom subscription terms under limits.
            </p>
          </div>
          <div className="space-y-1.5 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span>
              Bedtime cooldown
            </h4>
            <p className="text-on-surface-variant text-[12px] leading-relaxed">
              Leo's late-night attempts (after 11 PM) trigger 85% of warnings. Consider activating a curfew schedule on Leo's iPad.
            </p>
          </div>
        </div>
      </section>

      {/* Transaction History log */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-[18px] font-bold text-white tracking-tight">
          Recent Safety Log
        </h3>
        
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          {historyTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 flex-shrink-0">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">
                    {tx.status === 'APPROVED' ? 'check_circle' : tx.status === 'BLOCKED' ? 'cancel' : 'verified'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold truncate">{tx.itemName}</h4>
                  <p className="text-on-surface-variant text-[10px] truncate">{tx.gameName} • {tx.time}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">${tx.amount}</p>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                  tx.status === 'APPROVED' ? 'text-secondary-container' : tx.status === 'BLOCKED' ? 'text-error' : 'text-primary-fixed-dim'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
export default AnalyticsScreen;
