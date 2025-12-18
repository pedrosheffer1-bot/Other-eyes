import React, { useState } from 'react';
// CORREÇÃO: Imports diretos da raiz
import { useFinance } from './FinanceContext';
import { CATEGORIES } from './constants'; // Verifique se constants.ts existe na raiz

// --- Reusable "Widgets" (Components) ---

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3">
      {title}
    </h2>
    <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
      {children}
    </div>
  </div>
);

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  showChevron?: boolean;
  onTap?: () => void;
  toggle?: {
    value: boolean;
    onChange: (val: boolean) => void;
  };
  isLast?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, title, subtitle, value, showChevron = true, onTap, toggle, isLast 
}) => (
  <div 
    onClick={onTap}
    className={`flex items-center justify-between p-5 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 bg-[#F8F5F0] rounded-2xl flex items-center justify-center text-xl shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-[#000000]">{title}</span>
        {subtitle && <span className="text-[11px] font-bold text-gray-400">{subtitle}</span>}
      </div>
    </div>
    
    <div className="flex items-center gap-3">
      {value && <span className="text-xs font-black text-[#2952E3] opacity-80">{value}</span>}
      
      {toggle ? (
        <button 
          onClick={(e) => { e.stopPropagation(); toggle.onChange(!toggle.value); }}
          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${toggle.value ? 'bg-[#2952E3]' : 'bg-gray-200'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${toggle.value ? 'left-7' : 'left-1'}`} />
        </button>
      ) : (
        showChevron && <span className="text-gray-300 font-bold">→</span>
      )}
    </div>
  </div>
);

// --- Main Screen ---

const Profile: React.FC = () => {
  const { user, setUser, transactions } = useFinance();
  const [dailyReminder, setDailyReminder] = useState(true);

  const toggleBiometrics = () => {
    if (user) {
      setUser({ ...user, isBiometricsEnabled: !user.isBiometricsEnabled });
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return alert("Nenhuma transação para exportar.");
    
    const headers = "Data,Descrição,Categoria,Valor,Tipo\n";
    const rows = transactions.map(t => 
      `${new Date(t.date).toLocaleDateString()},${t.description},${t.category},${t.amount},${t.type}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_OtherEyes_${new Date().getMonth()+1}.csv`;
    a.click();
  };

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent("Olá! Sou usuário do Other Eyes e preciso de suporte.");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8F5F0] px-6 pt-12 pb-32">
      
      {/* Header (Avatar & Bio) */}
      <header className="mb-12 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 bg-white rounded-[36px] shadow-2xl flex items-center justify-center text-5xl border-4 border-white">
            👤
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#2952E3] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-tighter">
            PRO MEMBER
          </div>
        </div>
        <h1 className="text-2xl font-black text-[#000000] tracking-tight">{user?.name || 'Usuário'}</h1>
        <p className="text-sm font-bold text-gray-400 mt-1">{user?.email}</p>
      </header>

      {/* SESSÃO CONTA */}
      <SettingsSection title="Sua Conta">
        <SettingsItem 
          icon="🔐" 
          title="Biometria / Face ID" 
          subtitle="Segurança extra ao abrir o app"
          toggle={{ value: user?.isBiometricsEnabled || false, onChange: toggleBiometrics }}
        />
        <SettingsItem 
          icon="💳" 
          title="Meus Cartões" 
          subtitle="Gerencie métodos de pagamento"
        />
        <SettingsItem 
          icon="📥" 
          title="Exportar Dados (CSV)" 
          subtitle="Baixar histórico completo"
          showChevron={false}
          onTap={handleExportCSV}
          isLast
        />
      </SettingsSection>

      {/* SESSÃO PREFERÊNCIAS */}
      <SettingsSection title="Preferências">
        <SettingsItem 
          icon="🔔" 
          title="Lembrete Diário" 
          value="20:00"
          toggle={{ value: dailyReminder, onChange: setDailyReminder }}
        />
        <SettingsItem 
          icon="💵" 
          title="Moeda Principal" 
          value="BRL (R$)"
          isLast
        />
      </SettingsSection>

      {/* SESSÃO SUPORTE */}
      <SettingsSection title="Apoio & Suporte">
        <SettingsItem 
          icon="💬" 
          title="Falar no WhatsApp" 
          subtitle="Suporte técnico especializado"
          onTap={handleWhatsAppSupport}
          isLast
        />
      </SettingsSection>

      {/* Logout Button */}
      <div className="mt-4 px-4">
        <button 
          onClick={() => setUser(null)}
          className="w-full h-16 bg-red-50 text-red-600 rounded-[24px] font-black text-sm uppercase tracking-widest active:bg-red-100 transition-colors flex items-center justify-center gap-3 border border-red-100"
        >
          <span>🚪</span> Sair da Conta
        </button>
        
        <p className="text-center mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Other Eyes Control • v1.2.0
        </p>
      </div>

    </div>
  );
};

export default Profile;
