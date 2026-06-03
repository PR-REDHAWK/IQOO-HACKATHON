import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export const DashboardScreen = () => {
  const {
    setActiveScreen,
    pendingTransactions,
    displayPendingTransactions,
    approvedCount,
    blockedCount,
    totalProtectedAmount,
    childProfiles,
    setActiveAlert,
    approveTransaction,
    declineTransaction,
    geminiApiKey,
    saveGeminiKey,
    resetDemo,
    historyTransactions,
    updateTransactionStatus
  } = useContext(AppContext);

  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  
  // Exclude 'intercepted' transactions from parent view until child submits
  const displayPendingTransactionsFiltered = displayPendingTransactions.filter(
    (t) => t.status === 'pending' || t.status === 'approved' || t.status === 'otp_pending'
  );
  
  const pendingRequestsCount = displayPendingTransactionsFiltered.length;
  const approvedTodayCount = historyTransactions.filter(
    (t) => t.status === 'completed' || t.status === 'APPROVED'
  ).length;
  const rejectedTodayCount = historyTransactions.filter(
    (t) => t.status === 'rejected' || t.status === 'BLOCKED'
  ).length;
  const highRiskRequestsCount = displayPendingTransactionsFiltered.filter(
    (t) => t.riskScore >= 75
  ).length;

  const highestRiskScore = displayPendingTransactionsFiltered.reduce(
    (highest, transaction) => Math.max(highest, transaction.riskScore),
    0
  );
  
  const pendingApprovalCount = pendingRequestsCount;
  
  const formatCurrency = (value) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2 });

  const handleSaveKey = (e) => {
    e.preventDefault();
    saveGeminiKey(apiKeyInput);
    setShowSettings(false);
  };

  const handleCardClick = (transaction) => {
    setActiveAlert(transaction);
    setActiveScreen('approval');
  };

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto space-y-8 relative">
      
      {/* Quick Settings Icon floating header */}
      <div className="flex justify-between items-center mt-4">
        <h2 className="font-headline-lg text-[22px] md:text-[28px] font-bold text-white tracking-tight">
          Parental Portal
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => resetDemo()}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-on-surface-variant hover:text-white active:scale-95 transition-all"
          >
            Reset Demo
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>

      {/* Settings Modal (Gemini API Key) */}
      {showSettings && (
        <div className="glass-card rounded-2xl p-6 border border-primary-container/20 bg-black/90 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-[18px] font-bold text-primary-fixed-dim">AI Risk Engine Settings</h3>
            <button onClick={() => setShowSettings(false)} className="text-on-surface-variant hover:text-white">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <form onSubmit={handleSaveKey} className="space-y-3">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Configure your Gemini API key to enable live generation of AI Explanations. If empty, SecurePlay uses a localized rule-based engine that produces identical structures.
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="Paste Gemini API Key..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary-container"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Save Key
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Stats Hero */}
      <section className="bg-gradient-to-r from-surface-container-high/80 to-[#121212] glass-card rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/10">
        <div>
          <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">
            Total Protection Active
          </p>
          <h3 className="font-headline-lg text-[22px] md:text-[26px] font-extrabold text-primary-fixed-dim tracking-tight">
            Protected Amount: ${formatCurrency(totalProtectedAmount)}
          </h3>
        </div>
        <button 
          onClick={() => setActiveScreen('analytics')}
          className="bg-primary-container text-on-primary font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
        >
          View Full Report
        </button>
      </section>

      {/* Context Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pending Requests', value: pendingRequestsCount, icon: 'pending_actions', color: 'text-primary-fixed-dim' },
          { label: 'Approved Today', value: approvedTodayCount, icon: 'check_circle', color: 'text-secondary-container' },
          { label: 'Rejected Today', value: rejectedTodayCount, icon: 'block', color: 'text-error' },
          { label: 'High Risk Requests', value: highRiskRequestsCount, icon: 'warning', color: 'text-error' }
        ].map((metric) => (
          <div key={metric.label} className="glass-card rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 flex-shrink-0">
              <span className={`material-symbols-outlined text-[22px] ${metric.color}`}>
                {metric.icon}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider leading-none mb-1.5 truncate">
                {metric.label}
              </p>
              <h3 className="font-headline-md text-[20px] font-extrabold text-white leading-none truncate">
                {metric.value}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* Pending Approvals Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-[18px] md:text-[20px] font-bold text-white tracking-tight">
            Pending Approvals
          </h3>
          <span className="text-primary-fixed-dim font-label-sm text-xs font-semibold hover:underline cursor-pointer">
            See all ({pendingApprovalCount})
          </span>
        </div>

        {pendingApprovalCount === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-dashed border-white/10 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[48px] mb-2 text-secondary-container animate-pulse">
              verified
            </span>
            <p>All child purchases are settled. SecurePlay is monitoring.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x">
            {displayPendingTransactionsFiltered.map((t) => {
              const child = childProfiles[t.childId];
              const isHigh = t.riskScore >= 75;
              const isMed = t.riskScore >= 40 && t.riskScore < 75;

              return (
                <div 
                  key={t.id} 
                  className={`min-w-[290px] md:min-w-[340px] glass-card rounded-2xl p-5 snap-start relative border transition-all ${
                    isHigh ? 'border-error/30 hover:border-error/60' : isMed ? 'border-primary-fixed-dim/30 hover:border-primary-fixed-dim/60' : 'border-white/10'
                  }`}
                >
                  {/* Card content header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <span className="material-symbols-outlined text-primary-fixed-dim">
                        {t.category === 'In-App' ? 'shopping_cart' : 'sports_esports'}
                      </span>
                    </div>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAlert(t);
                        setActiveScreen('risk');
                      }}
                      className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                        isHigh ? 'bg-error-container text-on-error-container' : isMed ? 'bg-primary-container/20 text-primary-fixed-dim' : 'bg-secondary-container/20 text-secondary-container'
                      }`}
                    >
                      {t.riskScore}% {isHigh ? 'High Risk' : isMed ? 'Med Risk' : 'Low Risk'}
                    </span>
                  </div>

                  {/* Child and Price */}
                  <div className="cursor-pointer" onClick={() => handleCardClick(t)}>
                    <p className="font-label-sm text-[11px] text-on-surface-variant font-semibold">{child.name}</p>
                    <h4 className="font-headline-md text-[24px] font-extrabold text-white mt-0.5">${formatCurrency(t.amount)}</h4>
                    <p className="text-[13px] text-on-surface-variant line-clamp-1 mt-1 font-medium">
                      {t.gameName}: {t.itemName}
                    </p>
                    
                    {/* Dynamic AI Explanation */}
                    <div className="my-4 bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-2">
                      <p className="text-[11px] text-on-surface-variant italic leading-normal flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-secondary-container text-xs mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          auto_awesome
                        </span>
                        <span>{t.riskReasons?.[0] || t.aiExplanation}</span>
                      </p>
                      <div className="text-[10px] text-secondary-container font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        {t.recommendation}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5 mt-2">
                    <button 
                      onClick={() => updateTransactionStatus(t.id, 'rejected')}
                      className="flex-1 py-2.5 rounded-full bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 active:scale-95 transition-all text-xs font-bold"
                    >
                      Deny
                    </button>
                    <button 
                      onClick={() => {
                        setActiveAlert(t);
                        updateTransactionStatus(t.id, 'approved');
                        setActiveScreen('face-verification');
                      }}
                      className="flex-1 py-2.5 rounded-full bg-primary-container text-on-primary hover:brightness-110 active:scale-95 transition-all text-xs font-bold"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bento Section: Child Profiles & AI Smart Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Child Profiles (span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-headline-md text-[18px] font-bold text-white tracking-tight">
            Child Accounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(childProfiles).map(([key, profile]) => {
              const percentage = Math.round((profile.spending / profile.limit) * 100);
              
              return (
                <div key={key} className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-white/5 hover:bg-white/[0.02] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={profile.avatar} 
                      alt={`${profile.name} Avatar`} 
                      className="w-10 h-10 rounded-full border border-white/10 object-cover"
                    />
                    <div>
                      <h4 className="font-headline-md text-[15px] font-bold text-white">{profile.name}</h4>
                      <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
                        Age {profile.age} • Guard Active
                      </p>
                    </div>
                  </div>
                  
                  {/* Budget Slider status */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-label-sm text-[11px] text-on-surface-variant">
                      <span>Monthly Spending</span>
                      <span className="text-primary-fixed-dim font-bold">${profile.spending} / ${profile.limit}</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary-container to-primary-fixed-dim transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight Smart Banner */}
        <div className="space-y-4">
          <h3 className="font-headline-md text-[18px] font-bold text-white tracking-tight flex items-center gap-1.5">
            AI Insight
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
          </h3>
          
          <div className="glass-card ai-glow border-secondary-container/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px]">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center border border-secondary-container/20">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  auto_awesome
                </span>
              </div>
              <p className="text-[13px] text-on-surface leading-relaxed">
                <span className="text-secondary-container font-extrabold">{pendingApprovalCount} pending approval{pendingApprovalCount === 1 ? '' : 's'}</span> with a peak risk score of {highestRiskScore}%. Recommend verifying key device security boundaries.
              </p>
            </div>

            <button 
              onClick={() => setActiveScreen('risk')}
              className="w-full mt-4 py-3 rounded-xl border border-secondary-container text-secondary-container font-bold text-xs hover:bg-secondary-container/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Analyze Behavioral Patterns
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
export default DashboardScreen;
