import { useCallback, useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { RiskMeter } from '../components/RiskMeter';
import { getAiMode } from '../services/geminiAdvisor';

export const ApprovalScreen = () => {
  const { 
    setActiveScreen, 
    activeAlert, 
    displayPendingTransactions,
    childProfiles, 
    updateTransactionStatus,
    aiAnalyses,
    fetchAiAnalysisForTransaction
  } = useContext(AppContext);

  const [voiceProgress, setVoiceProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const t = activeAlert || displayPendingTransactions[0];
  const child = t ? childProfiles[t.childId] || { name: t.childName } : null;

  useEffect(() => {
    let active = true;
    const loadAnalysis = async () => {
      if (!t) return;
      if (aiAnalyses[t.id]) {
        return;
      }
      
      setLoading(true);
      await fetchAiAnalysisForTransaction(t);
      if (active) {
        setLoading(false);
      }
    };
    
    loadAnalysis();
    
    return () => {
      active = false;
    };
  }, [t, aiAnalyses, fetchAiAnalysisForTransaction]);

  const handleApprove = useCallback(() => {
    if (!t) return;
    updateTransactionStatus(t.id, 'approved');
    setActiveScreen('face-verification');
  }, [updateTransactionStatus, setActiveScreen, t]);

  const handleReject = useCallback(() => {
    if (!t) return;
    updateTransactionStatus(t.id, 'rejected');
    setActiveScreen('dashboard');
  }, [updateTransactionStatus, setActiveScreen, t]);

  // Voice activation hold logic
  useEffect(() => {
    let timer;
    if (isHolding && t) {
      timer = setInterval(() => {
        setVoiceProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            handleApprove();
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
  }, [isHolding, t, handleApprove]);

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

            {/* AI Guardian Analysis Card */}
            {loading ? (
              <div className="bg-secondary-container/5 border border-dashed border-secondary-container/30 p-6 rounded-2xl space-y-4 animate-pulse relative overflow-hidden">
                {/* Cyber scanning line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-container to-transparent top-0 animate-bounce"></div>
                <div className="flex items-center gap-3 text-secondary-container">
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    progress_activity
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest font-mono">
                    AI Guardian is analyzing this transaction...
                  </span>
                </div>
                
                {/* Shimmer placeholders */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/5 rounded w-11/12 shimmer"></div>
                  <div className="h-4 bg-white/5 rounded w-10/12 shimmer"></div>
                  <div className="h-4 bg-white/5 rounded w-8/12 shimmer"></div>
                </div>
              </div>
            ) : (() => {
              const analysis = aiAnalyses[t.id] || { 
                summary: t.aiExplanation, 
                concerns: t.riskReasons || [], 
                recommendation: t.recommendation, 
                confidence: 90 
              };
              const { mode } = getAiMode();
              return (
                <div className="glass-card ai-glow border-secondary-container/20 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                  {/* Decorative background aura */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-secondary-container/5 rounded-full blur-2xl"></div>

                  {/* Card Header & Badge */}
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                      <h4 className="font-headline-md text-[15px] font-bold text-white tracking-tight">
                        AI Guardian Analysis
                      </h4>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      mode === 'live' ? 'bg-secondary-container/10 text-secondary-container border border-secondary-container/20' : 'bg-primary-fixed-dim/15 text-primary-fixed-dim border border-primary-fixed-dim/20'
                    }`}>
                      {mode === 'live' ? 'Live Gemini Active' : 'Local Guard Mode'}
                    </span>
                  </div>

                  {/* AI Summary Section */}
                  <div className="space-y-1">
                    <p className="text-[13px] text-on-surface leading-relaxed font-medium">
                      "{analysis.summary}"
                    </p>
                  </div>

                  {/* Concerns Bullet Points */}
                  <div className="space-y-2.5 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                    <h5 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      Key Concerns Detected
                    </h5>
                    <ul className="space-y-2">
                      {analysis.concerns && analysis.concerns.length > 0 ? (
                        analysis.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-white">
                            <span className="material-symbols-outlined text-[14px] text-error font-bold mt-0.5">
                              report
                            </span>
                            <span>{concern}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px] text-secondary-container">
                            check_circle
                          </span>
                          <span>No high-severity telemetry alerts flagged.</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Rec Action + Confidence Score */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">
                        Recommended Action
                      </span>
                      <span className="text-xs text-secondary-container font-extrabold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">shield</span>
                        {analysis.recommendation}
                      </span>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                          AI Confidence
                        </span>
                        <span className="text-[15px] text-white font-extrabold">
                          {analysis.confidence}%
                        </span>
                      </div>
                      {/* Circular mini gauge */}
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="transparent" />
                          <circle 
                            cx="16" cy="16" r="13" 
                            stroke={analysis.confidence >= 90 ? '#00eefc' : '#e9c400'} 
                            strokeWidth="2.5" fill="transparent" 
                            strokeDasharray={`${2 * Math.PI * 13}`}
                            strokeDashoffset={`${2 * Math.PI * 13 * (1 - (analysis.confidence || 90) / 100)}`}
                          />
                        </svg>
                        <span className="absolute text-[8px] font-bold text-on-surface-variant font-mono">
                          OK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Accordion: Why did AI decide this? */}
                  <div className="border-t border-white/5 pt-4">
                    <button 
                      onClick={() => setAccordionOpen(!accordionOpen)}
                      className="w-full flex justify-between items-center text-xs font-bold text-on-surface-variant hover:text-white uppercase tracking-wider active:scale-99 transition-all"
                    >
                      <span>Why did AI decide this?</span>
                      <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${accordionOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    
                    {accordionOpen && (
                      <div className="mt-3 p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          SecurePlay's Guardian network parsed the following risk signals and historical telemetry context to calculate decision scores:
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-white">
                          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] rounded-lg border border-white/5">
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">child_care</span>
                            <span>Child Age: {child?.age || 12} yrs</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] rounded-lg border border-white/5">
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">payments</span>
                            <span>Value: ${t.amount}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] rounded-lg border border-white/5">
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">update</span>
                            <span>Today Count: {child?.transactionsTodayCount || 0} reqs</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] rounded-lg border border-white/5">
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">query_stats</span>
                            <span>Weekly: ${child?.spending || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] rounded-lg border border-white/5 col-span-2">
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">storefront</span>
                            <span>Category: {t.category || 'In-App'}</span>
                          </div>

                          <div className="flex items-center gap-1.5 p-2 bg-white/[0.02] rounded-lg border border-white/5 col-span-2">
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">admin_panel_settings</span>
                            <span>Risk Engine: {t.riskScore}% ({t.riskLevel})</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

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
