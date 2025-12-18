
import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from './FinanceContext';
import { CATEGORIES } from './constants';
import { TransactionType } from './types';

const NewTransaction: React.FC = () => {
  const { addTransaction, goBack } = useFinance();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [amountRaw, setAmountRaw] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const triggerHaptic = (ms = 15) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(ms);
    }
  };

  const formatToBRL = (raw: string) => {
    if (!raw) return 'R$ 0,00';
    const amount = parseInt(raw, 10) / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) setAmountRaw(value);
  };

  // MÁGICA AQUI: Salva automaticamente ao escolher a categoria
  const handleSelectCategoryAndSave = (categoryName: string) => {
    triggerHaptic(30);

    // Validação rápida
    if (!amountRaw || parseInt(amountRaw) <= 0) {
      alert("Ops! Digite um valor antes de escolher a categoria.");
      return;
    }

    // Salva direto
    addTransaction({
      amount: parseInt(amountRaw) / 100,
      description: description || (type === 'expense' ? categoryName : 'Entrada'), // Usa o nome da categoria se não tiver descrição
      category: categoryName,
      type,
      date: new Date().toISOString(),
    });

    // Volta para a Home
    goBack();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F5F0] overflow-hidden">
      
      {/* Header */}
      <header className="pt-6 pb-4 px-6 flex flex-col items-center bg-[#F8F5F0] z-20">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-8"></div>
        <div className="w-full flex justify-between items-center">
          <button onClick={goBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">✕</button>
          
          <div className="bg-white p-1 rounded-full flex gap-1 shadow-inner border border-gray-100">
            <button 
              onClick={() => { triggerHaptic(5); setType('expense'); }} 
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all ${type === 'expense' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
            >
              GASTO
            </button>
            <button 
              onClick={() => { triggerHaptic(5); setType('income'); }} 
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all ${type === 'income' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
            >
              GANHO
            </button>
          </div>
          <div className="w-12"></div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-10">
        
        {/* Input Valor */}
        <div className="flex flex-col items-center py-8 relative">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Qual o valor?</p>
          <div className="relative w-full text-center">
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              value={amountRaw}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0"
              autoFocus
            />
            <h1 className={`text-6xl font-black tracking-tighter transition-colors ${amountRaw ? 'text-[#000000]' : 'text-gray-200'}`}>
              {formatToBRL(amountRaw)}
            </h1>
          </div>

          <div className="w-full max-w-[280px] mt-8">
            <input 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (Opcional)"
              className="w-full bg-white h-14 px-6 rounded-2xl text-center font-bold text-[#000000] placeholder:text-gray-300 border-none shadow-sm focus:ring-2 focus:ring-[#2952E3]"
            />
          </div>
        </div>

        {/* Grid de Categorias (Agora são botões de ação final) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Selecione para Confirmar</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 pb-20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategoryAndSave(cat.name)}
                className="flex flex-col items-center gap-2 group active:scale-90 transition-transform duration-200"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-white border-2 border-transparent group-hover:border-[#2952E3]/20">
                  {cat.icon}
                </div>
                <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-[#2952E3]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewTransaction;
