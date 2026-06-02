import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const BottomNavBar = () => {
  const { activeScreen, setActiveScreen, pendingTransactions } = useContext(AppContext);
  const alertsCount = pendingTransactions.length;

  const tabs = [
    { id: 'dashboard', label: 'Protect', icon: 'shield' },
    { id: 'risk', label: 'AI Risk', icon: 'psychology' },
    { id: 'purchase', label: 'AI Scan', icon: 'center_focus_strong', isScan: true },
    { id: 'analytics', label: 'Analytics', icon: 'receipt_long' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0e0e0e]/95 backdrop-blur-xl border-t border-white/5 shadow-2xl rounded-t-2xl pb-safe">
      <div className="flex justify-around items-center h-20 px-2 max-w-[640px] mx-auto relative">
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id || 
            (tab.id === 'purchase' && (activeScreen === 'purchase' || activeScreen === 'age' || activeScreen === 'approval'));
          
          if (tab.isScan) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScreen('purchase')}
                className={`flex flex-col items-center justify-center -translate-y-3 w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl shadow-[0_0_20px_rgba(0,238,252,0.4)] active:scale-90 transition-all duration-200`}
              >
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {tab.icon}
                </span>
                <span className="font-label-sm text-[10px] tracking-tight mt-0.5 font-bold">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id === 'settings' ? 'dashboard' : tab.id)} // settings page can link/tab or show toggle settings modal
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl active:scale-95 transition-all duration-150 relative ${
                isActive ? 'text-primary-fixed-dim' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {tab.icon}
              </span>
              <span className="font-label-sm text-[10px] tracking-widest mt-1 uppercase font-semibold">
                {tab.label}
              </span>
              
              {/* Alert Badge on tab */}
              {tab.id === 'dashboard' && alertsCount > 0 && (
                <span className="absolute top-2 right-4 w-2 h-2 bg-error rounded-full animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNavBar;
