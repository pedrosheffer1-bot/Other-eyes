import React, { useState } from 'react';
// CORREÇÃO: Import direto da raiz
import { useFinance } from './FinanceContext';

const Goals: React.FC = () => {
  const { goals, addGoal } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const handleAddGoal = () => {
    if (!newTitle || !newTarget) return;
    addGoal({
      title: newTitle,
      targetAmount: parseFloat(newTarget),
      currentAmount: 0,
      icon: '🚗'
    });
    setNewTitle('');
    setNewTarget('');
    setShowAdd(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-12 pb-32">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-black tracking-tight">Suas Metas</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="text-[#2952E3] font-black text-sm"
        >
          + CRIAR NOVA
        </button>
      </header>

      {showAdd && (
        <div className="bg-white p-6 rounded-[24px] shadow-lg mb-8 space-y-4 animate-in fade-in duration-300">
          <input 
            placeholder="Nome da Meta (Ex: Carro)" 
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-gray-50 h-14 px-5 rounded-2xl border-none focus:ring-2 focus:ring-[#2952E3]"
          />
          <input 
            type="number"
            placeholder="Valor Objetivo" 
            value={newTarget}
            onChange={e => setNewTarget(e.target.value)}
            className="w-full bg-gray-50 h-14 px-5 rounded-2xl border-none focus:ring-2 focus:ring-[#2952E3]"
          />
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 h-14 bg-gray-100 text-gray-500 rounded-2xl font-bold">Cancelar</button>
            <button onClick={handleAddGoal} className="flex-1 h-14 bg-[#2952E3] text-white rounded-2xl font-bold">Salvar</button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="bg-white p-12 rounded-[24px] text-center shadow-sm">
          <p className="text-gray-400 font-medium">Você ainda não tem metas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="bg-white p-6 rounded-[32px] shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F8F5F0] rounded-2xl flex items-center justify-center text-2xl">{goal.icon}</div>
                    <div>
                      <h3 className="font-bold text-black">{goal.title}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase">R$ {goal.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-[#2952E3] font-black">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2952E3] rounded-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
