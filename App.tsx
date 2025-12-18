import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// CORREÇÃO: Removidos os caminhos de pastas (screens/, components/, etc)
import Dashboard from './Dashboard';
import NewTransaction from './NewTransaction';
import Goals from './Goals';
import Reports from './Reports';
import Profile from './Profile';
import Onboarding from './Onboarding';
import Auth from './Auth';
import Navbar from './Navbar';
import AIModal from './AIModal';
import { useFinance } from './FinanceContext';

const App: React.FC = () => {
  const { user, loading, hasFinishedOnboarding } = useFinance();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8F5F0]">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#2952E3] rounded-[32px] flex items-center justify-center shadow-2xl animate-pulse">
             <span className="text-white text-4xl font-black">O</span>
          </div>
          <p className="mt-6 text-[#000000] font-black uppercase tracking-[0.3em] text-xs">Other Eyes</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen w-screen max-w-md mx-auto relative flex flex-col bg-[#F8F5F0] overflow-hidden">
        <Routes>
          {!hasFinishedOnboarding ? (
            <Route path="*" element={<Onboarding />} />
          ) : !user ? (
            <Route path="*" element={<Auth />} />
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewTransaction />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>

        {user && <Navbar onOpenAI={() => setIsAIModalOpen(true)} />}
        <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      </div>
    </Router>
  );
};

export default App;
