import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export const AgeVerificationScreen = () => {
  const { setActiveScreen, interceptedPurchase, activeAlert, setActiveAlert } = useContext(AppContext);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  // Progressive scan timer simulation
  useEffect(() => {
    if (!isScanning) return;
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 84) {
          clearInterval(interval);
          setIsScanning(false);
          return 84;
        }
        return prev + Math.floor(Math.random() * 5 + 3);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleRetry = () => {
    setIsScanning(true);
  };

  const handleConfirm = () => {
    // Navigate parent straight to the approval screen for this transaction
    if (interceptedPurchase) {
      setActiveAlert(interceptedPurchase);
    }
    setActiveScreen('approval');
  };

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto flex flex-col items-center justify-center">
      
      {/* Title */}
      <div className="text-center mb-6 space-y-1.5 max-w-md">
        <h2 className="font-headline-xl text-[24px] md:text-[32px] font-extrabold text-white tracking-tight">
          Identity Verification
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Biometric face-telemetry checking child age against target entertainment age thresholds.
        </p>
      </div>

      {/* Camera Viewport Bento Card */}
      <div className="relative w-full max-w-lg aspect-[4/5] bg-surface-container-low rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        
        {/* Grayscale camera picture placeholder */}
        <img 
          alt="Camera viewport simulation of child" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4] transition-all"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80"
        />

        {/* Scan HUD Overlay details */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none z-10">
          
          {/* Top telemetry bar */}
          <div className="flex justify-between items-start">
            <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-secondary-container/30 flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full bg-secondary-container ${isScanning ? 'glow-pulse' : ''}`}></div>
              <span className="font-label-sm text-[9px] uppercase tracking-widest text-secondary-container font-semibold">
                {isScanning ? 'Scanner Running' : 'Scan Finalized'}
              </span>
            </div>
            <div className="text-right text-[9px] text-on-surface-variant font-mono uppercase tracking-wider leading-relaxed">
              ENC: AES-256<br />
              FPS: 60 / HDR
            </div>
          </div>

          {/* HUD Target brackets */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56">
            <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
            <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
            <div className="hud-corner bottom-0 left-0 border-b-2 border-l-2"></div>
            <div className="hud-corner bottom-0 right-0 border-b-2 border-r-2"></div>
            
            {/* Scan animation line */}
            {isScanning && <div className="scan-line"></div>}

            {/* Simulated landmark facial vectors overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <svg className="w-full h-full text-secondary-container" viewBox="0 0 100 100">
                <circle cx="35" cy="40" r="1.5" fill="currentColor" />
                <circle cx="65" cy="40" r="1.5" fill="currentColor" />
                <circle cx="50" cy="55" r="1.5" fill="currentColor" />
                <path d="M 38 70 Q 50 76 62 70" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          </div>

          {/* Floating Data boxes */}
          <div className="absolute right-4 top-16 space-y-2">
            <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-right transition-all">
              <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Estimated Age</p>
              <p className="font-headline-md text-[18px] font-bold text-secondary-container">12.4 Years</p>
            </div>
            <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-right transition-all">
              <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Confidence</p>
              <p className="font-headline-md text-[18px] font-bold text-secondary-container">98.2%</p>
            </div>
          </div>

          {/* Bottom HUD bar elements */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Risk badge indicator */}
            {!isScanning && (
              <div className="self-start inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 px-4 py-2 rounded-xl backdrop-blur-xl">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  warning
                </span>
                <div>
                  <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider leading-none">AI Profile mismatch</p>
                  <p className="text-[12px] text-primary-container font-extrabold mt-0.5 leading-none">MINOR DETECTED</p>
                </div>
              </div>
            )}

            {/* Scan Progress Bar */}
            <div className="w-full space-y-1">
              <div className="flex justify-between items-end font-label-sm text-[10px] text-on-surface-variant font-semibold">
                <span className={isScanning ? 'animate-pulse text-secondary-container' : 'text-white'}>
                  {isScanning ? 'Scanning Facial Geometry...' : 'Analysis Locked'}
                </span>
                <span>{scanProgress}% Complete</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary-container to-primary-fixed-dim transition-all duration-300 shadow-[0_0_10px_rgba(0,238,252,0.4)]"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Viewport Actions buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <button 
          onClick={handleConfirm}
          disabled={isScanning}
          className={`flex-1 h-14 font-bold rounded-full flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-95 transition-all ${
            isScanning 
              ? 'bg-white/5 border border-white/10 text-on-surface-variant cursor-not-allowed'
              : 'bg-primary-container text-on-primary hover:brightness-110'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          Confirm Identity check
        </button>
        <button 
          onClick={handleRetry}
          className="flex-1 h-14 border-2 border-secondary-container text-secondary-container font-bold rounded-full hover:bg-secondary-container/10 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Retry Scanner
        </button>
      </div>

    </div>
  );
};
export default AgeVerificationScreen;
