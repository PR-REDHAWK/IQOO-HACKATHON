import { createContext, useMemo, useState } from 'react';

export const AppContext = createContext();

const initialPendingTransactions = [
  {
    id: 1,
    childName: 'Leo',
    game: 'Roblox',
    amount: 4999,
    riskScore: 91,
    status: 'pending'
  }
];

const initialChildProfiles = {
  leo: {
    name: 'Leo',
    age: 12,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    spending: 0,
    limit: 5000,
    avgSpending: 12,
    transactionsTodayCount: 1
  }
};

const getDisplayTransaction = (transaction) => ({
  ...transaction,
  childId: transaction.childId || transaction.childName.toLowerCase(),
  gameName: transaction.gameName || transaction.game,
  itemName: transaction.itemName || 'Robux Purchase',
  category: transaction.category || 'In-App',
  device: transaction.device || `${transaction.childName}'s Device`,
  time: transaction.time || 'Just Now',
  date: transaction.date || 'Today',
  ageRating: transaction.ageRating || 'E10+',
  riskMetrics: transaction.riskMetrics || {
    ageRisk: 78,
    amountRisk: transaction.riskScore,
    frequencyRisk: 72,
    timeRisk: 64
  },
  ratios: transaction.ratios || {
    amountRatio: '4.2'
  },
  aiExplanation:
    transaction.aiExplanation ||
    `${transaction.childName}'s ${transaction.game} purchase has an elevated risk score and requires guardian approval.`
});

export const AppProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState('landing');
  const [pendingTransactions, setPendingTransactions] = useState(initialPendingTransactions);
  const [approvedCount, setApprovedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [totalProtectedAmount, setTotalProtectedAmount] = useState(0);
  const [historyTransactions, setHistoryTransactions] = useState([]);
  const [activeAlert, setActiveAlert] = useState(getDisplayTransaction(initialPendingTransactions[0]));
  const [interceptedPurchase, setInterceptedPurchase] = useState(getDisplayTransaction(initialPendingTransactions[0]));
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const displayPendingTransactions = useMemo(
    () => pendingTransactions.map(getDisplayTransaction),
    [pendingTransactions]
  );

  const approveTransaction = (id) => {
    const transaction = pendingTransactions.find((item) => item.id === id);
    if (!transaction) return;

    const displayTransaction = getDisplayTransaction(transaction);

    setPendingTransactions((current) => current.filter((item) => item.id !== id));
    setApprovedCount((count) => count + 1);
    setHistoryTransactions((current) => [
      { ...displayTransaction, status: 'APPROVED' },
      ...current
    ]);

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

    const displayTransaction = getDisplayTransaction(transaction);

    setPendingTransactions((current) => current.filter((item) => item.id !== id));
    setBlockedCount((count) => count + 1);
    setTotalProtectedAmount((amount) => amount + transaction.amount);
    setHistoryTransactions((current) => [
      { ...displayTransaction, status: 'BLOCKED' },
      ...current
    ]);

    if (activeAlert?.id === id) {
      setActiveAlert(null);
    }

    if (interceptedPurchase?.id === id) {
      setInterceptedPurchase(null);
    }
  };

  const resetDemo = () => {
    setActiveScreen('landing');
    setPendingTransactions(initialPendingTransactions);
    setApprovedCount(0);
    setBlockedCount(0);
    setTotalProtectedAmount(0);
    setHistoryTransactions([]);
    setActiveAlert(getDisplayTransaction(initialPendingTransactions[0]));
    setInterceptedPurchase(getDisplayTransaction(initialPendingTransactions[0]));
    setGeminiApiKey('');
  };

  const saveGeminiKey = (key) => {
    setGeminiApiKey(key);
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        pendingTransactions,
        displayPendingTransactions,
        approvedCount,
        blockedCount,
        totalProtectedAmount,
        approveTransaction,
        declineTransaction,
        resetDemo,
        childProfiles: initialChildProfiles,
        historyTransactions,
        monthlySavings: totalProtectedAmount,
        activeAlert,
        setActiveAlert,
        interceptedPurchase,
        setInterceptedPurchase,
        geminiApiKey,
        saveGeminiKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
