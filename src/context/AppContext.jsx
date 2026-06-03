import { createContext, useMemo, useState } from 'react';
import { calculateRisk } from '../utils/riskEngine';
import { generateOTP, verifyOTP } from '../utils/verification';
import { generateTransactionAnalysis } from '../services/geminiAdvisor';

export const AppContext = createContext();

const demoScenarios = [
  {
    id: 'weekend-spike',
    label: 'Weekend Spike',
    description: 'High-risk gaming purchases clustered around Leo.',
    childProfiles: {
      leo: {
        name: 'Leo',
        age: 12,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        spending: 4999,
        limit: 8000,
        avgSpending: 1199,
        transactionsTodayCount: 3
      },
      maya: {
        name: 'Maya',
        age: 10,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        spending: 799,
        limit: 4000,
        avgSpending: 499,
        transactionsTodayCount: 1
      }
    },
    pendingTransactions: [
      {
        id: 1,
        childName: 'Leo',
        game: 'Roblox',
        itemName: '10,000 Robux Bundle',
        amount: 4999,
        riskScore: 91,
        status: 'pending',
        category: 'In-App Upgrades',
        device: "Leo's iPad Pro",
        time: '10:42 PM',
        date: 'Today',
        day: 'Sun',
        ageRating: 'E10+'
      },
      {
        id: 2,
        childName: 'Maya',
        game: 'Minecraft',
        itemName: 'Marketplace Texture Pack',
        amount: 799,
        riskScore: 42,
        status: 'pending',
        category: 'Cosmetics',
        device: "Maya's iPhone 13",
        time: '5:18 PM',
        date: 'Today',
        day: 'Sun',
        ageRating: 'E10+'
      }
    ],
    historyTransactions: [
      {
        id: 'weekend-1',
        childName: 'Leo',
        game: 'Fortnite',
        itemName: 'V-Bucks Pack',
        amount: 1999,
        riskScore: 82,
        category: 'In-App Upgrades',
        status: 'BLOCKED',
        time: 'Sat, 9:34 PM',
        day: 'Sat'
      },
      {
        id: 'weekend-2',
        childName: 'Leo',
        game: 'Genshin Impact',
        itemName: 'Genesis Crystals',
        amount: 2999,
        riskScore: 88,
        category: 'In-App Upgrades',
        status: 'BLOCKED',
        time: 'Fri, 11:08 PM',
        day: 'Fri'
      },
      {
        id: 'weekend-3',
        childName: 'Maya',
        game: 'Duolingo',
        itemName: 'Super Monthly',
        amount: 499,
        riskScore: 18,
        category: 'Subscriptions',
        status: 'APPROVED',
        time: 'Thu, 4:20 PM',
        day: 'Thu'
      }
    ]
  },
  {
    id: 'subscription-watch',
    label: 'Subscription Watch',
    description: 'Recurring subscriptions and trial conversions need review.',
    childProfiles: {
      leo: {
        name: 'Leo',
        age: 12,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        spending: 1299,
        limit: 6000,
        avgSpending: 699,
        transactionsTodayCount: 1
      },
      maya: {
        name: 'Maya',
        age: 10,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        spending: 3197,
        limit: 4500,
        avgSpending: 999,
        transactionsTodayCount: 3
      }
    },
    pendingTransactions: [
      {
        id: 10,
        childName: 'Maya',
        game: 'YouTube Kids',
        itemName: 'Premium Family Trial Conversion',
        amount: 1299,
        riskScore: 73,
        status: 'pending',
        category: 'Subscriptions',
        device: "Maya's iPhone 13",
        time: '7:05 PM',
        date: 'Today',
        day: 'Tue',
        ageRating: 'E'
      },
      {
        id: 11,
        childName: 'Leo',
        game: 'Xbox Game Pass',
        itemName: 'Monthly Renewal',
        amount: 799,
        riskScore: 58,
        status: 'pending',
        category: 'Subscriptions',
        device: "Leo's Laptop",
        time: '6:45 PM',
        date: 'Today',
        day: 'Tue',
        ageRating: 'T'
      }
    ],
    historyTransactions: [
      {
        id: 'sub-1',
        childName: 'Maya',
        game: 'Spotify',
        itemName: 'Premium Individual',
        amount: 1199,
        riskScore: 66,
        category: 'Subscriptions',
        status: 'BLOCKED',
        time: 'Mon, 8:15 PM',
        day: 'Mon'
      },
      {
        id: 'sub-2',
        childName: 'Maya',
        game: 'Canva',
        itemName: 'Pro Trial Renewal',
        amount: 1499,
        riskScore: 71,
        category: 'Subscriptions',
        status: 'BLOCKED',
        time: 'Sun, 6:02 PM',
        day: 'Sun'
      },
      {
        id: 'sub-3',
        childName: 'Leo',
        game: 'Roblox',
        itemName: 'Premium 450',
        amount: 499,
        riskScore: 34,
        category: 'Subscriptions',
        status: 'APPROVED',
        time: 'Fri, 5:45 PM',
        day: 'Fri'
      }
    ]
  },
  {
    id: 'low-risk-day',
    label: 'Low-Risk Day',
    description: 'Mostly routine purchases with one small approval pending.',
    childProfiles: {
      leo: {
        name: 'Leo',
        age: 12,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        spending: 899,
        limit: 6000,
        avgSpending: 499,
        transactionsTodayCount: 1
      },
      maya: {
        name: 'Maya',
        age: 10,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        spending: 299,
        limit: 3500,
        avgSpending: 299,
        transactionsTodayCount: 1
      }
    },
    pendingTransactions: [
      {
        id: 20,
        childName: 'Leo',
        game: 'Roblox',
        itemName: 'Small Robux Pack',
        amount: 299,
        riskScore: 24,
        status: 'pending',
        category: 'In-App Upgrades',
        device: "Leo's iPad Pro",
        time: '4:12 PM',
        date: 'Today',
        day: 'Wed',
        ageRating: 'E10+'
      }
    ],
    historyTransactions: [
      {
        id: 'low-1',
        childName: 'Maya',
        game: 'Monument Valley',
        itemName: 'Puzzle Pack',
        amount: 299,
        riskScore: 12,
        category: 'Game Content',
        status: 'APPROVED',
        time: 'Tue, 4:30 PM',
        day: 'Tue'
      },
      {
        id: 'low-2',
        childName: 'Leo',
        game: 'Minecraft',
        itemName: 'Skin Pack',
        amount: 399,
        riskScore: 20,
        category: 'Cosmetics',
        status: 'APPROVED',
        time: 'Mon, 5:10 PM',
        day: 'Mon'
      },
      {
        id: 'low-3',
        childName: 'Leo',
        game: 'Unknown Arcade',
        itemName: 'Mystery Coins',
        amount: 899,
        riskScore: 76,
        category: 'Unverified Merchant',
        status: 'BLOCKED',
        time: 'Sun, 8:20 PM',
        day: 'Sun'
      }
    ]
  }
];

