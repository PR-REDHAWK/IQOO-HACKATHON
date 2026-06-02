import React, { createContext, useState, useEffect } from 'react';
import { calculateRiskScore, generateAIExplanation } from '../utils/riskEngine';

export const AppContext = createContext();

const initialTransactions = [
  {
    id: 'leo-genshin-1',
    childId: 'leo',
    gameName: 'Genshin Impact',
    itemName: '6,480 Genesis Crystals',
    amount: 99.99,
    time: '2:14 AM',
    date: 'Today',
    ageRating: 'T', // Rated 13+ (Leo is 12)
    category: 'In-App',
    device: "Leo's iPad Pro",
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'leo-fortnite-1',
    childId: 'leo',
    gameName: 'Fortnite',
    itemName: '1,000 V-Bucks Pack',
    amount: 9.99,
    time: '4:15 PM',
    date: 'Today',
    ageRating: 'T', // Rated 13+ (Leo is 12)
    category: 'Gaming',
    device: "Leo's iPad Pro",
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'maya-streamapp-1',
    childId: 'maya',
    gameName: 'StreamApp',
    itemName: 'Monthly Premium Sub',
    amount: 9.99,
    time: '6:30 PM',
    date: 'Yesterday',
    ageRating: 'E',
    category: 'Subscriptions',
    device: "Maya's iPhone 13",
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=150&auto=format&fit=crop&q=80',
  }
];

export const AppProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState('landing');
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('secureplay_gemini_api_key') || '');
  const [totalProtectedAmount, setTotalProtectedAmount] = useState(1240.50);
  const [monthlySavings, setMonthlySavings] = useState(142.00);
  const [blockedCount, setBlockedCount] = useState(12);

  const [childProfiles, setChildProfiles] = useState({
    leo: {
      name: 'Leo',
      age: 12,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      spending: 182,
      limit: 200,
      avgSpending: 12.00,
      transactionsTodayCount: 2
    },
    maya: {
      name: 'Maya',
      age: 10,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      spending: 45,
      limit: 150,
      avgSpending: 9.99,
      transactionsTodayCount: 1
    }
  });

  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [historyTransactions, setHistoryTransactions] = useState([
    {
      id: 'robux-past',
      childId: 'leo',
      gameName: 'Roblox',
      itemName: 'Robux Bundle',
      amount: 4.99,
      time: 'Yesterday, 5:12 PM',
      ageRating: 'E10+',
      category: 'In-App',
      status: 'VERIFIED',
      score: 15
    },
    {
      id: 'appstore-past',
      childId: 'maya',
      gameName: 'App Store',
      itemName: 'Learning App Subscription',
      amount: 1.99,
      time: 'Oct 24, 10:00 AM',
      ageRating: 'E',
      category: 'Subscriptions',
      status: 'VERIFIED',
      score: 8
    }
  ]);

  const [activeAlert, setActiveAlert] = useState(null);
  const [interceptedPurchase, setInterceptedPurchase] = useState(null);

  // Initialize and calculate risks for pending transactions
  useEffect(() => {
    const processInitial = async () => {
      const enriched = await Promise.all(
        initialTransactions.map(async (t) => {
          const profile = childProfiles[t.childId];
          const riskDetails = calculateRiskScore(t, profile);
          const explanation = await generateAIExplanation(t, profile, geminiApiKey);
          return {
            ...t,
            riskScore: riskDetails.score,
            riskMetrics: riskDetails.metrics,
            ratios: riskDetails.ratios,
            aiExplanation: explanation
          };
        })
      );
      setPendingTransactions(enriched);
      // Default active alert to the highest risk one (Genshin crystal purchase)
      const genshin = enriched.find(e => e.id === 'leo-genshin-1');
      if (genshin) {
        setActiveAlert(genshin);
      }
      
      // Default intercepted purchase for Purchase Detection screen
      const fortnite = enriched.find(e => e.id === 'leo-fortnite-1');
      if (fortnite) {
        setInterceptedPurchase(fortnite);
      }
    };
    processInitial();
  }, [geminiApiKey]);

  // Approve a transaction
  const approveTransaction = (id) => {
    const t = pendingTransactions.find(item => item.id === id);
    if (!t) return;

    // Remove from pending
    setPendingTransactions(prev => prev.filter(item => item.id !== id));
    
    // Add to history
    setHistoryTransactions(prev => [
      { ...t, status: 'APPROVED', time: 'Just Now' },
      ...prev
    ]);

    // Update child profile spending
    setChildProfiles(prev => {
      const profile = prev[t.childId];
      return {
        ...prev,
        [t.childId]: {
          ...profile,
          spending: Math.min(profile.limit, profile.spending + Math.round(t.amount))
        }
      };
    });

    // Update totals
    setTotalProtectedAmount(prev => prev + t.amount);

    // If it was the active alert, set another or clear
    if (activeAlert?.id === id) {
      setActiveAlert(null);
    }
  };

  // Decline/Block a transaction
  const declineTransaction = (id) => {
    const t = pendingTransactions.find(item => item.id === id);
    if (!t) return;

    // Remove from pending
    setPendingTransactions(prev => prev.filter(item => item.id !== id));

    // Add to history
    setHistoryTransactions(prev => [
      { ...t, status: 'BLOCKED', time: 'Just Now' },
      ...prev
    ]);

    // Increase counters
    setBlockedCount(prev => prev + 1);
    setMonthlySavings(prev => prev + t.amount);
    setTotalProtectedAmount(prev => prev + t.amount);

    if (activeAlert?.id === id) {
      setActiveAlert(null);
    }
  };

  const saveGeminiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('secureplay_gemini_api_key', key);
  };

  const resetDemo = () => {
    localStorage.removeItem('secureplay_gemini_api_key');
    setGeminiApiKey('');
    setTotalProtectedAmount(1240.50);
    setMonthlySavings(142.00);
    setBlockedCount(12);
    // Reload original states
    const processInitial = async () => {
      const enriched = await Promise.all(
        initialTransactions.map(async (t) => {
          const profile = childProfiles[t.childId];
          const riskDetails = calculateRiskScore(t, profile);
          const explanation = await generateAIExplanation(t, profile, '');
          return {
            ...t,
            riskScore: riskDetails.score,
            riskMetrics: riskDetails.metrics,
            ratios: riskDetails.ratios,
            aiExplanation: explanation
          };
        })
      );
      setPendingTransactions(enriched);
      setActiveAlert(enriched.find(e => e.id === 'leo-genshin-1'));
      setInterceptedPurchase(enriched.find(e => e.id === 'leo-fortnite-1'));
    };
    processInitial();
  };

  return (
    <AppContext.Provider value={{
      activeScreen,
      setActiveScreen,
      geminiApiKey,
      saveGeminiKey,
      totalProtectedAmount,
      monthlySavings,
      blockedCount,
      childProfiles,
      pendingTransactions,
      historyTransactions,
      activeAlert,
      setActiveAlert,
      interceptedPurchase,
      setInterceptedPurchase,
      approveTransaction,
      declineTransaction,
      resetDemo
    }}>
      {children}
    </AppContext.Provider>
  );
};
