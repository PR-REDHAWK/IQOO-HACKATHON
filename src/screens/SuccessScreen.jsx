import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const SuccessScreen = () => {
  const { 
    setActiveScreen, 
    activeAlert, 
    displayPendingTransactions,
    historyTransactions
  } = useContext(AppContext);

  // Since completed transactions are moved to history, we lookup the completed transaction from the history transactions.
  // We can look up the transaction by matching id.
  const activeTxId = activeAlert?.id || (displayPendingTransactions[0] ? displayPendingTransactions[0].id : null);
  const t = historyTransactions.find((item) => String(item.id) === String(activeTxId)) || historyTransactions[0];

  if (!t) {
    return (
      <div className="min-h-screen bg-black text-[#e2e2e2] pt-24 px-6 text-center space-y-4 flex flex-col justify-center items-center">
        <p className="text-on-surface-variant">No transaction data available.</p>
        <button 
          onClick={() => setActiveScreen('dashboard')}
          className="px-6 py-2 bg-primary-container text-on-primary rounded-full font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formatCurrency = (value) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto flex flex-col justify-center items-center space-y-8">
      
      {/* Visual Shield Success Circle */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Animated pulsating circles */}
        <div className="absolute inset-0 bg-secondary-container/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-4 bg-secondary-container/5 rounded-full animate-pulse"></div>
        <div className="absolute inset-8 border border-secondary-container/20 rounded-full"></div>
        
        <div className="z-10 w-20 h-20 rounded-full bg-secondary-container/10 border-2 border-secondary-container flex items-center justify-center shadow-[0_0_30px_rgba(0,238,252,0.3)]">
          <span className="material-symbols-outlined text-[48px] text-secondary-container drop-shadow-[0_0_10px_rgba(0,238,252,0.4)] animate-bounce" style={{ fontVariationSettings: "'FILL' 1", animationDuration: '2.5s' }}>
            check_circle
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5 max-w-sm">
        <h2 className="font-headline-xl text-[24px] md:text-[28px] font-extrabold text-white tracking-tight">
          Payment Completed
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          The transaction guard has released the locks and authorized the payment successfully.
        </p>
      </div>

      {/* Summary card */}
      <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/5 rounded-full blur-2xl"></div>

        {/* Details list */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
            <span className="text-on-surface-variant text-[9px] uppercase font-bold block mb-1">Game Merchant</span>
            <span className="text-white font-extrabold text-[13px]">{t.gameName}</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
            <span className="text-on-surface-variant text-[9px] uppercase font-bold block mb-1">Amount Released</span>
            <span className="text-primary-fixed-dim font-extrabold text-[13px]">${formatCurrency(t.amount)}</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
            <span className="text-on-surface-variant text-[9px] uppercase font-bold block mb-1">Purchased Item</span>
            <span className="text-white font-semibold truncate block">{t.itemName}</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
            <span className="text-on-surface-variant text-[9px] uppercase font-bold block mb-1">Security Rating</span>
            <span className="text-secondary-container font-extrabold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">shield</span>
              SAFE PASS
            </span>
          </div>
        </div>

        {/* Audit timeline trail */}
        <div className="space-y-4 border-t border-white/5 pt-5">
          <h4 className="text-[10px] text-white uppercase font-extrabold tracking-widest flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-secondary-container">receipt_long</span>
            Transaction Audit Trail
          </h4>
          
          <div className="relative pl-6 border-l border-white/10 space-y-4">
            
            {/* Created */}
            <div className="relative">
              <div className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-white/10 border-2 border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full"></div>
              </div>
              <p className="text-[11px] text-white font-bold leading-none">Checkout Request Initialized</p>
              <p className="text-[9px] text-on-surface-variant mt-1 leading-none">Timestamp: {t.createdAt || t.time}</p>
            </div>

            {/* Approved */}
            {t.approvedAt && (
              <div className="relative">
                <div className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-primary-fixed-dim/20 border-2 border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full"></div>
                </div>
                <p className="text-[11px] text-white font-bold leading-none">Parent Approved</p>
                <p className="text-[9px] text-on-surface-variant mt-1 leading-none">Timestamp: {t.approvedAt}</p>
              </div>
            )}

            {/* Face verification */}
            {t.faceVerifiedAt && (
              <div className="relative">
                <div className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                </div>
                <p className="text-[11px] text-white font-bold leading-none">Biometric Guard Checked (Face Scan Passed)</p>
                <p className="text-[9px] text-on-surface-variant mt-1 leading-none">Timestamp: {t.faceVerifiedAt}</p>
              </div>
            )}

            {/* Completed */}
            <div className="relative">
              <div className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-secondary-container/20 border-2 border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-secondary-container rounded-full"></div>
              </div>
              <p className="text-[11px] text-white font-bold leading-none">OTP Verified & Funds Released</p>
              <p className="text-[9px] text-on-surface-variant mt-1 leading-none">Timestamp: {t.completedAt || 'Just Now'}</p>
            </div>

          </div>
        </div>
      </div>

      {/* Button to dashboard */}
      <button 
        onClick={() => setActiveScreen('dashboard')}
        className="px-10 py-4 bg-primary-container text-on-primary font-bold rounded-full hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(255,215,0,0.15)]"
      >
        Return to Portal
      </button>

    </div>
  );
};

export default SuccessScreen;
