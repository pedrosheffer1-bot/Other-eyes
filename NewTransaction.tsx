import React, { useState, useEffect, useRef } from 'react';
// CORREÇÃO: Imports diretos da raiz
import { useFinance } from './FinanceContext';
import { CATEGORIES } from './constants';
import { TransactionType } from './types'; // Certifique-se que o arquivo types.ts (ou .tsx) existe na raiz

const NewTransaction: React.FC = () => {
  const { addTransaction, goBack } = useFinance();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [amountRaw, setAmountRaw] = useState(''); // Digits only (e.g., "1250" for 12,50)
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) { // Prevents overflow
      setAmountRaw(value);
    }
  };

  const handleSave = () => {
    if (!amountRaw || parseInt(amountRaw) <= 0) return alert("Insira um valor.");
    if (!selectedCategory) return alert("Selecione uma categoria.");

    triggerHaptic(30);
    addTransaction({
      amount: parseInt(amountRaw) / 100,
      description: description || (type === 'expense' ? 'Nova Despesa' : 'Nova Receita'),
      category: selectedCategory,
      type,
      date: new Date().toISOString(),
    });
    goBack();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F5F0] overflow-hidden">
      
      {/* Header Fixo */}
      <header className="pt-6 pb-4 px-6 flex flex-col items-center bg-[#F8F5F0] z-20">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-8"></div>
        <div className="w-full flex justify-between items-center">
          <button 
            onClick={goBack} 
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400 active:scale-90 transition-transform"
          >
            ✕
          </button>
          
          <div className="bg-white p-1 rounded-full flex gap-1 shadow-inner border border-gray-100">
            <button 
              onClick={() => { triggerHaptic(5); setType('expense'); }} 
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all duration-300 ${type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400'}`}
            >
              GASTO
            </button>
            <button 
              onClick={() => { triggerHaptic(5); setType('income'); }} 
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all duration-300 ${type === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-gray-400'}`}
            >
              GANHO
            </button>
          </div>
          <div className="w-12"></div>
        </div>
      </header>

      {/* Body com Scroll para evitar teclado sobrepondo inputs */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">
        
        {/* Input de Valor Minimalista */}
        <div className="flex flex-col items-center py-12 relative">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Qual o valor?</p>
          
          <div className="relative w-full text-center">
            {/* Input invisível para capturar o teclado nativo */}
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              value={amountRaw}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
              autoFocus
            />
            {/* Display de Valor Estilizado */}
            <h1 className={`text-6xl font-black tracking-tighter transition-colors duration-300 ${amountRaw ? 'text-[#000000]' : 'text-gray-200'}`}>
              {formatToBRL(amountRaw)}
            </h1>
          </div>

          <div className="w-full max-w-[280px] mt-10">
            <input 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (ex: Jantar)"
              className="w-full bg-white h-14 px-6 rounded-2xl text-center font-bold text-[#000000] placeholder:text-gray-300 border-none shadow-sm focus:ring-2 focus:ring-[#2952E3] transition-all"
            />
          </div>
        </div>

        {/* Grid de Categorias */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Categoria</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { triggerHaptic(10); setSelectedCategory(cat.name); }}
                className="flex flex-col items-center gap-2 group transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all border-2 ${
                  selectedCategory === cat.name 
                    ? (type === 'expense' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50')
                    : 'border-transparent bg-white active:scale-90'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[9px] font-black uppercase text-center leading-tight tracking-tighter line-clamp-2 ${
                   selectedCategory === cat.name ? 'text-black' : 'text-gray-400 font-medium'
                }`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Botão Salvar Flutuante (Above Navbar context) */}
      <div className="absolute bottom-10 left-6 right-6 z-30 pointer-events-none">
        <button 
          onClick={handleSave}
          className={`w-full h-18 py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 pointer-events-auto ${
            amountRaw && selectedCategory 
            ? 'bg-[#2952E3] text-white shadow-[#2952E3]/30' 
            : 'bg-gray-200 text-gray-400 shadow-none'
          }`}
        >
          Confirmar Lançamento
        </button>
      </div>

    </div>
  );
};

export default NewTransaction;
