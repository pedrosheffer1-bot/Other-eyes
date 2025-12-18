import React, { useState } from 'react';
// CORREÇÃO: Import direto da raiz
import { useFinance } from './FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Reports: React.FC = () => {
  const { transactions, income, expenses } = useFinance();
  const [isExporting, setIsExporting] = useState(false);

  const pieData = [
    { name: 'Receitas', value: income, color: '#10b981' },
    { name: 'Despesas', value: expenses, color: '#ef4444' },
  ];

  const handleExportPDF = () => {
    setIsExporting(true);
    // Simulação de geração de PDF via biblioteca 'pdf' (ou window.print)
    setTimeout(() => {
      setIsExporting(false);
      alert("Relatório PDF Gerado! Compartilhando com WhatsApp...");
    }, 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8F5F0] px-6 pt-12 pb-32">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">Análise</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">Mensal • Março</p>
        </div>
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-xl transition-all ${isExporting ? 'bg-gray-100' : 'bg-white active:scale-90 shadow-lg'}`}
        >
          {isExporting ? '⏳' : '📤'}
        </button>
      </header>

      {/* CHART SECTION */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm mb-8 border border-gray-50 flex flex-col items-center">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Composição de Gastos</h3>
        
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full grid grid-cols-2 gap-6 mt-8">
          <div className="bg-green-50 p-4 rounded-3xl text-center">
            <span className="text-[9px] font-black text-green-700 uppercase block mb-1">Total Recebido</span>
            <span className="text-lg font-black text-[#000000]">R$ {income.toLocaleString()}</span>
          </div>
          <div className="bg-red-50 p-4 rounded-3xl text-center">
            <span className="text-[9px] font-black text-red-700 uppercase block mb-1">Total Gasto</span>
            <span className="text-lg font-black text-[#000000]">R$ {expenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Maiores Categorias</h3>
        <div className="space-y-6">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-300 font-bold py-6">Sem dados suficientes.</p>
          ) : (
            ['Alimentação', 'Transporte', 'Lazer'].map(cat => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-black">{cat}</span>
                  <span className="text-xs font-bold text-gray-400">R$ 450,00</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2952E3] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
