import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// CORREÇÃO: Importações ajustadas para a raiz (sem pastas)
import { useFinance } from './FinanceContext';
import { getFinancialAdvice } from './geminiService'; 

const Dashboard: React.FC = () => {
  const { balance, income, expenses, transactions } = useFinance();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    // Verifica se existem transações antes de chamar a IA
    if (transactions.length > 0) {
      setLoadingAdvice(true);
      // Se a função getFinancialAdvice der erro ou o arquivo não existir, 
      // comente esse bloco inteiro do useEffect temporariamente.
      getFinancialAdvice(transactions.slice(0, 5), [])
        .then(res => {
          setAdvice(res || "Mantenha o foco em suas metas!");
        })
        .catch(() => {
          // Fallback silencioso em caso de erro na API
          setAdvice("Mantenha o controle para atingir seus sonhos.");
        })
        .finally(() => {
          setLoadingAdvice(false);
        });
    }
  }, [transactions.length]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8F5F0] relative">
      <div className="px-6 pt-12 pb-32">
        {/* TOP BAR - PERFIL RÁPIDO */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
            <span className="text-xl">👋</span>
          </div>
          <button 
            onClick={() => navigate('/new')}
            className="px-6 py-3 bg-[#2952E3] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#2952E3]/20 active:scale-95 transition-transform"
          >
            Novo Gasto
          </button>
        </div>

        {/* SALDO PRINCIPAL - REGRA DE OURO: PRETO PURO */}
        <header className="flex flex-col mb-10">
          <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Saldo em conta</h1>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-300">R$</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-5xl font-black text-[#000000] tracking-tighter truncate leading-none">
                {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>
        </header>

        {/* RESUMO DE ENTRADAS E SAÍDAS */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100/50">
            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <span className="text-green-600 font-bold text-sm">↙</span>
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ganhos</p>
            <p className="text-lg font-black text-[#000000]">
              R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100/50">
            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center mb-3">
              <span className="text-red-600 font-bold text-sm">↗</span>
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gastos</p>
            <p className="text-lg font-black text-[#000000]">
              R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* INSIGHT IA - CARD PREMIUM */}
        <section className="mb-10">
          <div className="bg-[#2952E3] text-white p-8 rounded-[36px] shadow-2xl shadow-[#2952E3]/30 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-sm">✨</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Other Eyes AI</h3>
            </div>
            {loadingAdvice ? (
              <div className="space-y-3">
                <div className="h-3 bg-white/20 rounded-full w-full animate-pulse"></div>
                <div className="h-3 bg-white/20 rounded-full w-2/3 animate-pulse delay-75"></div>
              </div>
            ) : (
              <p className="text-[15px] leading-relaxed font-bold italic">
                "{advice || "Analise seus dados para economizar mais este mês."}"
              </p>
            )}
          </div>
        </section>

        {/* ÚLTIMAS ATIVIDADES */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-[#000000] tracking-tight">Atividades</h2>
            <button className="text-[10px] font-black text-[#2952E3] uppercase tracking-widest">Histórico</button>
          </div>
          
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="bg-white/40 border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Nada por aqui</p>
              </div>
            ) : (
              transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-[28px] flex items-center gap-4 shadow-sm border border-gray-50 active:scale-[0.97] transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${t.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {t.isSubscription ? '🔄' : '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[#000000] text-sm truncate">{t.description}</h4>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{t.category}</p>
                  </div>
                  <div className={`font-black text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* FAB DA IA - CANTO INFERIOR DIREITO */}
      <div className="fixed bottom-28 right-6 z-50">
        <button 
          onClick={() => navigate('/profile')} 
          className="w-16 h-16 bg-[#2952E3] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#2952E3]/40 active:scale-90 transition-all hover:rotate-12"
        >
          <span className="text-2xl">✨</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
