
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Goal, User, Budget } from '../types';

interface FinanceContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
  loading: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'userId'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: Omit<Goal, 'id' | 'userId'>) => void;
  updateBudget: (category: string, limit: number) => void;
  hasFinishedOnboarding: boolean;
  finishOnboarding: () => void;
  balance: number;
  income: number;
  expenses: number;
  goBack: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOnboarding = localStorage.getItem('onboarding_complete');
    const storedTransactions = localStorage.getItem('transactions');
    const storedGoals = localStorage.getItem('goals');
    const storedBudgets = localStorage.getItem('budgets');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedOnboarding) setHasFinishedOnboarding(true);
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedGoals) setGoals(JSON.parse(storedGoals));
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));

    setLoading(false);
  }, []);

  // Process Recurring Transactions on App Load
  useEffect(() => {
    if (transactions.length > 0 && user) {
      const now = new Date();
      
      const subscriptions = transactions.filter(t => t.isSubscription);
      const newTransactions: Transaction[] = [];

      subscriptions.forEach(sub => {
        const alreadyPaidThisMonth = transactions.find(t => 
          t.description === sub.description && 
          new Date(t.date).getMonth() === now.getMonth() &&
          new Date(t.date).getFullYear() === now.getFullYear() &&
          t.id !== sub.id
        );

        const subDate = new Date(sub.date);
        const isFromPastMonth = subDate.getMonth() !== now.getMonth() || subDate.getFullYear() !== now.getFullYear();

        if (!alreadyPaidThisMonth && isFromPastMonth) {
          newTransactions.push({
            ...sub,
            id: Math.random().toString(36).substr(2, 9),
            date: now.toISOString(),
          });
        }
      });

      if (newTransactions.length > 0) {
        setTransactions(prev => [...newTransactions, ...prev]);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    const newT: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid
    };
    setTransactions(prev => [newT, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (g: Omit<Goal, 'id' | 'userId'>) => {
    if (!user) return;
    const newGoal: Goal = {
      ...g,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateBudget = (category: string, limit: number) => {
    if (!user) return;
    setBudgets(prev => {
      const existing = prev.findIndex(b => b.category === category);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = { category, limit, userId: user.uid };
        return updated;
      }
      return [...prev, { category, limit, userId: user.uid }];
    });
  };

  const finishOnboarding = () => {
    setHasFinishedOnboarding(true);
    localStorage.setItem('onboarding_complete', 'true');
  };

  const goBack = () => {
    // Abstração de navegação para permitir limpezas de estado global no futuro
    window.history.back();
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  return (
    <FinanceContext.Provider value={{
      user, setUser, transactions, goals, budgets, loading,
      addTransaction, deleteTransaction, addGoal, updateBudget,
      hasFinishedOnboarding, finishOnboarding,
      balance, income, expenses, goBack
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within a FinanceProvider");
  return context;
};