const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toChildId = (childName = '') => childName.toLowerCase();

const clone = (value) => structuredClone(value);

const getDisplayTransaction = (transaction, childProfiles = {}) => {
  const childId = transaction.childId || toChildId(transaction.childName);
  const profile = childProfiles[childId] || { age: 10, spending: 0, transactionsTodayCount: 0, avgSpending: 1000 };
  
  const riskAnalysis = calculateRisk({
    age: profile.age,
    purchaseAmount: transaction.amount,
    purchaseCountToday: profile.transactionsTodayCount,
    weeklySpend: profile.spending,
    purchaseTime: transaction.time || 'Just Now',
    merchantCategory: transaction.category || 'In-App'
  });

  return {
    ...transaction,
    childId,
    gameName: transaction.gameName || transaction.game,
    itemName: transaction.itemName || 'Purchase Request',
    category: transaction.category || 'In-App',
    device: transaction.device || `${transaction.childName}'s Device`,
    time: transaction.time || 'Just Now',
    date: transaction.date || 'Today',
    day: transaction.day || 'Sun',
    ageRating: transaction.ageRating || 'E10+',
    
    riskScore: riskAnalysis.score,
    riskLevel: riskAnalysis.level,
    riskReasons: riskAnalysis.reasons,
    recommendation: riskAnalysis.recommendation,
    riskMetrics: riskAnalysis.metrics,
    
    ratios: transaction.ratios || {
      amountRatio: (transaction.amount / profile.avgSpending).toFixed(1)
    },
    aiExplanation:
      transaction.aiExplanation ||
      `${transaction.childName}'s ${transaction.game} purchase has a ${riskAnalysis.score}% risk score and requires guardian approval.`
  };
};

const getScenario = (scenarioId) =>
  demoScenarios.find((scenario) => scenario.id === scenarioId) || demoScenarios[0];

const getScenarioState = (scenarioId) => {
  const scenario = getScenario(scenarioId);
  const historyTransactions = clone(scenario.historyTransactions);
  const pendingTransactions = clone(scenario.pendingTransactions).map(tx => ({
    ...tx,
    status: 'intercepted',
    createdAt: tx.createdAt || '10:42 PM'
  }));
  const blockedTransactions = historyTransactions.filter((item) => item.status === 'BLOCKED' || item.status === 'rejected');
  const approvedTransactions = historyTransactions.filter((item) => item.status === 'APPROVED' || item.status === 'completed');

  return {
    childProfiles: clone(scenario.childProfiles),
    pendingTransactions,
    historyTransactions,
    approvedCount: approvedTransactions.length,
    blockedCount: blockedTransactions.length,
    totalProtectedAmount: blockedTransactions.reduce((total, item) => total + item.amount, 0)
  };
};

