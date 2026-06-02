import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const PurchaseDetectionScreen = () => {
  const { 
    setActiveScreen, 
    interceptedPurchase, 
    declineTransaction,
    childProfiles
  } = useContext(AppContext);

  const t = interceptedPurchase;
  if (!t) return null;

  const child = childProfiles[t.childId];

  const handleDecline = () => {
    declineTransaction(t.id);
    setActiveScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto space-y-8 flex flex-col justify-center">
      
      {/* AI protection banner */}
      <div className="w-full py-3 bg-secondary-container/10 border border-secondary-container/30 rounded-xl flex items-center justify-center gap-3 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-container/5 to-transparent shimmer"></div>
        <span className="material-symbols-outlined text-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified_user
        </span>
        <span className="font-label-sm text-[10px] tracking-[0.2em] text-secondary-container font-extrabold uppercase">
          AI INTERCEPT PROTECTION ACTIVATED
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left column: animated shield scan */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center py-8 relative min-h-[300px]">
          {/* Pulsating glow backdrops */}
          <div className="absolute w-56 h-56 bg-secondary-container/15 rounded-full ai-glow-effect"></div>
          
          {/* Scanning Hud Circle */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-secondary-container/10 rounded-full animate-ping" style={{ animationDuration: '3.5s' }}></div>
            <div className="absolute inset-6 border-2 border-secondary-container/30 rounded-full animate-pulse"></div>
            
            {/* Hexagonal dot patterns */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00eefc_1px,transparent_1px)] [background-size:16px_16px] rounded-full"></div>
            
            {/* Core Shield */}
            <div className="z-10 flex flex-col items-center">
              <span className="material-symbols-outlined text-[100px] md:text-[130px] text-secondary-container drop-shadow-[0_0_15px_rgba(0,238,252,0.3)] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                security
              </span>
              <div className="mt-3 flex flex-col items-center gap-1.5">
                <span className="font-headline-md text-[14px] text-white tracking-widest uppercase font-semibold">
                  Analyzing Spending Pattern
                </span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Card details */}
        <div className="lg:col-span-5">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-headline-lg text-[20px] font-bold text-white tracking-tight">
                  Intercepted Request
                </h3>
                <span className="bg-error-container/20 text-error text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-error/20">
                  UNAUTHORIZED
                </span>
              </div>

              {/* Item Info row */}
              <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-primary-fixed-dim">
                    sports_esports
                  </span>
                  <div className="absolute inset-0 scan-line"></div>
                </div>
                <div>
                  <h4 className="font-headline-md text-[16px] font-bold text-white">{t.itemName}</h4>
                  <p className="font-body-md text-[13px] text-on-surface-variant font-medium">{t.gameName}</p>
                </div>
              </div>

              {/* Spec fields */}
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-on-surface-variant">Amount requested</span>
                  <span className="text-primary-fixed-dim font-headline-md text-[18px] font-bold">${t.amount}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-on-surface-variant">Requested by</span>
                  <span className="text-white font-medium">{child.name}'s Device ({t.device})</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-on-surface-variant">AI Detection Method</span>
                  <div className="flex items-center gap-1.5 text-secondary-container font-semibold text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      psychology
                    </span>
                    Behavioral Anomaly
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => setActiveScreen('age')}
                  className="w-full h-14 bg-primary-container text-on-primary font-bold rounded-full flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  Continue AI Verification
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <button 
                  onClick={handleDecline}
                  className="w-full h-14 border-2 border-error/40 text-error font-bold rounded-full hover:bg-error/5 active:scale-95 transition-all text-xs uppercase tracking-wider"
                >
                  Decline & Block Purchase
                </button>
              </div>

              <p className="text-center text-[10px] text-on-surface-variant leading-relaxed opacity-60">
                SecurePlay encrypts all verification steps. Security keys are generated on-device.
              </p>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default PurchaseDetectionScreen;
