import React, { useState } from 'react';
import { useFinance } from './FinanceContext';

// Componentes Visuais (Widgets)
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 mt-8">
    {title}
  </h2>
);

const SettingItem: React.FC<{ 
  icon: string; 
  title: string; 
  value?: string; 
  onClick?: () => void;
  isDestructive?: boolean;
}> = ({ icon, title, value, onClick, isDestructive }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white p-5 flex items-center justify-between active:bg-gray-50 transition-colors border-b border-gray-50 last:border-none first:rounded-t-[24px] last:rounded-b-[24px]"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-[#F8F5F0] text-black'}`}>
        {icon}
      </div>
      <span className={`text-sm font-black ${isDestructive ? 'text-red-500' : 'text-[#000000]'}`}>
        {title}
      </span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs font-bold text-gray-400">{value}</span>}
      {!value && <span className="text-gray-300 text-lg">›</span>}
    </div>
  </button>
);

const Profile: React.FC = () => {
  const { user, logout, transactions } = useFinance();
  const [isEditingCategories, setIsEditingCategories] = useState(false);

  // Simulação de categorias (depois virá do Firebase)
  const [categories, setCategories] = useState(['Alimentação', 'Transporte', 'Lazer', 'Contas', 'Saúde']);

  const handleEditProfile = () => {
    const newName = prompt("Como você quer ser chamado?", user?.name);
    if (newName) {
      // AQUI: Você chamaria uma função updateProfile do Firebase
      alert("Nome atualizado para: " + newName);
    }
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Data,Valor,Categoria,Descrição\n"
      + transactions.map(t => `${t.date},${t.amount},${t.category},${t.description}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8F5F0] px-6 pt-12 pb-32">
      
      {/* HEADER DO PERFIL */}
      <header className="flex flex-col items-center mb-10">
        <div className="relative group cursor-pointer" onClick={handleEditProfile}>
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center text-4xl overflow-hidden">
            {/* Se tivesse foto: <img src={user.photoURL} /> */}
            <span>👤</span>
          </div>
          <div className="absolute bottom-0 right-0 bg-[#2952E3] p-1.5 rounded-full border-2 border-white">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
        </div>
        <h1 className="mt-4 text-xl font-black text-black">{user?.name || 'Visitante'}</h1>
        <p className="text-xs font-bold text-gray-400">{user?.email}</p>
      </header>

      {/* SEÇÃO PRINCIPAL */}
      <SectionHeader title="Geral" />
      <div className="shadow-sm rounded-[24px]">
        <SettingItem 
          icon="🏷️" 
          title="Minhas Categorias" 
          value={`${categories.length} ativas`}
          onClick={() => setIsEditingCategories(!isEditingCategories)} 
        />
        {isEditingCategories && (
          <div className="bg-white px-5 pb-5 border-t border-gray-50 animate-in slide-in-from-top duration-200">
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black uppercase text-gray-500 border border-gray-100 flex items-center gap-2">
                  {cat} <button className="text-red-400 hover:text-red-600">×</button>
                </span>
              ))}
              <button 
                onClick={() => {
                  const newCat = prompt("Nome da nova categoria:");
                  if(newCat) setCategories([...categories, newCat]);
                }}
                className="px-3 py-1 bg-[#2952E3]/10 text-[#2952E3] rounded-lg text-[10px] font-black uppercase border border-dashed border-[#2952E3]"
              >
                + Adicionar
              </button>
            </div>
          </div>
        )}
        <SettingItem icon="🔔" title="Notificações" value="Ativado" />
        <SettingItem icon="🌙" title="Aparência" value="Dark Mode" />
      </div>

      {/* SEÇÃO DADOS */}
      <SectionHeader title="Seus Dados" />
      <div className="shadow-sm rounded-[24px]">
        <SettingItem icon="📊" title="Exportar Relatório" value="CSV" onClick={handleExportData} />
        <SettingItem icon="☁️" title="Backup no Firebase" value="Automático" />
      </div>

      {/* SEÇÃO CONTA */}
      <SectionHeader title="Conta" />
      <div className="shadow-sm rounded-[24px] mb-8">
        <SettingItem icon="🔒" title="Alterar Senha" />
        <SettingItem 
          icon="🚪" 
          title="Sair do App" 
          isDestructive 
          onClick={logout} 
        />
      </div>

      <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">
        Other Eyes ID: {user?.uid?.slice(0, 8) || '---'}
      </p>

    </div>
  );
};

export default Profile;
