import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const PurchaseDetectionScreen = () => {
  const { 
    setActiveScreen, 
    interceptedPurchase, 
    declineTransaction,
    childProfiles,
    otps
  } = useContext(AppContext);

  const t = interceptedPurchase;
  if (!t) {
    return (
      <div className="min-h-screen bg-black text-[#e2e2e2] pt-24 px-6 text-center space-y-4 flex flex-col justify-center items-center">
        <span className="material-symbols-outlined text-[64px] text-secondary-container animate-pulse">
          verified
        </span>
        <h3 className="font-headline-md text-[20px] font-bold text-white">All Payments Secure</h3>
        <p className="text-on-surface-variant max-w-xs mx-auto text-xs">
          No transactions are currently pending verification. The SecurePlay guard is monitoring.
        </p>
      </div>
    );
  }

  const child = childProfiles[t.childId] || { name: 'Child' };

  const handleDecline = () => {
    declineTransaction(t.id);
    setActiveScreen('dashboard');
  };

  // 1. Initial State: Intercepted request (not yet scanned)
  if (t.status === 'intercepted') {
    return (
      <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto space-y-8 flex flex-col justify-center">
        <div className="w-full py-3 bg-secondary-container/10 border border-secondary-container/30 rounded-xl flex items-center justify-center gap-3 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-container/5 to-transparent shimmer"></div>
          <span className="material-symbols-outlined text-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="font-label-sm text-[10px] tracking-[0.2em] text-secondary-container font-extrabold uppercase">
            AI INTERCEPT PROTECTION ACTIVATED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-center justify-center py-8 relative min-h-[300px]">
            <div className="absolute w-56 h-56 bg-secondary-container/15 rounded-full ai-glow-effect"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-secondary-container/10 rounded-full animate-ping" style={{ animationDuration: '3.5s' }}></div>
              <div className="absolute inset-6 border-2 border-secondary-container/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00eefc_1px,transparent_1px)] [background-size:16px_16px] rounded-full"></div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Child Dashboard / Status tracking states
  let statusTitle = "";
  let statusDesc = "";
  let statusIcon = "";
  let iconColor = "";
  let progressPct = 0;
  let showOtpButton = false;

  switch (t.status) {
    case 'pending':
      statusTitle = "Waiting for Parent Approval";
      statusDesc = `Your purchase request for ${t.gameName} has been encrypted and sent to your parent's dashboard. Awaiting verification decision.`;
      statusIcon = "pending_actions";
      iconColor = "text-primary-fixed-dim";
      progressPct = 25;
      break;
    case 'approved':
      statusTitle = "Parent Approval Received";
      statusDesc = "Verification successful. Parent identity verification check is active on parent portal.";
      statusIcon = "verified_user";
      iconColor = "text-secondary-container animate-pulse";
      progressPct = 50;
      break;
    case 'otp_pending':
      statusTitle = "OTP Verification Required";
      statusDesc = "Parent has confirmed approval. Enter the verification code generated on your parent's device to complete payment.";
      statusIcon = "vpn_key";
      iconColor = "text-secondary-container animate-bounce";
      progressPct = 75;
      showOtpButton = true;
      break;
    default:
      statusTitle = "Awaiting Verification";
      statusDesc = "Active security lock. Waiting for verification updates.";
      statusIcon = "lock";
      iconColor = "text-white";
      progressPct = 10;
  }

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto flex flex-col justify-center items-center space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-1.5 max-w-md">
        <h2 className="font-headline-xl text-[24px] md:text-[32px] font-extrabold text-white tracking-tight">
          Payment Status Tracker
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Monitor the real-time lifecycle of your active checkout request.
        </p>
      </div>

      {/* Main Status Bento Card */}
      <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/5 rounded-full blur-2xl"></div>

        {/* Visual Pulse Header */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className={`material-symbols-outlined text-[36px] ${iconColor}`}>
              {statusIcon}
            </span>
          </div>
          <h3 className="text-white font-extrabold text-lg tracking-tight text-center">{statusTitle}</h3>
          <p className="text-xs text-on-surface-variant text-center leading-relaxed max-w-sm">
            {statusDesc}
          </p>
        </div>

        {/* Purchase Summary Row */}
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs">
          <div>
            <p className="font-bold text-white leading-none mb-1">{t.itemName}</p>
            <p className="text-[10px] text-on-surface-variant leading-none">{t.gameName}</p>
          </div>
          <span className="text-primary-fixed-dim font-extrabold text-sm">${t.amount}</span>
        </div>

        {/* Progress Tracker bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
            <span>Checkout Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-secondary-container to-primary-fixed-dim transition-all duration-500 shadow-[0_0_10px_rgba(0,238,252,0.3)]"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Interactive OTP button */}
        {showOtpButton && (
          <button 
            onClick={() => setActiveScreen('otp-entry')}
            className="w-full h-14 bg-secondary-container text-on-secondary-container font-extrabold rounded-full hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">vpn_key</span>
            Enter Verification OTP
          </button>
        )}

        {/* Rejection / Timeline details */}
        <div className="border-t border-white/5 pt-4 text-[10px] text-on-surface-variant space-y-1">
          <p className="flex justify-between">
            <span>Requested at:</span>
            <span className="text-white font-mono">{t.createdAt || t.time}</span>
          </p>
          {t.approvedAt && (
            <p className="flex justify-between">
              <span>Parent Approved at:</span>
              <span className="text-white font-mono">{t.approvedAt}</span>
            </p>
          )}
          {t.faceVerifiedAt && (
            <p className="flex justify-between">
              <span>Face Verified at:</span>
              <span className="text-white font-mono">{t.faceVerifiedAt}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetectionScreen;
