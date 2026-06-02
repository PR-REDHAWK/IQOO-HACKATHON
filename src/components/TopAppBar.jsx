import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import logo from '../assets/logo.svg';

export const TopAppBar = () => {
  const {
    pendingTransactions,
    activeScreen,
    setActiveScreen,
    demoScenarios,
    activeScenarioId,
    switchScenario
  } = useContext(AppContext);
  const alertsCount = pendingTransactions.length;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 h-16 transition-all duration-300">
      <div className="flex justify-between items-center px-6 md:px-16 h-16 w-full max-w-[1280px] mx-auto">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveScreen('landing')}>
          <img src={logo} alt="SecurePlay Logo" className="w-8 h-8 object-contain" />
          <h1 className="font-headline-md text-[20px] font-extrabold tracking-tight text-primary-fixed-dim">
            SecurePlay
          </h1>
        </div>

        {/* Desktop Links (if screen is not landing) */}
        {activeScreen !== 'landing' && (
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveScreen('dashboard')}
              className={`font-label-sm text-[13px] tracking-widest uppercase transition-all duration-150 ${activeScreen === 'dashboard' ? 'text-primary-fixed-dim font-bold' : 'text-on-surface-variant hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveScreen('risk')}
              className={`font-label-sm text-[13px] tracking-widest uppercase transition-all duration-150 ${activeScreen === 'risk' ? 'text-primary-fixed-dim font-bold' : 'text-on-surface-variant hover:text-white'}`}
            >
              AI Risk Center
            </button>
            <button 
              onClick={() => setActiveScreen('analytics')}
              className={`font-label-sm text-[13px] tracking-widest uppercase transition-all duration-150 ${activeScreen === 'analytics' ? 'text-primary-fixed-dim font-bold' : 'text-on-surface-variant hover:text-white'}`}
            >
              Analytics
            </button>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {activeScreen !== 'landing' && (
            <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 sm:px-3 h-10 max-w-[150px] sm:max-w-none">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">
                tune
              </span>
              <select
                value={activeScenarioId}
                onChange={(event) => switchScenario(event.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface-variant focus:outline-none min-w-0"
                aria-label="Demo scenario"
              >
                {demoScenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id} className="bg-black text-white">
                    {scenario.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Notifications / Alerts Toggle */}
          <button 
            onClick={() => setActiveScreen('dashboard')} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-95 transition-all relative"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
              notifications
            </span>
            {alertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-error text-on-error font-bold text-[9px] flex items-center justify-center rounded-full border border-black animate-pulse">
                {alertsCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setActiveScreen('dashboard')}
            className="w-10 h-10 rounded-full border-2 border-primary-fixed-dim overflow-hidden active:scale-95 hover:brightness-110 cursor-pointer transition-all duration-150"
          >
            <img 
              alt="Parent Profile Avatar" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
export default TopAppBar;
