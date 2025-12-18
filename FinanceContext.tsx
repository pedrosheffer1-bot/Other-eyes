
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc 
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { Transaction, FinanceContextData, User } from './types';

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Monitora se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.email?.split('@')[0] || 'Usuário',
          isBiometricsEnabled: false
        });
      } else {
        setUser(null);
        setTransactions([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Se logado, busca os dados do banco em Tempo Real
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    
    // Isso é o "Realtime Listener". Se mudar no banco, muda na tela na hora.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      // Ordena por data (mais recente primeiro)
      setTransactions(docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    return () => unsubscribe();
  }, [user]);

  // Funções de Banco de Dados
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "transactions"), {
        ...transaction,
        userId: user.uid, // Associa o gasto ao usuário atual
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Erro ao salvar:", e);
      alert("Erro ao salvar. Verifique sua conexão.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Cálculos
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  return (
    <FinanceContext.Provider value={{
      user,
      setUser, // Usado apenas internamente pelo Auth
      transactions,
      addTransaction,
      goals: [], // Implementar metas no futuro
      addGoal: () => {},
      balance,
      income,
      expenses,
      loading,
      hasFinishedOnboarding: true,
      finishOnboarding: () => {},
      goBack: () => window.history.back(),
      logout // Nova função para exportar
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
