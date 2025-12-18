import React, { useState } from 'react';
// CORREÇÃO: Import direto da raiz
import { useFinance } from './FinanceContext';

const Onboarding: React.FC = () => {
  const { finishOnboarding } = useFinance();
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Controle Total", desc: "Monitore cada centavo que entra e sai de forma inteligente.", icon: "💸" },
    { title: "Metas Reais", desc: "Defina objetivos financeiros e acompanhe seu progresso.", icon: "🎯" },
    { title: "Segurança IA", desc: "Insights avançados com inteligência artificial para o seu bolso.", icon: "🤖" },
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finishOnboarding();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
      <div className="w-40 h-40 bg-white rounded-[48px] shadow-2xl flex items-center justify-center text-7xl mb-12 animate-bounce">
        {steps[step].icon}
      </div>
      <h1 className="text-4xl font-black text-black mb-4 tracking-tight">{steps[step].title}</h1>
      <p className="text-gray-500 font-medium leading-relaxed mb-16">{steps[step].desc}</p>
      
      <div className="flex gap-2 mb-10">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-10 bg-[#2952E3]' : 'w-2 bg-gray-200'}`} />
        ))}
      </div>

      <button 
        onClick={next}
        className="w-full h-16 bg-[#2952E3] text-white rounded-[24px] font-black text-lg shadow-xl shadow-[#2952E3]/20 active:scale-95 transition-transform"
      >
        {step === steps.length - 1 ? 'VAMOS COMEÇAR' : 'PRÓXIMO'}
      </button>
    </div>
  );
};

export default Onboarding;
