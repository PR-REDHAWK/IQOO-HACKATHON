import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export const OtpVerificationScreen = () => {
  const { 
    setActiveScreen, 
    activeAlert, 
    displayPendingTransactions,
    otps,
    verifyOTP,
    updateTransactionStatus
  } = useContext(AppContext);

  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');

  const t = activeAlert || displayPendingTransactions[0];
  const storedOtp = t ? otps[t.id] || '123456' : '123456';

  const handleVerify = (e) => {
    e.preventDefault();
    if (!t) return;

    if (verifyOTP(otpInput, storedOtp)) {
      setError('');
      updateTransactionStatus(t.id, 'completed');
      setActiveScreen('success');
    } else {
      setError('Invalid OTP code. Please try again.');
      setOtpInput('');
    }
  };

  if (!t) return null;

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto flex flex-col items-center justify-center space-y-6 relative">
      
      {/* Simulated SMS Notification Banner */}
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-fade-in relative z-20">
        <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center border border-secondary-container/30 flex-shrink-0">
          <span className="material-symbols-outlined text-secondary-container text-[18px]">sms</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Simulated Parent SMS Alert</p>
          <p className="text-[12px] text-white leading-relaxed font-semibold mt-1">
            "SecurePlay Security Shield: Your OTP code for approving the <span className="text-secondary-container">{t.gameName}</span> purchase is <span className="text-primary-fixed-dim font-bold font-mono tracking-widest text-[14px] bg-white/5 px-2 py-0.5 rounded">{storedOtp}</span>."
          </p>
        </div>
        <span className="text-[9px] text-on-surface-variant font-mono">Just Now</span>
      </div>

      {/* Main Form Bento Card */}
      <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-full blur-2xl"></div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[26px]">
              vpn_key
            </span>
          </div>
          <h3 className="text-white font-extrabold text-xl tracking-tight">Enter Security OTP</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
            Input the 6-digit payment authorization code to release the transaction guard lock.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="0 0 0 0 0 0" 
              maxLength="6"
              value={otpInput}
              onChange={(e) => {
                setError('');
                setOtpInput(e.target.value.replace(/\D/g, '')); // only allow numbers
              }}
              className="w-full text-center bg-white/5 border border-white/10 rounded-2xl py-4 text-2xl font-extrabold font-mono tracking-[0.4em] text-white focus:outline-none focus:border-secondary-container focus:bg-white/[0.08] transition-all"
            />
            {error && (
              <p className="text-center text-xs text-error font-bold flex items-center justify-center gap-1.5 animate-bounce">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={otpInput.length !== 6}
            className={`w-full h-14 font-extrabold rounded-full transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
              otpInput.length === 6
                ? 'bg-primary-container text-on-primary hover:brightness-110 active:scale-95 shadow-[0_4px_20px_rgba(255,215,0,0.15)]'
                : 'bg-white/5 border border-white/10 text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Confirm & Complete Payment
          </button>
        </form>

        {/* Info panel */}
        <div className="border-t border-white/5 pt-4 flex items-center gap-2 text-[10px] text-on-surface-variant leading-relaxed opacity-60">
          <span className="material-symbols-outlined text-xs">lock</span>
          <span>End-to-end authorized verification secure protocol active.</span>
        </div>

      </div>

    </div>
  );
};

export default OtpVerificationScreen;
