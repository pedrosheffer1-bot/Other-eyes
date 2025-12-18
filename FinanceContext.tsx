import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, FinanceContextData, User } from './types';

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Tenta carregar dados salvos ou inicia vazio
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('@othereyes:transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('@othereyes:user');
    return saved ? JSON.parse(saved) : null;
  });

  const [goals, setGoals] = useState<any[]>(() => {
    const saved = localStorage.getItem('@othereyes:goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);

  // Efeito para Salvar Automaticamente sempre que algo mudar
  useEffect(() => {
    localStorage.setItem('@othereyes:transactions', JSON.stringify(transactions));
    localStorage.setItem('@othereyes:user', JSON.stringify(user));
    localStorage.setItem('@othereyes:goals', JSON.stringify(goals));
  }, [transactions, user, goals]);

  useEffect(() => {
    // Simula um loading inicial rápido
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addGoal = (goal: any) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals(prev => [...prev, newGoal]);
  };

  const finishOnboarding = () => {
    // Lógica simples de onboarding
    localStorage.setItem('@othereyes:onboarding', 'true');
  };

  // Cálculos dinâmicos
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  return (
    <FinanceContext.Provider value={{
      user,
      setUser,
      transactions,
      addTransaction,
      goals,
      addGoal,
      balance,
      income,
      expenses,
      loading,
      hasFinishedOnboarding: true, // Forçando true para facilitar testes
      finishOnboarding,
      goBack: () => window.history.back()
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
