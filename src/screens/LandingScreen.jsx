import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const LandingScreen = () => {
  const { setActiveScreen, totalProtectedAmount } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] pt-24 pb-28 px-6 md:px-16 max-w-[1280px] mx-auto space-y-12">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/10 border border-secondary-container/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
            <span className="font-label-sm text-[11px] uppercase tracking-widest text-secondary-container font-semibold">
              Vanguard-4 active parental guard
            </span>
          </div>
          <h1 className="font-headline-xl text-[38px] md:text-[56px] font-extrabold tracking-tight text-white leading-tight">
            AI-Powered <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary-container">
              Gaming Guard
            </span>
          </h1>
          <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Protect your family's finances from rogue in-game transactions. Real-time behavior analysis, AI face scans, and instant approval triggers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
            <button 
              onClick={() => setActiveScreen('dashboard')}
              className="px-8 py-4 bg-primary-container text-on-primary font-bold rounded-full hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,215,0,0.2)]"
            >
              Parent Dashboard
            </button>
            <button 
              onClick={() => setActiveScreen('purchase')}
              className="px-8 py-4 bg-transparent border-2 border-secondary-container text-secondary-container font-bold rounded-full hover:bg-secondary-container/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Test Scan Trigger
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Visual Shield */}
        <div className="lg:col-span-5 flex justify-center relative py-8">
          <div className="absolute w-64 h-64 bg-secondary-container/10 rounded-full blur-[80px] ai-glow-effect"></div>
          
          <div className="relative w-72 h-72 md:w-80 md:h-80 glass-card rounded-3xl flex items-center justify-center p-8 border border-white/10 hover:border-secondary-container/40 transition-all duration-500 shadow-2xl">
            {/* Concentric rings */}
            <div className="absolute inset-4 border border-secondary-container/15 rounded-full animate-pulse"></div>
            <div className="absolute inset-10 border border-primary-container/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            <div className="z-10 flex flex-col items-center">
              <span className="material-symbols-outlined text-[100px] text-secondary-container drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-bounce" style={{ fontVariationSettings: "'FILL' 1", animationDuration: '3s' }}>
                shield
              </span>
              <div className="mt-4 bg-black/60 px-4 py-2 rounded-xl border border-white/5 text-center backdrop-blur-md">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Intercepted Protection</p>
                <p className="text-[14px] text-primary-fixed-dim font-extrabold mt-0.5">${totalProtectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} Saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { label: 'Active Security Layers', value: 'Vanguard-4' },
          { label: 'Families Protected', value: '45,000+' },
          { label: 'Average Risk Score Delta', value: '-85.4%' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 text-center border border-white/5 hover:bg-white/[0.02] transition-all">
            <p className="font-label-sm text-[11px] uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
            <p className="font-headline-lg text-[28px] font-extrabold text-primary-fixed-dim mt-2 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Bento Grid Feature Layout */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-[24px] font-bold text-white tracking-tight">Smart Protection Bento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card premium-border rounded-3xl p-8 md:col-span-2 flex flex-col justify-between min-h-[220px] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container/10 flex items-center justify-center mb-4 border border-secondary-container/20">
                <span className="material-symbols-outlined text-secondary-container">psychology</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-white mb-2">Multidimensional AI Risk Engine</h3>
              <p className="text-on-surface-variant text-[14px] leading-relaxed max-w-lg">
                Calculates risk scores instantly based on Age restrictions, Time-of-day, purchase Frequency, and Amount ratios. Provides natural language warnings so parents know why a purchase is risky.
              </p>
            </div>
            <button 
              onClick={() => setActiveScreen('dashboard')} 
              className="mt-6 text-primary-fixed-dim hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1 self-start group transition-all"
            >
              Launch Platform
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[220px] border border-white/5 hover:border-secondary-container/30 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container/10 flex items-center justify-center mb-4 border border-secondary-container/20">
                <span className="material-symbols-outlined text-secondary-container">center_focus_strong</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-white mb-2">Biometric Scan</h3>
              <p className="text-on-surface-variant text-[14px] leading-relaxed">
                Flags potential minor attempts via scanning parameters, ensuring age-appropriateness.
              </p>
            </div>
            <button 
              onClick={() => setActiveScreen('purchase')} 
              className="mt-6 text-secondary-container hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1 self-start group transition-all"
            >
              Verify Now
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-on-surface-variant text-[12px] gap-4 opacity-60">
        <p>© 2026 SecurePlay AI. Bank-grade family encryption protection.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Security Standards</span>
          <span className="hover:text-white cursor-pointer">Privacy Vault</span>
        </div>
      </footer>
    </div>
  );
};
export default LandingScreen;
