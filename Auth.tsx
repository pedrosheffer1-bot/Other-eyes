
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const Auth: React.FC = () => {
  const { setUser } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Preencha todos os campos!");
    
    setUser({
      uid: 'user_' + Math.random().toString(36).substr(2, 5),
      email: email,
      name: email.split('@')[0],
      isBiometricsEnabled: false
    });
  };

  return (
    <div className="flex-1 flex flex-col p-8 justify-center">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-black tracking-tight mb-2">
          {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        </h1>
        <p className="text-gray-500 font-medium">Controle suas finanças com inteligência.</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">E-mail</label>
          <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white h-16 px-6 rounded-[24px] shadow-sm border-none focus:ring-2 focus:ring-[#2952E3] font-medium text-black"
            placeholder="seu@email.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Senha</label>
          <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white h-16 px-6 rounded-[24px] shadow-sm border-none focus:ring-2 focus:ring-[#2952E3] font-medium text-black"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          className="w-full h-16 bg-[#2952E3] text-white rounded-[24px] font-black text-lg shadow-xl shadow-[#2952E3]/20 mt-4 active:scale-95 transition-transform"
        >
          {isLogin ? 'ENTRAR' : 'CADASTRAR'}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-8 text-gray-400 font-bold text-sm"
      >
        {isLogin ? 'NÃO TEM CONTA? CADASTRE-SE' : 'JÁ TEM CONTA? FAÇA LOGIN'}
      </button>
    </div>
  );
};

export default Auth;
