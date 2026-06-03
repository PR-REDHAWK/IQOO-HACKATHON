import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { verifyParentFace } from '../utils/verification';

export const FaceVerificationScreen = () => {
  const { 
    setActiveScreen, 
    activeAlert, 
    displayPendingTransactions,
    childProfiles,
    updateTransactionStatus,
    setOtps,
    generateOTP
  } = useContext(AppContext);

  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [confidence, setConfidence] = useState('--');

  const t = activeAlert || displayPendingTransactions[0];
  const child = t ? childProfiles[t.childId] || { name: t.childName } : null;

  useEffect(() => {
    if (!isScanning) return;
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          handleVerificationSuccess();
          return 100;
        }
        return prev + Math.floor(Math.random() * 8 + 6);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleVerificationSuccess = async () => {
    const res = await verifyParentFace();
    if (res.success && t) {
      setConfidence(res.confidence.toFixed(1));
      const otp = generateOTP();
      setOtps(prev => ({ ...prev, [t.id]: otp }));
      
      // Update status to 'otp_pending' and navigate
      setTimeout(() => {
        updateTransactionStatus(t.id, 'otp_pending');
        setActiveScreen('otp-entry');
      }, 1500); // 1.5 seconds delay to let parent see success
    }
  };

  if (!t) return null;

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto flex flex-col items-center justify-center">
      
      {/* Title */}
      <div className="text-center mb-6 space-y-1.5 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-amber-500 font-bold">
            Secure Parent Authentication
          </span>
        </div>
        <h2 className="font-headline-xl text-[24px] md:text-[32px] font-extrabold text-white tracking-tight">
          Parent Face Verification
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Verifying guardian credentials prior to transaction authorization.
        </p>
      </div>

      {/* Gold/Amber Camera viewport Bento Card */}
      <div className="relative w-full max-w-lg aspect-[4/5] bg-surface-container-low rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.05)]">
        
        {/* Grayscale camera picture placeholder */}
        <img 
          alt="Camera viewport simulation of parent" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4] transition-all"
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
        />

        {/* Scan HUD Overlay details */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none z-10">
          
          {/* Top telemetry bar */}
          <div className="flex justify-between items-start">
            <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full bg-amber-500 ${isScanning ? 'glow-pulse' : ''}`}></div>
              <span className="font-label-sm text-[9px] uppercase tracking-widest text-amber-500 font-bold">
                {isScanning ? 'Parent Biometrics Scanning' : 'Authentication Successful'}
              </span>
            </div>
            <div className="text-right text-[9px] text-amber-500/80 font-mono uppercase tracking-wider leading-relaxed">
              MODEL: PARENT-GUARD-V3<br />
              CONFIDENCE MATCH: {confidence}%
            </div>
          </div>

          {/* HUD Target brackets */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56">
            <div className="hud-corner top-0 left-0 border-t-2 border-l-2 border-amber-500/50"></div>
            <div className="hud-corner top-0 right-0 border-t-2 border-r-2 border-amber-500/50"></div>
            <div className="hud-corner bottom-0 left-0 border-b-2 border-l-2 border-amber-500/50"></div>
            <div className="hud-corner bottom-0 right-0 border-b-2 border-r-2 border-amber-500/50"></div>
            
            {/* Scan animation line */}
            {isScanning && <div className="scan-line bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}

            {/* Simulated landmark facial vectors overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <svg className="w-full h-full text-amber-500" viewBox="0 0 100 100">
                <circle cx="35" cy="40" r="1.2" fill="currentColor" />
                <circle cx="65" cy="40" r="1.2" fill="currentColor" />
                <circle cx="50" cy="52" r="1.2" fill="currentColor" />
                <path d="M 36 68 Q 50 78 64 68" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Floating Diagnostic boxes */}
          <div className="absolute right-4 top-16 space-y-2">
            <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/5 text-right transition-all">
              <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Guardian Match</p>
              <p className="font-headline-md text-[18px] font-bold text-amber-500">Verified</p>
            </div>
          </div>

          {/* Bottom progress bar elements */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Success badge */}
            {!isScanning && (
              <div className="self-start inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl backdrop-blur-xl animate-fade-in">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">
                  check_circle
                </span>
                <div>
                  <p className="text-[9px] text-amber-500 uppercase font-extrabold tracking-wider leading-none">Identity Verified</p>
                  <p className="text-[11px] text-white font-medium mt-0.5 leading-none">Generating OTP Verification code...</p>
                </div>
              </div>
            )}

            {/* Scan Progress Bar */}
            <div className="w-full space-y-1">
              <div className="flex justify-between items-end font-label-sm text-[10px] text-on-surface-variant font-semibold">
                <span className={isScanning ? 'animate-pulse text-amber-500' : 'text-white'}>
                  {isScanning ? 'Mapping facial landmarks...' : 'Verification complete'}
                </span>
                <span>{scanProgress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>
      
      <p className="mt-6 text-[11px] text-on-surface-variant max-w-xs text-center opacity-60">
        AI facial check simulates parent verification check to prevent child bypass attempts.
      </p>

    </div>
  );
};

export default FaceVerificationScreen;
