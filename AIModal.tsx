
import React, { useState, useEffect, useRef } from 'react';
import { chatWithAI } from '../services/geminiService';
import { useFinance } from '../context/FinanceContext';

const AIModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { transactions, balance } = useFinance();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Olá! Sou seu assistente Other Eyes. Como posso ajudar com suas finanças hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const context = `O usuário tem saldo de R$ ${balance} e ${transactions.length} transações recentes.`;
    const aiResponse = await chatWithAI(userMsg, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Desculpe, não entendi." }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8F5F0] animate-in slide-in-from-bottom duration-300">
      <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2952E3] rounded-2xl flex items-center justify-center text-white text-xl">✨</div>
          <h2 className="font-black text-lg">Finance AI</h2>
        </div>
        <button onClick={onClose} className="text-2xl text-gray-400">✕</button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-[24px] text-sm font-medium shadow-sm leading-relaxed ${
              m.role === 'user' ? 'bg-[#2952E3] text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-[24px] shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte qualquer coisa..."
          className="flex-1 h-14 px-6 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-[#2952E3] font-medium text-black"
        />
        <button 
          onClick={handleSend}
          className="w-14 h-14 bg-[#2952E3] text-white rounded-full flex items-center justify-center text-xl shadow-lg active:scale-90 transition-transform"
        >
          ➔
        </button>
      </div>
    </div>
  );
};

export default AIModal;
