import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import LandingScreen from './screens/LandingScreen';
import DashboardScreen from './screens/DashboardScreen';
import PurchaseDetectionScreen from './screens/PurchaseDetectionScreen';
import AgeVerificationScreen from './screens/AgeVerificationScreen';
import ApprovalScreen from './screens/ApprovalScreen';
import RiskAnalysisScreen from './screens/RiskAnalysisScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import FaceVerificationScreen from './screens/FaceVerificationScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';
import SuccessScreen from './screens/SuccessScreen';

const MainAppContent = () => {
  const { activeScreen } = useContext(AppContext);

  // Screen routing map
  const renderScreen = () => {
    switch (activeScreen) {
      case 'landing':
        return <LandingScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'purchase':
        return <PurchaseDetectionScreen />;
      case 'age':
        return <AgeVerificationScreen />;
      case 'approval':
        return <ApprovalScreen />;
      case 'risk':
        return <RiskAnalysisScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'face-verification':
        return <FaceVerificationScreen />;
      case 'otp-entry':
        return <OtpVerificationScreen />;
      case 'success':
        return <SuccessScreen />;
      default:
        return <LandingScreen />;
    }
  };

  const showNavbar = activeScreen !== 'landing' && 
                     activeScreen !== 'face-verification' && 
                     activeScreen !== 'otp-entry' && 
                     activeScreen !== 'success';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <TopAppBar />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {renderScreen()}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      {showNavbar && <BottomNavBar />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
