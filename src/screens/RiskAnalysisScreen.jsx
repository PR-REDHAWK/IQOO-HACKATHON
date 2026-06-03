import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { RiskMeter } from '../components/RiskMeter';

export const RiskAnalysisScreen = () => {
  const { activeAlert, displayPendingTransactions, childProfiles } = useContext(AppContext);
  const pendingTransactions = displayPendingTransactions;
  const getDefaultTransactionId = () => {
    const activeAlertIsPending = pendingTransactions.some((transaction) => transaction.id === activeAlert?.id);
    return String(activeAlertIsPending ? activeAlert.id : pendingTransactions[0]?.id || '');
  };
  const [selectedTxId, setSelectedTxId] = useState(getDefaultTransactionId);

  useEffect(() => {
    setSelectedTxId(getDefaultTransactionId());
  }, [activeAlert, pendingTransactions]);

  const activeTx = pendingTransactions.find(t => String(t.id) === String(selectedTxId)) || pendingTransactions[0];

  if (!activeTx) {
    return (
      <div className="min-h-screen bg-black text-[#e2e2e2] pt-24 px-6 text-center space-y-4">
        <span className="material-symbols-outlined text-[64px] text-secondary-container animate-pulse">
          verified
        </span>
        <h3 className="font-headline-md text-[20px] font-bold text-white">Risk Core Settled</h3>
        <p className="text-on-surface-variant max-w-xs mx-auto text-xs">
          No pending transactions require risk telemetry. All accounts are within parameters.
        </p>
      </div>
    );
  }

  const child = childProfiles[activeTx.childId] || { name: activeTx.childName, age: '--', avgSpending: 0 };
  const formatCurrency = (value) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const estimatedAge = typeof child.age === 'number'
    ? (child.age + Math.min(0.8, Math.max(0.1, activeTx.riskScore / 250))).toFixed(1)
    : child.age;

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-20 pb-28 px-4 md:px-16 max-w-[1280px] mx-auto space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
        <div>
          <h2 className="font-headline-lg text-[22px] md:text-[28px] font-bold text-white tracking-tight">
            AI Risk Center
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time behavioral telemetry, threat modeling, and activity maps.
          </p>
        </div>

        {/* Transaction selector dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider whitespace-nowrap">
            Analyzing:
          </span>
          <select
            value={String(selectedTxId)}
            onChange={(e) => setSelectedTxId(e.target.value)}
            className="flex-1 md:flex-initial bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-secondary-container font-semibold"
          >
            {pendingTransactions.map(t => (
              <option key={t.id} value={t.id} className="bg-black text-white">
                {(childProfiles[t.childId] || { name: t.childName }).name}: {t.gameName} (${formatCurrency(t.amount)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Telemetry Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Dial & Explanation (span-7) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/5 space-y-6">
          <h3 className="font-headline-md text-[16px] font-bold text-white tracking-tight uppercase tracking-wider text-on-surface-variant">
            Threat Coefficient
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-around py-4">
            <RiskMeter score={activeTx.riskScore} size="large" />

            {/* Sub-Risk details list */}
            <div className="space-y-4 w-full sm:w-56">
              {[
                { name: 'Age Appropriate', score: activeTx.riskMetrics?.ageRisk || 0, icon: 'face' },
                { name: 'Amount Factor', score: activeTx.riskMetrics?.amountRisk || 0, icon: 'payments' },
                { name: 'Transaction Frequency', score: activeTx.riskMetrics?.frequencyRisk || 0, icon: 'speed' },
                { name: 'Launch Window', score: activeTx.riskMetrics?.timeRisk || 0, icon: 'schedule' },
                { name: 'Category Risk', score: activeTx.riskMetrics?.categoryRisk || 0, icon: 'category' }
              ].map((risk, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className={`material-symbols-outlined text-[20px] ${
                    risk.score >= 70 ? 'text-error' : risk.score >= 40 ? 'text-primary-fixed-dim' : 'text-secondary-container'
                  }`}>
                    {risk.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase leading-none">{risk.name}</p>
                    <p className="text-[12px] text-white font-extrabold mt-1 leading-none">{risk.score}% Risk</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed AI natural language explanation */}
          <div className="bg-secondary-container/5 border border-secondary-container/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-1.5 text-secondary-container text-xs font-bold uppercase tracking-wider relative z-10">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Risk Evaluation Breakdown
            </div>
            <ul className="list-disc pl-5 text-[13px] text-white space-y-1 relative z-10">
              {activeTx.riskReasons?.map((reason, idx) => (
                <li key={idx} className="leading-relaxed">{reason}</li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-secondary-container/20 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                 <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">Recommended Action</p>
                 <p className="text-secondary-container font-extrabold text-sm">{activeTx.recommendation}</p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-secondary-container text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                 {activeTx.riskLevel} Risk
              </div>
            </div>
          </div>
        </div>

        {/* Right Telemetry Details (span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Behavior profiling card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-headline-md text-[16px] font-bold text-white tracking-tight">
              Behavior Analysis
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5 py-3 border-b border-white/5">
                <span className="material-symbols-outlined text-secondary-container mt-0.5">devices</span>
                <div>
                  <h4 className="text-white font-bold">Device Footprint</h4>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Authorized device: {activeTx.device}. Verified signature match.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-3 border-b border-white/5">
                <span className="material-symbols-outlined text-primary-fixed-dim mt-0.5">payments</span>
                <div>
                  <h4 className="text-white font-bold">Spending Anomaly</h4>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    This purchase is {activeTx.ratios?.amountRatio}x larger than {child.name}'s average expenditure (${formatCurrency(child.avgSpending)}).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-3">
                <span className="material-symbols-outlined text-error mt-0.5">schedule</span>
                <div>
                  <h4 className="text-white font-bold">Temporal Check</h4>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Transaction was initiated at {activeTx.time}, deviating from sleep hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Neural Engine Diagnostic Card */}
          <div className="glass-card premium-border rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
              Neural Guard telemetry
            </h4>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Biometric check estimated child age at <span className="text-white font-bold">{estimatedAge} yrs</span>, matching {child.name}'s profile age ({child.age}). Request intercepted due to ESRB rating check (Game Rated {activeTx.ageRating} vs Child Age {child.age}).
            </p>
            <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-[11px] text-on-surface-variant font-mono">
              <span>MODEL: G-1.5-FLASH</span>
              <span>VERIFIED: SHA-256</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default RiskAnalysisScreen;
