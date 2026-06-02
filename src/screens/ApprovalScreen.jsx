import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { RiskMeter } from '../components/RiskMeter';

export const ApprovalScreen = () => {
  const { 
    setActiveScreen, 
    activeAlert, 
    childProfiles, 
    approveTransaction, 
    declineTransaction 
  } = useContext(AppContext);

  const [voiceProgress, setVoiceProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const t = activeAlert;
  if (!t) {
    return (
      <div className="min-h-screen bg-black text-[#e2e2e2] pt-24 px-6 text-center space-y-4">
        <p className="text-on-surface-variant">No pending transaction selected.</p>
        <button 
          onClick={() => setActiveScreen('dashboard')}
          className="px-6 py-2 bg-primary-container text-on-primary rounded-full font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const child = childProfiles[t.childId];

  // Voice activation hold logic
  useEffect(() => {
    let timer;
    if (isHolding) {
      timer = setInterval(() => {
        setVoiceProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Approve transaction
            approveTransaction(t.id);
            setActiveScreen('dashboard');
            setIsHolding(false);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    } else {
      setVoiceProgress(0);
    }

    return () => clearInterval(timer);
  }, [isHolding, approveTransaction, t.id, setActiveScreen]);

  const handleApprove = () => {
    approveTransaction(t.id);
    setActiveScreen('dashboard');
  };

  const handleReject = () => {
    declineTransaction(t.id);
    setActiveScreen('dashboard');
  };

  const isHighRisk = t.riskScore >= 75;

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto space-y-6">
      
      {/* Return Back Button */}
      <button 
        onClick={() => setActiveScreen('dashboard')}
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all mt-4"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Return to Alerts
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Transaction details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-label-sm text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                  Requesting account
                </p>
                <h3 className="font-headline-md text-[18px] font-bold text-white mt-0.5">
                  {child.name}'s Request
                </h3>
              </div>
              <span className="bg-error-container/20 text-error text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-error/25">
                PENDING DECISION
              </span>
            </div>

            {/* Price tag */}
            <div className="py-4 border-y border-white/5">
              <p className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">Total Purchase Value</p>
              <h2 className="font-headline-xl text-[42px] font-extrabold text-white mt-1">
                ${t.amount}
              </h2>
            </div>

            {/* Game Preview card details */}
            <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl items-center">
              <img 
                src={t.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80'} 
                alt={t.gameName}
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
              />
              <div className="space-y-1">
                <h4 className="font-headline-md text-[16px] font-bold text-white leading-none">{t.gameName}</h4>
                <p className="text-[13px] text-on-surface-variant leading-none">{t.itemName}</p>
                <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[9px] font-bold text-on-surface-variant">
                  CONTENT RATED: {t.ageRating}
                </div>
              </div>
            </div>

            {/* Telemetry info fields */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold block mb-0.5">Source device</span>
                <span className="text-white font-medium">{t.device}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold block mb-0.5">Timestamp</span>
                <span className="text-white font-medium">{t.time} • {t.date}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Risk Meter & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
            
            {/* Risk engine details header */}
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-[18px] font-bold text-white tracking-tight">
                AI Risk Assessment
              </h3>
              <span className="text-xs text-secondary-container font-mono tracking-widest uppercase">
                Vanguard Engine
              </span>
            </div>

            {/* Gauge and metrics split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <RiskMeter score={t.riskScore} size="medium" />

              {/* Specific risk category bars */}
              <div className="space-y-3">
                {[
                  { label: 'Age constraint', score: t.riskMetrics?.ageRisk || 0 },
                  { label: 'Amount ratio', score: t.riskMetrics?.amountRisk || 0 },
                  { label: 'Request density', score: t.riskMetrics?.frequencyRisk || 0 },
                  { label: 'Time window', score: t.riskMetrics?.timeRisk || 0 }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-on-surface-variant">
                      <span>{metric.label}</span>
                      <span className={metric.score >= 70 ? 'text-error font-bold' : metric.score >= 40 ? 'text-primary-fixed-dim font-bold' : 'text-secondary-container font-bold'}>
                        {metric.score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          metric.score >= 70 ? 'bg-error' : metric.score >= 40 ? 'bg-primary-fixed-dim' : 'bg-secondary-container'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI explanation block */}
            <div className="bg-secondary-container/5 border border-secondary-container/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-secondary-container text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                AI Explanation for Parent
              </div>
              <p className="text-[13px] text-on-surface leading-relaxed italic">
                "{t.aiExplanation}"
              </p>
            </div>

            {/* Standard actions */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={handleReject}
                className="flex-1 h-14 border-2 border-error/50 text-error font-bold rounded-full hover:bg-error/5 active:scale-95 transition-all text-xs uppercase tracking-wider"
              >
                Reject purchase
              </button>
              <button 
                onClick={handleApprove}
                className="flex-1 h-14 bg-primary-container text-on-primary font-bold rounded-full hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider"
              >
                Approve purchase
              </button>
            </div>

            {/* Voice authorization overlay portal */}
            <div className="border-t border-white/5 pt-6 flex flex-col items-center space-y-4">
              <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold text-center">
                Secure Quick-Approval
              </p>
              
              <div className="relative flex flex-col items-center">
                {/* Voice ripples animation */}
                {isHolding && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-secondary-container/40 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-2 rounded-full border border-primary-fixed-dim/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                  </>
                )}

                <button 
                  onMouseDown={() => setIsHolding(true)}
                  onMouseUp={() => setIsHolding(false)}
                  onMouseLeave={() => setIsHolding(false)}
                  onTouchStart={() => setIsHolding(true)}
                  onTouchEnd={() => setIsHolding(false)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-300 ${
                    isHolding 
                      ? 'bg-secondary-container border-secondary-container text-on-secondary shadow-[0_0_30px_rgba(0,238,252,0.6)] scale-90' 
                      : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: isHolding ? "'FILL' 1" : "'FILL' 0" }}>
                    mic
                  </span>
                </button>
              </div>

              <div className="text-center w-full max-w-xs space-y-1">
                <p className="text-xs text-white font-bold uppercase tracking-wider">
                  {isHolding ? 'Holding to approve...' : 'Hold microphone button'}
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  {isHolding ? `${voiceProgress}% biometrics validated` : 'Verifies your unique voice print pattern to sign purchase request'}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
export default ApprovalScreen;
