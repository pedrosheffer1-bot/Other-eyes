import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/goals', label: 'Metas', icon: '🎯' },
    { path: '/reports', label: 'Dados', icon: '📊' },
    { path: '/profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-8 pb-6 z-40">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-[#2952E3] scale-110' : 'text-gray-300'}`
          }
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}

      {/* Botão de Trigger IA Mini na Navbar */}
      <button
        onClick={onOpenAI}
        className="flex flex-col items-center gap-1.5 text-gray-300 hover:text-[#2952E3] transition-colors"
      >
        <span className="text-2xl">✨</span>
        <span className="text-[9px] font-black uppercase tracking-widest">IA</span>
      </button>
    </div>
  );
};

export default Navbar;