const buildWeeklyData = (transactions) =>
  dayOrder.map((day) => ({
    day,
    value: transactions
      .filter((transaction) => transaction.day === day)
      .reduce((total, transaction) => total + transaction.amount, 0)
  }));

const buildCategoryData = (transactions) => {
  const blockedTransactions = transactions.filter((transaction) => transaction.status === 'BLOCKED');
  const total = blockedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categories = blockedTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  return Object.entries(categories)
    .map(([category, value]) => ({
      category,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value);
};

export const AppProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState('landing');
  const [activeScenarioId, setActiveScenarioId] = useState(demoScenarios[0].id);
  const [scenarioState, setScenarioState] = useState(() => getScenarioState(demoScenarios[0].id));
  const [otps, setOtps] = useState({});
  const [activeAlert, setActiveAlert] = useState(() => {
    const state = getScenarioState(demoScenarios[0].id);
    return state.pendingTransactions[0] ? getDisplayTransaction(state.pendingTransactions[0], state.childProfiles) : null;
  });
  const [interceptedPurchase, setInterceptedPurchase] = useState(() => {
    const state = getScenarioState(demoScenarios[0].id);
    return state.pendingTransactions[0] ? getDisplayTransaction(state.pendingTransactions[0], state.childProfiles) : null;
  });
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [aiAnalyses, setAiAnalyses] = useState({});

  const fetchAiAnalysisForTransaction = async (transaction) => {
    if (!transaction) return null;
    if (aiAnalyses[transaction.id]) {
      return aiAnalyses[transaction.id];
    }

    const childId = transaction.childId || toChildId(transaction.childName);
    const profile = childProfiles[childId] || { age: 10, spending: 0, transactionsTodayCount: 0 };

    const input = {
      childAge: profile.age,
      amount: transaction.amount,
      merchant: transaction.gameName || transaction.game || 'Unknown App',
      category: transaction.category || 'In-App',
      riskScore: transaction.riskScore,
      riskLevel: transaction.riskLevel,
      reasons: transaction.riskReasons || [],
      recommendation: transaction.recommendation,
      purchaseCountToday: profile.transactionsTodayCount,
      weeklySpend: profile.spending
    };

    try {
      const analysis = await generateTransactionAnalysis(input);
      setAiAnalyses((prev) => ({
        ...prev,
        [transaction.id]: analysis
      }));
      return analysis;
    } catch (err) {
      console.error('Failed to fetch AI analysis', err);
      return null;
    }
  };

  const {
    childProfiles,
    pendingTransactions,
    historyTransactions,
    approvedCount,
    blockedCount,
    totalProtectedAmount
  } = scenarioState;

  const displayPendingTransactions = useMemo(
    () => pendingTransactions.map(t => getDisplayTransaction(t, childProfiles)),
    [pendingTransactions, childProfiles]
  );

  const displayHistoryTransactions = useMemo(
    () => historyTransactions.map(t => getDisplayTransaction(t, childProfiles)),
    [historyTransactions, childProfiles]
  );

  const analytics = useMemo(() => {
    const combinedTransactions = [
      ...displayHistoryTransactions,
      ...displayPendingTransactions
    ];
    const weeklyData = buildWeeklyData(combinedTransactions);
    const categoryData = buildCategoryData(displayHistoryTransactions);
    const pendingAmount = displayPendingTransactions.reduce((total, item) => total + item.amount, 0);
    const approvedAmount = displayHistoryTransactions
      .filter((item) => item.status === 'APPROVED')
      .reduce((total, item) => total + item.amount, 0);

    return {
      weeklyData,
      categoryData,
      pendingAmount,
      approvedAmount,
      totalTransactionAmount: combinedTransactions.reduce((total, item) => total + item.amount, 0),
      highestRiskScore: combinedTransactions.reduce((highest, item) => Math.max(highest, item.riskScore || 0), 0)
    };
  }, [displayHistoryTransactions, displayPendingTransactions]);

  const switchScenario = (scenarioId) => {
    const nextState = getScenarioState(scenarioId);
    const firstPending = nextState.pendingTransactions[0];

    setActiveScenarioId(scenarioId);
    setScenarioState(nextState);
    setOtps({});
    setActiveAlert(firstPending ? getDisplayTransaction(firstPending, nextState.childProfiles) : null);
    setInterceptedPurchase(firstPending ? getDisplayTransaction(firstPending, nextState.childProfiles) : null);
  };

  const approveTransaction = (id) => {
    const transaction = pendingTransactions.find((item) => item.id === id);
    if (!transaction) return;

    const displayTransaction = getDisplayTransaction(transaction, childProfiles);

    setScenarioState((current) => ({
      ...current,
      pendingTransactions: current.pendingTransactions.filter((item) => item.id !== id),
      historyTransactions: [
        { ...displayTransaction, status: 'APPROVED', time: 'Just Now' },
        ...current.historyTransactions
      ],
      approvedCount: current.approvedCount + 1
    }));

    if (activeAlert?.id === id) {
      setActiveAlert(null);
    }

    if (interceptedPurchase?.id === id) {
      setInterceptedPurchase(null);
    }
  };

  const declineTransaction = (id) => {
    const transaction = pendingTransactions.find((item) => item.id === id);
    if (!transaction) return;

    const displayTransaction = getDisplayTransaction(transaction, childProfiles);

    setScenarioState((current) => ({
      ...current,
      pendingTransactions: current.pendingTransactions.filter((item) => item.id !== id),
      historyTransactions: [
        { ...displayTransaction, status: 'BLOCKED', time: 'Just Now' },
        ...current.historyTransactions
      ],
      blockedCount: current.blockedCount + 1,
      totalProtectedAmount: current.totalProtectedAmount + transaction.amount
    }));

    if (activeAlert?.id === id) {
      setActiveAlert(null);
    }

    if (interceptedPurchase?.id === id) {
      setInterceptedPurchase(null);
    }
  };

  const updateTransactionStatus = (id, newStatus, extraData = {}) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setScenarioState((current) => {
      const pendingTxIndex = current.pendingTransactions.findIndex((item) => item.id === id);
      if (pendingTxIndex === -1) return current;

      const tx = current.pendingTransactions[pendingTxIndex];
      
      const updatedTx = {
        ...tx,
        status: newStatus,
        ...extraData
      };

      // Handle audit timeline
      if (newStatus === 'pending') {
        updatedTx.createdAt = timestamp;
      } else if (newStatus === 'approved') {
        updatedTx.approvedAt = timestamp;
      } else if (newStatus === 'otp_pending') {
        updatedTx.faceVerifiedAt = timestamp;
        updatedTx.otpGeneratedAt = timestamp;
      } else if (newStatus === 'completed') {
        updatedTx.completedAt = timestamp;
      } else if (newStatus === 'rejected') {
        updatedTx.rejectedAt = timestamp;
      }

      let nextPending = [...current.pendingTransactions];
      let nextHistory = [...current.historyTransactions];
      let nextApprovedCount = current.approvedCount;
      let nextBlockedCount = current.blockedCount;
      let nextTotalProtectedAmount = current.totalProtectedAmount;

      const displayTx = getDisplayTransaction(updatedTx, current.childProfiles);

      if (newStatus === 'completed') {
        nextPending = nextPending.filter((item) => item.id !== id);
        nextHistory = [
          { ...displayTx, status: 'completed', time: 'Just Now' },
          ...nextHistory
        ];
        nextApprovedCount += 1;
      } else if (newStatus === 'rejected') {
        nextPending = nextPending.filter((item) => item.id !== id);
        nextHistory = [
          { ...displayTx, status: 'rejected', time: 'Just Now' },
          ...nextHistory
        ];
        nextBlockedCount += 1;
        nextTotalProtectedAmount += tx.amount;
      } else {
        nextPending[pendingTxIndex] = updatedTx;
      }

      setTimeout(() => {
        if (newStatus === 'completed' || newStatus === 'rejected') {
          setActiveAlert(null);
          setInterceptedPurchase(null);
        } else {
          setActiveAlert(displayTx);
          setInterceptedPurchase(displayTx);
        }
      }, 0);

      return {
        ...current,
        pendingTransactions: nextPending,
        historyTransactions: nextHistory,
        approvedCount: nextApprovedCount,
        blockedCount: nextBlockedCount,
        totalProtectedAmount: nextTotalProtectedAmount
      };
    });
  };

  const resetDemo = () => {
    switchScenario(activeScenarioId);
  };

  const saveGeminiKey = (key) => {
    setGeminiApiKey(key);
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        demoScenarios,
        activeScenarioId,
        switchScenario,
        pendingTransactions,
        displayPendingTransactions,
        approvedCount,
        blockedCount,
        totalProtectedAmount,
        approveTransaction,
        declineTransaction,
        resetDemo,
        childProfiles,
        historyTransactions: displayHistoryTransactions,
        analytics,
        monthlySavings: totalProtectedAmount,
        activeAlert,
        setActiveAlert,
        interceptedPurchase,
        setInterceptedPurchase,
        geminiApiKey,
        saveGeminiKey,
        aiAnalyses,
        fetchAiAnalysisForTransaction,
        
        // Phase 2B additions
        otps,
        setOtps,
        updateTransactionStatus,
        generateOTP,
        verifyOTP
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
